import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import {
    handleCors,
    successResponse,
    errorResponse,
    unauthorizedResponse,
    getQueryParams,
} from '../_shared/response.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;

    const url = new URL(req.url);
    const path = url.pathname.replace('/analytics', '');
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

        // GET /analytics/dashboard
        if (req.method === 'GET' && pathParts[0] === 'dashboard') {
            const { data: stats, error } = await adminClient.rpc('get_dashboard_stats');
            if (error) return errorResponse(error.message);

            // Get recent registrations
            const { data: recentRegistrations } = await adminClient
                .from('registrations')
                .select('*, participant:profiles(name, email, college), sport:sports(name)')
                .neq('status', 'cancelled')
                .order('registered_at', { ascending: false })
                .limit(10);

            // Get recent payments
            const { data: recentPayments } = await adminClient
                .from('payments')
                .select('*, user:profiles(name, email), registration:registrations(registration_number, sport:sports(name))')
                .eq('status', 'success')
                .order('created_at', { ascending: false })
                .limit(10);

            return successResponse({
                stats,
                recent_registrations: recentRegistrations,
                recent_payments: recentPayments,
            });
        }

        // GET /analytics/sports
        if (req.method === 'GET' && pathParts[0] === 'sports') {
            const { data, error } = await adminClient.rpc('get_sports_analytics_summary');
            if (error) return errorResponse(error.message);
            return successResponse({ sports: data });
        }

        // GET /analytics/colleges
        if (req.method === 'GET' && pathParts[0] === 'colleges') {
            const { data, error } = await adminClient.rpc('get_college_analytics');
            if (error) return errorResponse(error.message);
            return successResponse({ colleges: data });
        }

        // GET /analytics/revenue
        if (req.method === 'GET' && pathParts[0] === 'revenue') {
            const params = getQueryParams(req);
            const period = params.get('period') || 'daily';
            const from = params.get('from');
            const to = params.get('to');

            const { data, error } = await adminClient.rpc('get_revenue_analytics', {
                p_period: period,
                p_from: from || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                p_to: to || new Date().toISOString().split('T')[0],
            });

            if (error) return errorResponse(error.message);
            return successResponse({ revenue: data });
        }

        // GET /analytics/trends
        if (req.method === 'GET' && pathParts[0] === 'trends') {
            const params = getQueryParams(req);
            const days = parseInt(params.get('days') || '30');

            const { data, error } = await adminClient.rpc('get_registration_trends', { p_days: days });
            if (error) return errorResponse(error.message);
            return successResponse({ trends: data });
        }

        return errorResponse('Not found', 404);
    } catch (error) {
        console.error('Analytics error:', error);
        return errorResponse('Internal server error', 500);
    }
});
