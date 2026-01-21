import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Get environment variables
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

// Create admin client (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Create client from request (uses user's JWT)
export function createSupabaseClient(req: Request): SupabaseClient {
    const authHeader = req.headers.get('Authorization');

    return createClient(supabaseUrl, supabaseAnonKey, {
        global: {
            headers: authHeader ? { Authorization: authHeader } : {},
        },
    });
}

// Get user from request
export async function getUser(req: Request) {
    const supabase = createSupabaseClient(req);
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        return null;
    }

    return user;
}

// Check if user is admin
export async function isAdmin(userId: string): Promise<boolean> {
    const { data } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

    return data?.role === 'admin';
}

// Check if user is coordinator or admin
export async function isCoordinator(userId: string): Promise<boolean> {
    const { data } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

    return data?.role === 'admin' || data?.role === 'coordinator';
}
