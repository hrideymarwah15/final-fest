import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import {
    handleCors,
    successResponse,
    errorResponse,
    unauthorizedResponse,
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
    const path = url.pathname.replace('/notifications', '');
    const pathParts = path.split('/').filter(Boolean);

    try {
        // GET /notifications - Get user notifications
        if (req.method === 'GET' && pathParts.length === 0) {
            const authHeader = req.headers.get('Authorization');
            if (!authHeader) return unauthorizedResponse();

            const supabase = createClient(supabaseUrl, supabaseAnonKey, {
                global: { headers: { Authorization: authHeader } },
            });
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return unauthorizedResponse();

            const params = getQueryParams(req);
            const unreadOnly = params.get('unread_only') === 'true';
            const limit = parseInt(params.get('limit') || '20');
            const cursor = params.get('cursor');

            let query = supabase
                .from('notifications')
                .select('*')
                .eq('recipient_id', user.id)
                .order('created_at', { ascending: false })
                .limit(limit);

            if (unreadOnly) {
                query = query.eq('is_read', false);
            }

            if (cursor) {
                query = query.lt('created_at', cursor);
            }

            const { data: notifications, error } = await query;
            if (error) return errorResponse(error.message);

            const nextCursor = notifications?.length === limit
                ? notifications[notifications.length - 1].created_at
                : null;

            return successResponse({ notifications, next_cursor: nextCursor });
        }

        // POST /notifications/mark-read
        if (req.method === 'POST' && pathParts[0] === 'mark-read') {
            const authHeader = req.headers.get('Authorization');
            if (!authHeader) return unauthorizedResponse();

            const supabase = createClient(supabaseUrl, supabaseAnonKey, {
                global: { headers: { Authorization: authHeader } },
            });
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return unauthorizedResponse();

            const body = await parseBody<{ notification_ids?: string[] }>(req);

            let query = supabase
                .from('notifications')
                .update({ is_read: true, read_at: new Date().toISOString() })
                .eq('recipient_id', user.id);

            if (body?.notification_ids?.length) {
                query = query.in('id', body.notification_ids);
            }

            const { error } = await query;
            if (error) return errorResponse(error.message);

            return successResponse({ message: 'Notifications marked as read' });
        }

        // GET /notifications/unread-count
        if (req.method === 'GET' && pathParts[0] === 'unread-count') {
            const authHeader = req.headers.get('Authorization');
            if (!authHeader) return unauthorizedResponse();

            const supabase = createClient(supabaseUrl, supabaseAnonKey, {
                global: { headers: { Authorization: authHeader } },
            });
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return unauthorizedResponse();

            const { count, error } = await supabase
                .from('notifications')
                .select('*', { count: 'exact', head: true })
                .eq('recipient_id', user.id)
                .eq('is_read', false);

            if (error) return errorResponse(error.message);
            return successResponse({ count: count || 0 });
        }

        return errorResponse('Not found', 404);
    } catch (error) {
        console.error('Notifications error:', error);
        return errorResponse('Internal server error', 500);
    }
});
