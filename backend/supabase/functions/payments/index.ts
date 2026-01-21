import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import {
    handleCors,
    successResponse,
    errorResponse,
    unauthorizedResponse,
    notFoundResponse,
    parseBody,
} from '../_shared/response.ts';
import {
    createRazorpayOrder,
    verifyRazorpaySignature,
    verifyWebhookSignature,
    processRazorpayRefund,
    getRazorpayKeyId,
} from '../_shared/razorpay.ts';
import { validatePaymentVerification } from '../_shared/validation.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;

    const url = new URL(req.url);
    const path = url.pathname.replace('/payments', '');
    const pathParts = path.split('/').filter(Boolean);

    try {
        // POST /payments/create-order
        if (req.method === 'POST' && pathParts[0] === 'create-order') {
            const authHeader = req.headers.get('Authorization');
            if (!authHeader) return unauthorizedResponse();

            const supabase = createClient(supabaseUrl, supabaseAnonKey, {
                global: { headers: { Authorization: authHeader } },
            });
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return unauthorizedResponse();

            const body = await parseBody<{ registration_id: string }>(req);
            if (!body?.registration_id) return errorResponse('registration_id is required');

            const adminClient = createClient(supabaseUrl, supabaseServiceKey);

            // Get registration with sport
            const { data: registration } = await adminClient
                .from('registrations')
                .select('*, sport:sports(*)')
                .eq('id', body.registration_id)
                .eq('participant_id', user.id)
                .single();

            if (!registration) return notFoundResponse('Registration not found');
            if (registration.status !== 'payment_pending') {
                return errorResponse('Registration is not pending payment');
            }

            // Check for existing pending payment
            const { data: existingPayment } = await adminClient
                .from('payments')
                .select('razorpay_order_id')
                .eq('registration_id', body.registration_id)
                .eq('status', 'pending')
                .single();

            if (existingPayment?.razorpay_order_id) {
                return errorResponse('Payment already initiated');
            }

            // Calculate fees
            const sport = registration.sport;
            const now = new Date();
            const earlyBirdDeadline = sport.early_bird_deadline ? new Date(sport.early_bird_deadline) : null;
            const amount = earlyBirdDeadline && now < earlyBirdDeadline && sport.early_bird_fees
                ? sport.early_bird_fees : sport.fees;

            // Get convenience fee from settings
            const { data: feeSetting } = await adminClient
                .from('settings')
                .select('value')
                .eq('key', 'convenience_fee')
                .single();
            const convenienceFee = parseFloat(feeSetting?.value || '0');
            const totalAmount = amount + convenienceFee;

            // Create Razorpay order
            const razorpayOrder = await createRazorpayOrder(
                totalAmount,
                'INR',
                registration.registration_number,
                { registration_id: body.registration_id, user_id: user.id }
            );

            // Create payment record
            const { data: payment, error: paymentError } = await adminClient
                .from('payments')
                .insert({
                    registration_id: body.registration_id,
                    user_id: user.id,
                    amount,
                    convenience_fee: convenienceFee,
                    total_amount: totalAmount,
                    method: 'online',
                    status: 'pending',
                    razorpay_order_id: razorpayOrder.id,
                })
                .select()
                .single();

            if (paymentError) return errorResponse(paymentError.message);

            // Get user profile for prefill
            const { data: profile } = await adminClient
                .from('profiles')
                .select('name, email, phone')
                .eq('id', user.id)
                .single();

            return successResponse({
                order_id: razorpayOrder.id,
                amount: Math.round(totalAmount * 100), // In paise
                currency: 'INR',
                key_id: getRazorpayKeyId(),
                registration,
                prefill: profile ? { name: profile.name, email: profile.email, contact: profile.phone } : {},
            });
        }

        // POST /payments/verify
        if (req.method === 'POST' && pathParts[0] === 'verify') {
            const authHeader = req.headers.get('Authorization');
            if (!authHeader) return unauthorizedResponse();

            const supabase = createClient(supabaseUrl, supabaseAnonKey, {
                global: { headers: { Authorization: authHeader } },
            });
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return unauthorizedResponse();

            const body = await parseBody<{
                razorpay_order_id: string;
                razorpay_payment_id: string;
                razorpay_signature: string;
            }>(req);

            if (!body) return errorResponse('Invalid request body');

            const validation = validatePaymentVerification(body);
            if (!validation.valid) {
                return errorResponse(`Validation failed: ${validation.errors.map(e => e.message).join(', ')}`);
            }

            const adminClient = createClient(supabaseUrl, supabaseServiceKey);

            // Get payment record
            const { data: payment } = await adminClient
                .from('payments')
                .select('*, registration:registrations(*, sport:sports(name))')
                .eq('razorpay_order_id', body.razorpay_order_id)
                .single();

            if (!payment) return notFoundResponse('Payment not found');
            if (payment.user_id !== user.id) return errorResponse('Unauthorized', 403);
            if (payment.status === 'success') return errorResponse('Payment already verified');

            // Verify signature
            const isValid = await verifyRazorpaySignature(
                body.razorpay_order_id,
                body.razorpay_payment_id,
                body.razorpay_signature
            );

            if (!isValid) {
                // Update payment as failed
                await adminClient.from('payments')
                    .update({ status: 'failed', gateway_response: { error: 'Invalid signature' } })
                    .eq('id', payment.id);

                await adminClient.rpc('create_audit_log', {
                    p_action: 'payment.verification.failed',
                    p_entity_type: 'payment',
                    p_entity_id: payment.id,
                });

                return errorResponse('Payment verification failed', 400);
            }

            // Update payment as success
            const { data: updatedPayment, error: updateError } = await adminClient
                .from('payments')
                .update({
                    status: 'success',
                    razorpay_payment_id: body.razorpay_payment_id,
                    razorpay_signature: body.razorpay_signature,
                })
                .eq('id', payment.id)
                .select()
                .single();

            if (updateError) return errorResponse(updateError.message);

            // Get updated registration
            const { data: registration } = await adminClient
                .from('registrations')
                .select('*')
                .eq('id', payment.registration_id)
                .single();

            await adminClient.from('notifications').insert({
                recipient_id: user.id,
                type: 'payment',
                priority: 'high',
                title: 'Payment Successful',
                message: `Payment of ₹${payment.total_amount} confirmed for ${payment.registration.sport.name}`,
                related_registration_id: payment.registration_id,
            });

            return successResponse({
                success: true,
                registration,
                payment: updatedPayment,
                receipt_number: updatedPayment.receipt_number,
            });
        }

        // POST /payments/webhook - Razorpay webhook
        if (req.method === 'POST' && pathParts[0] === 'webhook') {
            const signature = req.headers.get('X-Razorpay-Signature');
            if (!signature) return errorResponse('Missing signature', 400);

            const bodyText = await req.text();
            const isValid = await verifyWebhookSignature(bodyText, signature);

            if (!isValid) return errorResponse('Invalid signature', 400);

            const event = JSON.parse(bodyText);
            const adminClient = createClient(supabaseUrl, supabaseServiceKey);

            switch (event.event) {
                case 'payment.captured': {
                    const paymentId = event.payload.payment.entity.id;
                    const orderId = event.payload.payment.entity.order_id;

                    const { data: payment } = await adminClient
                        .from('payments')
                        .select('*')
                        .eq('razorpay_order_id', orderId)
                        .single();

                    if (payment && payment.status !== 'success') {
                        await adminClient.from('payments')
                            .update({ status: 'success', razorpay_payment_id: paymentId, gateway_response: event.payload })
                            .eq('id', payment.id);
                    }
                    break;
                }
                case 'payment.failed': {
                    const orderId = event.payload.payment.entity.order_id;
                    await adminClient.from('payments')
                        .update({ status: 'failed', gateway_response: event.payload })
                        .eq('razorpay_order_id', orderId);
                    break;
                }
                case 'refund.processed': {
                    const paymentId = event.payload.refund.entity.payment_id;
                    await adminClient.from('payments')
                        .update({ status: 'refunded', refund_id: event.payload.refund.entity.id })
                        .eq('razorpay_payment_id', paymentId);
                    break;
                }
            }

            return successResponse({ received: true });
        }

        // GET /payments/me
        if (req.method === 'GET' && pathParts[0] === 'me') {
            const authHeader = req.headers.get('Authorization');
            if (!authHeader) return unauthorizedResponse();

            const supabase = createClient(supabaseUrl, supabaseAnonKey, {
                global: { headers: { Authorization: authHeader } },
            });
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return unauthorizedResponse();

            const { data: payments, error } = await supabase
                .from('payments')
                .select('*, registration:registrations(*, sport:sports(name))')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) return errorResponse(error.message);
            return successResponse({ payments });
        }

        return errorResponse('Not found', 404);
    } catch (error) {
        console.error('Payments error:', error);
        return errorResponse('Internal server error', 500);
    }
});
