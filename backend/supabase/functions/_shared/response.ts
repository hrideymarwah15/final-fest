import { ApiResponse } from '../../../types/database.ts';

// CORS headers for all responses
export const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
};

// Handle CORS preflight
export function handleCors(req: Request): Response | null {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }
    return null;
}

// Success response helper
export function successResponse<T>(data: T, status = 200): Response {
    const body: ApiResponse<T> = {
        success: true,
        data,
    };

    return new Response(JSON.stringify(body), {
        status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
}

// Error response helper
export function errorResponse(message: string, status = 400): Response {
    const body: ApiResponse = {
        success: false,
        error: message,
    };

    return new Response(JSON.stringify(body), {
        status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
}

// Unauthorized response
export function unauthorizedResponse(message = 'Unauthorized'): Response {
    return errorResponse(message, 401);
}

// Forbidden response
export function forbiddenResponse(message = 'Forbidden'): Response {
    return errorResponse(message, 403);
}

// Not found response
export function notFoundResponse(message = 'Not found'): Response {
    return errorResponse(message, 404);
}

// Conflict response
export function conflictResponse(message: string): Response {
    return errorResponse(message, 409);
}

// Parse JSON body safely
export async function parseBody<T>(req: Request): Promise<T | null> {
    try {
        return await req.json() as T;
    } catch {
        return null;
    }
}

// Get query params
export function getQueryParams(req: Request): URLSearchParams {
    const url = new URL(req.url);
    return url.searchParams;
}

// Get path params (simple version)
export function getPathParam(req: Request, paramIndex: number): string | null {
    const url = new URL(req.url);
    const parts = url.pathname.split('/').filter(Boolean);
    return parts[paramIndex] || null;
}
