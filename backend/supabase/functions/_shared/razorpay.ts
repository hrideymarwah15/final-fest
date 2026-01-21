import { crypto } from 'https://deno.land/std@0.177.0/crypto/mod.ts';

const RAZORPAY_KEY_ID = Deno.env.get('RAZORPAY_KEY_ID')!;
const RAZORPAY_KEY_SECRET = Deno.env.get('RAZORPAY_KEY_SECRET')!;
const RAZORPAY_WEBHOOK_SECRET = Deno.env.get('RAZORPAY_WEBHOOK_SECRET')!;

const RAZORPAY_API_BASE = 'https://api.razorpay.com/v1';

interface RazorpayOrderResponse {
    id: string;
    entity: string;
    amount: number;
    amount_paid: number;
    amount_due: number;
    currency: string;
    receipt: string;
    status: string;
    created_at: number;
}

interface RazorpayRefundResponse {
    id: string;
    entity: string;
    amount: number;
    currency: string;
    payment_id: string;
    status: string;
    created_at: number;
}

// Create Razorpay order
export async function createRazorpayOrder(
    amount: number,
    currency: string,
    receipt: string,
    notes?: Record<string, string>
): Promise<RazorpayOrderResponse> {
    const auth = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`);

    const response = await fetch(`${RAZORPAY_API_BASE}/orders`, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            amount: Math.round(amount * 100), // Convert to paise
            currency,
            receipt,
            notes,
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`Razorpay order creation failed: ${JSON.stringify(error)}`);
    }

    return response.json();
}

// Verify Razorpay signature
export async function verifyRazorpaySignature(
    orderId: string,
    paymentId: string,
    signature: string
): Promise<boolean> {
    const message = `${orderId}|${paymentId}`;
    const encoder = new TextEncoder();

    const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(RAZORPAY_KEY_SECRET),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );

    const signatureBuffer = await crypto.subtle.sign(
        'HMAC',
        key,
        encoder.encode(message)
    );

    const generatedSignature = Array.from(new Uint8Array(signatureBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

    return generatedSignature === signature;
}

// Verify Razorpay webhook signature
export async function verifyWebhookSignature(
    body: string,
    signature: string
): Promise<boolean> {
    const encoder = new TextEncoder();

    const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(RAZORPAY_WEBHOOK_SECRET),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );

    const signatureBuffer = await crypto.subtle.sign(
        'HMAC',
        key,
        encoder.encode(body)
    );

    const generatedSignature = Array.from(new Uint8Array(signatureBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

    return generatedSignature === signature;
}

// Process refund
export async function processRazorpayRefund(
    paymentId: string,
    amount: number,
    notes?: Record<string, string>
): Promise<RazorpayRefundResponse> {
    const auth = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`);

    const response = await fetch(`${RAZORPAY_API_BASE}/payments/${paymentId}/refund`, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            amount: Math.round(amount * 100), // Convert to paise
            notes,
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`Razorpay refund failed: ${JSON.stringify(error)}`);
    }

    return response.json();
}

// Fetch payment details
export async function fetchPaymentDetails(paymentId: string): Promise<Record<string, unknown>> {
    const auth = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`);

    const response = await fetch(`${RAZORPAY_API_BASE}/payments/${paymentId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Basic ${auth}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to fetch payment: ${JSON.stringify(error)}`);
    }

    return response.json();
}

// Get Razorpay Key ID (for frontend)
export function getRazorpayKeyId(): string {
    return RAZORPAY_KEY_ID;
}
