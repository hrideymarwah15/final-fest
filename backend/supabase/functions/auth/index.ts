import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import {
    handleCors,
    successResponse,
    errorResponse,
    unauthorizedResponse,
    conflictResponse,
    parseBody,
} from '../_shared/response.ts';
import { validateSignup } from '../_shared/validation.ts';
import { sendTemplatedEmail } from '../_shared/email.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

interface SignupRequest {
    email: string;
    password: string;
    name: string;
    phone: string;
    college: string;
}

interface UpdateProfileRequest {
    name?: string;
    phone?: string;
    college?: string;
    avatar_url?: string;
}

serve(async (req) => {
    // Handle CORS
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;

    const url = new URL(req.url);
    const path = url.pathname.replace('/auth', '');

    try {
        // POST /auth/signup - User registration
        if (req.method === 'POST' && path === '/signup') {
            const body = await parseBody<SignupRequest>(req);
            if (!body) {
                return errorResponse('Invalid request body');
            }

            // Validate input
            const validation = validateSignup(body);
            if (!validation.valid) {
                return errorResponse(
                    `Validation failed: ${validation.errors.map(e => e.message).join(', ')}`
                );
            }

            // Create Supabase admin client
            const supabase = createClient(supabaseUrl, supabaseServiceKey);

            // Check if email already exists
            const { data: existingUser } = await supabase
                .from('profiles')
                .select('id')
                .eq('email', body.email)
                .single();

            if (existingUser) {
                return conflictResponse('Email already registered');
            }

            // Create user with Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.admin.createUser({
                email: body.email,
                password: body.password,
                email_confirm: false,
                user_metadata: {
                    name: body.name,
                    phone: body.phone,
                    college: body.college,
                },
            });

            if (authError) {
                console.error('Auth error:', authError);
                return errorResponse(authError.message, 500);
            }

            // Profile is auto-created by trigger, fetch it
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', authData.user.id)
                .single();

            // Send welcome email
            sendTemplatedEmail(body.email, 'welcome', body.name).catch(console.error);

            return successResponse(
                {
                    user: authData.user,
                    profile,
                    message: 'Account created successfully',
                },
                201
            );
        }

        // GET /auth/profile - Get current user profile
        if (req.method === 'GET' && path === '/profile') {
            const authHeader = req.headers.get('Authorization');
            if (!authHeader) {
                return unauthorizedResponse();
            }

            const supabase = createClient(supabaseUrl, supabaseAnonKey, {
                global: { headers: { Authorization: authHeader } },
            });

            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError || !user) {
                return unauthorizedResponse();
            }

            // Get profile with registration count
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (profileError) {
                return errorResponse('Profile not found', 404);
            }

            // Get registrations count
            const { count: registrationsCount } = await supabase
                .from('registrations')
                .select('*', { count: 'exact', head: true })
                .eq('participant_id', user.id)
                .neq('status', 'cancelled');

            // Get unread notifications count
            const { count: unreadNotifications } = await supabase
                .from('notifications')
                .select('*', { count: 'exact', head: true })
                .eq('recipient_id', user.id)
                .eq('is_read', false);

            return successResponse({
                profile,
                registrations_count: registrationsCount || 0,
                unread_notifications: unreadNotifications || 0,
            });
        }

        // PATCH /auth/profile - Update profile
        if (req.method === 'PATCH' && path === '/profile') {
            const authHeader = req.headers.get('Authorization');
            if (!authHeader) {
                return unauthorizedResponse();
            }

            const supabase = createClient(supabaseUrl, supabaseAnonKey, {
                global: { headers: { Authorization: authHeader } },
            });

            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError || !user) {
                return unauthorizedResponse();
            }

            const body = await parseBody<UpdateProfileRequest>(req);
            if (!body) {
                return errorResponse('Invalid request body');
            }

            // Build update object (only allowed fields)
            const updateData: Record<string, unknown> = {};
            if (body.name) updateData.name = body.name;
            if (body.phone) updateData.phone = body.phone;
            if (body.college) updateData.college = body.college;
            if (body.avatar_url) updateData.avatar_url = body.avatar_url;

            const { data: profile, error: updateError } = await supabase
                .from('profiles')
                .update(updateData)
                .eq('id', user.id)
                .select()
                .single();

            if (updateError) {
                return errorResponse(updateError.message);
            }

            // Create audit log
            const adminClient = createClient(supabaseUrl, supabaseServiceKey);
            await adminClient.rpc('create_audit_log', {
                p_action: 'profile.update',
                p_entity_type: 'profile',
                p_entity_id: user.id,
                p_new_values: updateData,
            });

            return successResponse({ profile, message: 'Profile updated successfully' });
        }

        return errorResponse('Not found', 404);
    } catch (error) {
        console.error('Auth function error:', error);
        return errorResponse('Internal server error', 500);
    }
});
