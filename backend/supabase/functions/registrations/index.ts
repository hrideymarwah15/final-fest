import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import {
    handleCors,
    successResponse,
    errorResponse,
    unauthorizedResponse,
    notFoundResponse,
    conflictResponse,
    forbiddenResponse,
    parseBody,
    getQueryParams,
} from '../_shared/response.ts';
import { validateRegistration } from '../_shared/validation.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

interface RegisterRequest {
    sport_id: string;
    is_team?: boolean;
    team_name?: string;
    team_members?: {
        name: string;
        email?: string;
        phone?: string;
        is_captain?: boolean;
    }[];
}

serve(async (req) => {
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;

    const url = new URL(req.url);
    const path = url.pathname.replace('/registrations', '');
    const pathParts = path.split('/').filter(Boolean);

    try {
        // GET /registrations/check/:sport_id - Check eligibility
        if (req.method === 'GET' && pathParts[0] === 'check' && pathParts.length === 2) {
            const sportId = pathParts[1];
            const authHeader = req.headers.get('Authorization');
            if (!authHeader) return unauthorizedResponse();

            const supabase = createClient(supabaseUrl, supabaseAnonKey, {
                global: { headers: { Authorization: authHeader } },
            });

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return unauthorizedResponse();

            const adminClient = createClient(supabaseUrl, supabaseServiceKey);
            const { data: eligibility } = await adminClient.rpc('can_register_for_sport', {
                p_sport_id: sportId,
                p_user_id: user.id,
            });

            const { data: sport } = await adminClient
                .from('sports')
                .select('fees, early_bird_fees, early_bird_deadline, max_participants, current_participants')
                .eq('id', sportId)
                .single();

            if (!sport) return notFoundResponse('Sport not found');

            const now = new Date();
            const earlyBirdDeadline = sport.early_bird_deadline ? new Date(sport.early_bird_deadline) : null;
            const applicableFees = earlyBirdDeadline && now < earlyBirdDeadline && sport.early_bird_fees
                ? sport.early_bird_fees : sport.fees;
            const spotsRemaining = sport.max_participants
                ? Math.max(0, sport.max_participants - sport.current_participants) : null;
            const result = eligibility?.[0] || { can_register: false, reason: 'Unknown error', waitlist_available: false };

            return successResponse({
                can_register: result.can_register,
                reason: result.reason,
                waitlist_available: result.waitlist_available,
                applicable_fees: applicableFees,
                spots_remaining: spotsRemaining,
            });
        }

        // POST /registrations - Register for sport
        if (req.method === 'POST' && pathParts.length === 0) {
            const authHeader = req.headers.get('Authorization');
            if (!authHeader) return unauthorizedResponse();

            const supabase = createClient(supabaseUrl, supabaseAnonKey, {
                global: { headers: { Authorization: authHeader } },
            });
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return unauthorizedResponse();

            const body = await parseBody<RegisterRequest>(req);
            if (!body) return errorResponse('Invalid request body');

            const adminClient = createClient(supabaseUrl, supabaseServiceKey);
            const { data: sport } = await adminClient.from('sports').select('*').eq('id', body.sport_id).single();
            if (!sport) return notFoundResponse('Sport not found');

            const validation = validateRegistration(body, sport.team_size_min, sport.team_size_max);
            if (!validation.valid) {
                return errorResponse(`Validation failed: ${validation.errors.map(e => e.message).join(', ')}`);
            }

            const { data: eligibility } = await adminClient.rpc('can_register_for_sport', {
                p_sport_id: body.sport_id, p_user_id: user.id,
            });
            const eligResult = eligibility?.[0] || { can_register: false, reason: 'Unknown error' };
            if (!eligResult.can_register) return forbiddenResponse(eligResult.reason);

            if (sport.is_team_event && !body.is_team) {
                return errorResponse('This is a team event. Please provide team details.');
            }

            const now = new Date();
            const earlyBirdDeadline = sport.early_bird_deadline ? new Date(sport.early_bird_deadline) : null;
            const applicableFees = earlyBirdDeadline && now < earlyBirdDeadline && sport.early_bird_fees
                ? sport.early_bird_fees : sport.fees;

            let status = 'payment_pending';
            let waitlistPosition = null;

            if (eligResult.waitlist_available) {
                status = 'waitlist';
                const { count } = await adminClient.from('registrations')
                    .select('*', { count: 'exact', head: true })
                    .eq('sport_id', body.sport_id).eq('status', 'waitlist');
                waitlistPosition = (count || 0) + 1;
            }
            if (applicableFees === 0) status = 'confirmed';

            const { data: registration, error: regError } = await adminClient
                .from('registrations')
                .insert({
                    participant_id: user.id,
                    sport_id: body.sport_id,
                    status,
                    is_team: body.is_team || false,
                    team_name: body.team_name,
                    waitlist_position,
                    payment_status: applicableFees === 0 ? 'completed' : 'pending',
                    amount_paid: applicableFees === 0 ? applicableFees : 0,
                })
                .select().single();

            if (regError) {
                if (regError.code === '23505') return conflictResponse('Already registered');
                return errorResponse(regError.message);
            }

            if (body.is_team && body.team_members?.length) {
                const teamMembersData = body.team_members.map((m, i) => ({
                    registration_id: registration.id,
                    member_order: i + 1,
                    name: m.name,
                    email: m.email,
                    phone: m.phone,
                    is_captain: m.is_captain || false,
                }));
                await adminClient.from('team_members').insert(teamMembersData);
            }

            await adminClient.from('notifications').insert({
                recipient_id: user.id,
                type: 'registration',
                priority: 'high',
                title: status === 'waitlist' ? 'Added to Waitlist' : 'Registration Created',
                message: status === 'waitlist'
                    ? `You're on the waitlist for ${sport.name}. Position: ${waitlistPosition}`
                    : `Registration for ${sport.name} is pending payment.`,
                related_sport_id: sport.id,
                related_registration_id: registration.id,
            });

            return successResponse({ registration, status, amount: applicableFees, waitlist_position: waitlistPosition }, 201);
        }

        // GET /registrations/me
        if (req.method === 'GET' && pathParts[0] === 'me') {
            const authHeader = req.headers.get('Authorization');
            if (!authHeader) return unauthorizedResponse();
            const supabase = createClient(supabaseUrl, supabaseAnonKey, {
                global: { headers: { Authorization: authHeader } },
            });
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return unauthorizedResponse();

            const params = getQueryParams(req);
            let query = supabase.from('registrations')
                .select('*, sport:sports(*), team_members(*)')
                .eq('participant_id', user.id)
                .order('registered_at', { ascending: false });

            const status = params.get('status');
            if (status) query = query.eq('status', status);
            else if (params.get('include_past') !== 'true') {
                query = query.not('status', 'in', '(cancelled,withdrawn)');
            }

            const { data: registrations, error } = await query;
            if (error) return errorResponse(error.message);
            return successResponse({ registrations });
        }

        // POST /registrations/:id/cancel
        if (req.method === 'POST' && pathParts.length === 2 && pathParts[1] === 'cancel') {
            const registrationId = pathParts[0];
            const authHeader = req.headers.get('Authorization');
            if (!authHeader) return unauthorizedResponse();

            const supabase = createClient(supabaseUrl, supabaseAnonKey, {
                global: { headers: { Authorization: authHeader } },
            });
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return unauthorizedResponse();

            const body = await parseBody<{ reason?: string }>(req);
            const adminClient = createClient(supabaseUrl, supabaseServiceKey);

            const { data: registration } = await adminClient.from('registrations')
                .select('*, sport:sports(name)').eq('id', registrationId).single();
            if (!registration) return notFoundResponse('Registration not found');

            if (registration.participant_id !== user.id) {
                const { data: profile } = await adminClient.from('profiles').select('role').eq('id', user.id).single();
                if (profile?.role !== 'admin') return forbiddenResponse('Cannot cancel others registrations');
            }

            if (['cancelled', 'withdrawn'].includes(registration.status)) {
                return errorResponse('Already cancelled');
            }

            const { data: updated, error } = await adminClient.from('registrations')
                .update({ status: 'cancelled', withdrawal_reason: body?.reason, cancelled_by: user.id })
                .eq('id', registrationId).select().single();

            if (error) return errorResponse(error.message);
            return successResponse({ registration: updated, message: 'Cancelled successfully' });
        }

        return errorResponse('Not found', 404);
    } catch (error) {
        console.error('Registrations error:', error);
        return errorResponse('Internal server error', 500);
    }
});
