import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import {
    handleCors,
    successResponse,
    errorResponse,
    unauthorizedResponse,
    notFoundResponse,
    parseBody,
    getQueryParams,
} from '../_shared/response.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;

    const url = new URL(req.url);
    const path = url.pathname.replace('/admin', '');
    const pathParts = path.split('/').filter(Boolean);

    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) return unauthorizedResponse();

        const supabase = createClient(supabaseUrl, supabaseAnonKey, {
            global: { headers: { Authorization: authHeader } },
        });
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return unauthorizedResponse();

        // Check admin role
        const adminClient = createClient(supabaseUrl, supabaseServiceKey);
        const { data: profile } = await adminClient
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profile?.role !== 'admin') {
            return errorResponse('Forbidden: Admin access required', 403);
        }

        // GET /admin/registrations
        if (req.method === 'GET' && pathParts[0] === 'registrations' && pathParts.length === 1) {
            const params = getQueryParams(req);
            const page = parseInt(params.get('page') || '1');
            const limit = parseInt(params.get('limit') || '20');
            const offset = (page - 1) * limit;

            let query = adminClient
                .from('registrations')
                .select('*, participant:profiles(*), sport:sports(name, slug)', { count: 'exact' });

            if (params.get('sport_id')) query = query.eq('sport_id', params.get('sport_id'));
            if (params.get('status')) query = query.eq('status', params.get('status'));
            if (params.get('payment_status')) query = query.eq('payment_status', params.get('payment_status'));
            if (params.get('college')) query = query.eq('participant.college', params.get('college'));
            if (params.get('search')) {
                query = query.or(`registration_number.ilike.%${params.get('search')}%,participant.name.ilike.%${params.get('search')}%`);
            }

            query = query.order('registered_at', { ascending: false }).range(offset, offset + limit - 1);

            const { data: registrations, count, error } = await query;
            if (error) return errorResponse(error.message);

            return successResponse({
                registrations,
                total: count || 0,
                page,
                limit,
                has_more: (count || 0) > offset + limit,
            });
        }

        // GET /admin/audit-logs
        if (req.method === 'GET' && pathParts[0] === 'audit-logs') {
            const params = getQueryParams(req);
            const page = parseInt(params.get('page') || '1');
            const limit = parseInt(params.get('limit') || '50');
            const offset = (page - 1) * limit;

            let query = adminClient
                .from('audit_logs')
                .select('*, user:profiles(name, email)', { count: 'exact' });

            if (params.get('user_id')) query = query.eq('user_id', params.get('user_id'));
            if (params.get('entity_type')) query = query.eq('entity_type', params.get('entity_type'));
            if (params.get('action')) query = query.eq('action', params.get('action'));
            if (params.get('from')) query = query.gte('created_at', params.get('from'));
            if (params.get('to')) query = query.lte('created_at', params.get('to'));

            query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

            const { data: logs, count, error } = await query;
            if (error) return errorResponse(error.message);

            return successResponse({ logs, total: count || 0, page, limit });
        }

        // GET/POST/PATCH/DELETE /admin/colleges
        if (pathParts[0] === 'colleges') {
            if (req.method === 'GET') {
                const { data: colleges, error } = await adminClient
                    .from('colleges')
                    .select('*')
                    .order('name');
                if (error) return errorResponse(error.message);
                return successResponse({ colleges });
            }

            if (req.method === 'POST') {
                const body = await parseBody<{ name: string; short_name?: string; city?: string }>(req);
                if (!body?.name) return errorResponse('Name is required');

                const { data: college, error } = await adminClient
                    .from('colleges')
                    .insert(body)
                    .select()
                    .single();
                if (error) return errorResponse(error.message);
                return successResponse({ college }, 201);
            }

            if (req.method === 'DELETE' && pathParts.length === 2) {
                const { error } = await adminClient.from('colleges').delete().eq('id', pathParts[1]);
                if (error) return errorResponse(error.message);
                return successResponse({ message: 'College deleted' });
            }
        }

        // GET/PATCH /admin/settings
        if (pathParts[0] === 'settings') {
            if (req.method === 'GET') {
                const { data: settings, error } = await adminClient.from('settings').select('*');
                if (error) return errorResponse(error.message);

                const settingsMap: Record<string, unknown> = {};
                settings?.forEach(s => { settingsMap[s.key] = s.value; });
                return successResponse({ settings: settingsMap });
            }

            if (req.method === 'PATCH') {
                const body = await parseBody<Record<string, unknown>>(req);
                if (!body) return errorResponse('Invalid request body');

                for (const [key, value] of Object.entries(body)) {
                    await adminClient.from('settings').upsert({
                        key,
                        value: JSON.stringify(value),
                        updated_by: user.id,
                        updated_at: new Date().toISOString(),
                    });
                }
                return successResponse({ message: 'Settings updated' });
            }
        }

        // POST /admin/payments/verify-offline
        if (req.method === 'POST' && pathParts[0] === 'payments' && pathParts[1] === 'verify-offline') {
            const body = await parseBody<{
                registration_id: string;
                amount: number;
                verification_note?: string;
            }>(req);

            if (!body?.registration_id || !body?.amount) {
                return errorResponse('registration_id and amount are required');
            }

            const { data: registration } = await adminClient
                .from('registrations')
                .select('*')
                .eq('id', body.registration_id)
                .single();

            if (!registration) return notFoundResponse('Registration not found');

            const { data: payment, error } = await adminClient
                .from('payments')
                .insert({
                    registration_id: body.registration_id,
                    user_id: registration.participant_id,
                    amount: body.amount,
                    convenience_fee: 0,
                    total_amount: body.amount,
                    method: 'offline',
                    status: 'success',
                    offline_verified_by: user.id,
                    offline_verification_note: body.verification_note,
                    offline_verified_at: new Date().toISOString(),
                })
                .select()
                .single();

            if (error) return errorResponse(error.message);

            await adminClient.rpc('create_audit_log', {
                p_action: 'payment.offline.verify',
                p_entity_type: 'payment',
                p_entity_id: payment.id,
                p_new_values: { amount: body.amount, note: body.verification_note },
            });

            return successResponse({ payment, message: 'Offline payment verified' });
        }

        return errorResponse('Not found', 404);
    } catch (error) {
        console.error('Admin error:', error);
        return errorResponse('Internal server error', 500);
    }
});
