-- =============================================
-- PAYMENTS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_id UUID REFERENCES registrations(id) NOT NULL,
    user_id UUID REFERENCES profiles(id) NOT NULL,
    
    -- Amount Details
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    convenience_fee DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    
    -- Payment Method
    method TEXT NOT NULL CHECK (method IN ('online', 'offline', 'free')),
    
    -- Status Flow: pending -> processing -> success | failed -> refunded
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'success', 'failed', 'refunded', 'partially_refunded')),
    
    -- Razorpay Details
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    gateway_response JSONB,
    
    -- Receipt
    receipt_number TEXT,
    receipt_url TEXT,
    
    -- Offline Payment
    offline_verified_by UUID REFERENCES profiles(id),
    offline_verification_note TEXT,
    offline_verified_at TIMESTAMPTZ,
    
    -- Refund Details
    refund_amount DECIMAL(10,2),
    refund_reason TEXT,
    refund_id TEXT,
    refund_processed_by UUID REFERENCES profiles(id),
    refund_processed_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    completed_at TIMESTAMPTZ,
    
    -- Constraints
    CONSTRAINT valid_refund CHECK (refund_amount IS NULL OR refund_amount <= total_amount)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_registration ON payments(registration_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_razorpay_order ON payments(razorpay_order_id) WHERE razorpay_order_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_razorpay_payment ON payments(razorpay_payment_id) WHERE razorpay_payment_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_receipt ON payments(receipt_number) WHERE receipt_number IS NOT NULL;

-- Enable Row Level Security
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own payments" ON payments
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can create payments" ON payments
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all payments" ON payments
    FOR SELECT USING (is_admin());

CREATE POLICY "Admins can update payments" ON payments
    FOR UPDATE USING (is_admin());

-- Trigger for updated_at
CREATE TRIGGER set_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

-- Function to generate receipt number
CREATE OR REPLACE FUNCTION generate_receipt_number()
RETURNS TRIGGER AS $$
DECLARE
    year_suffix TEXT;
    seq_num INTEGER;
BEGIN
    IF NEW.status = 'success' AND NEW.receipt_number IS NULL THEN
        year_suffix := to_char(now(), 'YY');
        SELECT COALESCE(MAX(CAST(right(receipt_number, 6) AS INTEGER)), 0) + 1 
        INTO seq_num 
        FROM payments 
        WHERE receipt_number LIKE 'RCP-' || year_suffix || '-%';
        
        NEW.receipt_number := 'RCP-' || year_suffix || '-' || lpad(seq_num::TEXT, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to generate receipt number
CREATE TRIGGER generate_receipt_number_trigger
    BEFORE INSERT OR UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION generate_receipt_number();

-- Function to sync payment status to registration
CREATE OR REPLACE FUNCTION sync_registration_payment_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'success' THEN
        UPDATE registrations 
        SET payment_status = 'completed',
            status = 'confirmed',
            amount_paid = NEW.total_amount
        WHERE id = NEW.registration_id;
        NEW.completed_at := now();
    ELSIF NEW.status = 'failed' THEN
        UPDATE registrations 
        SET payment_status = 'failed'
        WHERE id = NEW.registration_id;
    ELSIF NEW.status IN ('refunded', 'partially_refunded') THEN
        UPDATE registrations 
        SET payment_status = 'refunded',
            status = 'cancelled'
        WHERE id = NEW.registration_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to sync payment status
CREATE TRIGGER sync_registration_payment
    AFTER INSERT OR UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION sync_registration_payment_status();
