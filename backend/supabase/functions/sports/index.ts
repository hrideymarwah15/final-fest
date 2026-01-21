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

interface CreateSportRequest {
    name: string;
    category: 'indoor' | 'outdoor' | 'esports' | 'athletics';
    description?: string;
    rules?: string;
    image_url?: string;
    is_team_event?: boolean;
    team_size_min?: number;
    team_size_max?: number;
    fees: number;
    early_bird_fees?: number;
    early_bird_deadline?: string;
    registration_start: string;
    registration_deadline: string;
    schedule_start?: string;
    schedule_end?: string;
    venue?: string;
    max_participants?: number;
    waitlist_enabled?: boolean;
}

serve(async (req) => {
    // Handle CORS
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;

    const url = new URL(req.url);
    const path = url.pathname.replace('/sports', '');
    const pathParts = path.split('/').filter(Boolean);

    try {
        // GET /sports - List all sports
        if (req.method === 'GET' && pathParts.length === 0) {
            const params = getQueryParams(req);
            const category = params.get('category');
            const isOpen = params.get('is_open');
            const search = params.get('search');
            const sort = params.get('sort') || 'registration_deadline';
            const page = parseInt(params.get('page') || '1');
            const limit = parseInt(params.get('limit') || '20');
            const offset = (page - 1) * limit;

            const supabase = createClient(supabaseUrl, supabaseAnonKey);

            let query = supabase
                .from('sports')
                .select('*', { count: 'exact' })
                .eq('is_archived', false);

            if (category) {
                query = query.eq('category', category);
            }

            if (isOpen === 'true') {
                query = query.eq('is_registration_open', true);
            }

            if (search) {
                query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
            }

            // Apply sorting
            const ascending = !sort.startsWith('-');
            const sortColumn = sort.replace('-', '');
            query = query.order(sortColumn, { ascending });

            // Apply pagination
            query = query.range(offset, offset + limit - 1);

            const { data: sports, error, count } = await query;

            if (error) {
                return errorResponse(error.message);
            }

            return successResponse({
                sports,
                total: count || 0,
                page,
                limit,
                has_more: (count || 0) > offset + limit,
            });
        }

        // GET /sports/:identifier - Get sport by ID or slug
        if (req.method === 'GET' && pathParts.length === 1) {
            const identifier = pathParts[0];
            const authHeader = req.headers.get('Authorization');

            const supabase = createClient(supabaseUrl, supabaseAnonKey);

            // Check if identifier is UUID or slug
            const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);

            let query = supabase
                .from('sports')
                .select('*')
                .eq('is_archived', false);

            if (isUUID) {
                query = query.eq('id', identifier);
            } else {
                query = query.eq('slug', identifier);
            }

            const { data: sport, error } = await query.single();

            if (error || !sport) {
                return notFoundResponse('Sport not found');
            }

            // Calculate applicable fees
            const now = new Date();
            const earlyBirdDeadline = sport.early_bird_deadline ? new Date(sport.early_bird_deadline) : null;
            const applicableFees = earlyBirdDeadline && now < earlyBirdDeadline && sport.early_bird_fees
                ? sport.early_bird_fees
                : sport.fees;

            // Calculate spots remaining
            const spotsRemaining = sport.max_participants
                ? Math.max(0, sport.max_participants - sport.current_participants)
                : null;

            // Check if user can register (if authenticated)
            let canRegister = false;
            let registerReason = '';
            let waitlistAvailable = false;

            if (authHeader) {
                const userClient = createClient(supabaseUrl, supabaseAnonKey, {
                    global: { headers: { Authorization: authHeader } },
                });

                const { data: { user } } = await userClient.auth.getUser();
                if (user) {
                    const adminClient = createClient(supabaseUrl, supabaseServiceKey);
                    const { data: eligibility } = await adminClient.rpc('can_register_for_sport', {
                        p_sport_id: sport.id,
                        p_user_id: user.id,
                    });

                    if (eligibility && eligibility.length > 0) {
                        canRegister = eligibility[0].can_register;
                        registerReason = eligibility[0].reason;
                        waitlistAvailable = eligibility[0].waitlist_available;
                    }
                }
            }

            return successResponse({
                sport,
                applicable_fees: applicableFees,
                spots_remaining: spotsRemaining,
                can_register: canRegister,
                register_reason: registerReason,
                waitlist_available: waitlistAvailable,
            });
        }

        // POST /sports - Create sport (admin only)
        if (req.method === 'POST' && pathParts.length === 0) {
            const authHeader = req.headers.get('Authorization');
            if (!authHeader) {
                return unauthorizedResponse();
            }

            const supabase = createClient(supabaseUrl, supabaseAnonKey, {
                global: { headers: { Authorization: authHeader } },
            });

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                return unauthorizedResponse();
            }

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

            const body = await parseBody<CreateSportRequest>(req);
            if (!body) {
                return errorResponse('Invalid request body');
            }

            // Validate required fields
            if (!body.name || !body.category || !body.fees || !body.registration_start || !body.registration_deadline) {
                return errorResponse('Missing required fields');
            }

            // Validate date ranges
            const regStart = new Date(body.registration_start);
            const regDeadline = new Date(body.registration_deadline);

            if (regDeadline <= regStart) {
                return errorResponse('Registration deadline must be after registration start');
            }

            // Insert sport
            const { data: sport, error } = await adminClient
                .from('sports')
                .insert({
                    ...body,
                    created_by: user.id,
                })
                .select()
                .single();

            if (error) {
                return errorResponse(error.message);
            }

            // Create audit log
            await adminClient.rpc('create_audit_log', {
                p_action: 'sport.create',
                p_entity_type: 'sport',
                p_entity_id: sport.id,
                p_new_values: sport,
            });

            return successResponse({ sport, message: 'Sport created successfully' }, 201);
        }

        // PATCH /sports/:id - Update sport (admin only)
        if (req.method === 'PATCH' && pathParts.length === 1) {
            const sportId = pathParts[0];
            const authHeader = req.headers.get('Authorization');
            if (!authHeader) {
                return unauthorizedResponse();
            }

            const supabase = createClient(supabaseUrl, supabaseAnonKey, {
                global: { headers: { Authorization: authHeader } },
            });

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                return unauthorizedResponse();
            }

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

            const body = await parseBody<Partial<CreateSportRequest>>(req);
            if (!body) {
                return errorResponse('Invalid request body');
            }

            // Get current sport for audit
            const { data: oldSport } = await adminClient
                .from('sports')
                .select('*')
                .eq('id', sportId)
                .single();

            if (!oldSport) {
                return notFoundResponse('Sport not found');
            }

            // Update sport
            const { data: sport, error } = await adminClient
                .from('sports')
                .update(body)
                .eq('id', sportId)
                .select()
                .single();

            if (error) {
                return errorResponse(error.message);
            }

            // Create audit log
            await adminClient.rpc('create_audit_log', {
                p_action: 'sport.update',
                p_entity_type: 'sport',
                p_entity_id: sportId,
                p_old_values: oldSport,
                p_new_values: sport,
            });

            return successResponse({ sport, message: 'Sport updated successfully' });
        }

        // POST /sports/:id/toggle-registration - Toggle registration (admin only)
        if (req.method === 'POST' && pathParts.length === 2 && pathParts[1] === 'toggle-registration') {
            const sportId = pathParts[0];
            const authHeader = req.headers.get('Authorization');
            if (!authHeader) {
                return unauthorizedResponse();
            }

            const supabase = createClient(supabaseUrl, supabaseAnonKey, {
                global: { headers: { Authorization: authHeader } },
            });

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                return unauthorizedResponse();
            }

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

            // Get current sport
            const { data: sport } = await adminClient
                .from('sports')
                .select('*')
                .eq('id', sportId)
                .single();

            if (!sport) {
                return notFoundResponse('Sport not found');
            }

            // Toggle registration
            const newStatus = !sport.is_registration_open;

            // If opening, validate deadline
            if (newStatus) {
                const deadline = new Date(sport.registration_deadline);
                if (deadline < new Date()) {
                    return errorResponse('Cannot open registration: deadline has passed');
                }
            }

            const { data: updatedSport, error } = await adminClient
                .from('sports')
                .update({ is_registration_open: newStatus })
                .eq('id', sportId)
                .select()
                .single();

            if (error) {
                return errorResponse(error.message);
            }

            // Create audit log
            await adminClient.rpc('create_audit_log', {
                p_action: newStatus ? 'sport.registration.open' : 'sport.registration.close',
                p_entity_type: 'sport',
                p_entity_id: sportId,
            });

            return successResponse({
                sport: updatedSport,
                message: newStatus ? 'Registration opened' : 'Registration closed',
            });
        }

        // POST /sports/:id/duplicate - Duplicate sport (admin only)
        if (req.method === 'POST' && pathParts.length === 2 && pathParts[1] === 'duplicate') {
            const sportId = pathParts[0];
            const authHeader = req.headers.get('Authorization');
            if (!authHeader) {
                return unauthorizedResponse();
            }

            const supabase = createClient(supabaseUrl, supabaseAnonKey, {
                global: { headers: { Authorization: authHeader } },
            });

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                return unauthorizedResponse();
            }

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

            // Get source sport
            const { data: sourceSport } = await adminClient
                .from('sports')
                .select('*')
                .eq('id', sportId)
                .single();

            if (!sourceSport) {
                return notFoundResponse('Sport not found');
            }

            // Create duplicate
            const { id, slug, current_participants, created_at, updated_at, ...sportData } = sourceSport;
            const { data: newSport, error } = await adminClient
                .from('sports')
                .insert({
                    ...sportData,
                    name: `${sourceSport.name} (Copy)`,
                    slug: null, // Will be auto-generated
                    is_registration_open: false,
                    current_participants: 0,
                    created_by: user.id,
                })
                .select()
                .single();

            if (error) {
                return errorResponse(error.message);
            }

            // Create audit log
            await adminClient.rpc('create_audit_log', {
                p_action: 'sport.duplicate',
                p_entity_type: 'sport',
                p_entity_id: newSport.id,
                p_old_values: { source_id: sportId },
            });

            return successResponse({ sport: newSport, message: 'Sport duplicated successfully' }, 201);
        }

        // POST /sports/:id/archive - Archive sport (admin only)
        if (req.method === 'POST' && pathParts.length === 2 && pathParts[1] === 'archive') {
            const sportId = pathParts[0];
            const authHeader = req.headers.get('Authorization');
            if (!authHeader) {
                return unauthorizedResponse();
            }

            const supabase = createClient(supabaseUrl, supabaseAnonKey, {
                global: { headers: { Authorization: authHeader } },
            });

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                return unauthorizedResponse();
            }

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

            // Archive sport
            const { data: sport, error } = await adminClient
                .from('sports')
                .update({ is_archived: true, is_registration_open: false })
                .eq('id', sportId)
                .select()
                .single();

            if (error) {
                return errorResponse(error.message);
            }

            // Create audit log
            await adminClient.rpc('create_audit_log', {
                p_action: 'sport.archive',
                p_entity_type: 'sport',
                p_entity_id: sportId,
            });

            return successResponse({ sport, message: 'Sport archived successfully' });
        }

        return errorResponse('Not found', 404);
    } catch (error) {
        console.error('Sports function error:', error);
        return errorResponse('Internal server error', 500);
    }
});
