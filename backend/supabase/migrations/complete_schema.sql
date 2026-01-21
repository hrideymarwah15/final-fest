-- =============================================
-- SPORTS REGISTRATION SYSTEM - COMPLETE SCHEMA
-- Run this entire file in Supabase SQL Editor
-- =============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- UTILITY FUNCTIONS
-- =============================================

CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role = 'admin'
    );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_coordinator()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role IN ('admin', 'coordinator')
    );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- =============================================
-- PROFILES TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    college TEXT NOT NULL,
    role TEXT DEFAULT 'participant' CHECK (role IN ('participant', 'admin', 'coordinator')),
    avatar_url TEXT,
    email_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_college ON profiles(college);
CREATE INDEX IF NOT EXISTS idx_profiles_is_active ON profiles(is_active);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (is_admin());
CREATE POLICY "Admins can update any profile" ON profiles FOR UPDATE USING (is_admin());
CREATE POLICY "Enable insert for authenticated users only" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name, phone, college)
    VALUES (
        NEW.id,
        COALESCE(NEW.email, ''),
        COALESCE(NEW.raw_user_meta_data->>'name', ''),
        COALESCE(NEW.raw_user_meta_data->>'phone', ''),
        COALESCE(NEW.raw_user_meta_data->>'college', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =============================================
-- SPORTS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS sports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL CHECK (category IN ('indoor', 'outdoor', 'esports', 'athletics')),
    description TEXT,
    rules TEXT,
    image_url TEXT,
    is_team_event BOOLEAN DEFAULT false,
    team_size_min INTEGER NOT NULL DEFAULT 1,
    team_size_max INTEGER NOT NULL DEFAULT 1,
    fees DECIMAL(10,2) NOT NULL,
    early_bird_fees DECIMAL(10,2),
    early_bird_deadline TIMESTAMPTZ,
    schedule_start TIMESTAMPTZ,
    schedule_end TIMESTAMPTZ,
    venue TEXT,
    registration_start TIMESTAMPTZ NOT NULL,
    registration_deadline TIMESTAMPTZ NOT NULL,
    is_registration_open BOOLEAN DEFAULT false,
    max_participants INTEGER,
    current_participants INTEGER DEFAULT 0,
    waitlist_enabled BOOLEAN DEFAULT true,
    max_waitlist INTEGER DEFAULT 10,
    created_by UUID REFERENCES profiles(id),
    is_archived BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT valid_team_size CHECK (team_size_max >= team_size_min),
    CONSTRAINT valid_registration_period CHECK (registration_deadline > registration_start),
    CONSTRAINT valid_schedule CHECK (schedule_end IS NULL OR schedule_end > schedule_start),
    CONSTRAINT valid_capacity CHECK (current_participants >= 0)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_sports_slug ON sports(slug);
CREATE INDEX IF NOT EXISTS idx_sports_category ON sports(category);
CREATE INDEX IF NOT EXISTS idx_sports_is_registration_open ON sports(is_registration_open);

ALTER TABLE sports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active sports" ON sports FOR SELECT USING (is_archived = false);
CREATE POLICY "Admins can view all sports" ON sports FOR SELECT USING (is_admin());
CREATE POLICY "Admins can insert sports" ON sports FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update sports" ON sports FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can delete sports" ON sports FOR DELETE USING (is_admin());

CREATE TRIGGER set_sports_updated_at BEFORE UPDATE ON sports FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE OR REPLACE FUNCTION generate_sport_slug()
RETURNS TRIGGER AS $$
DECLARE
    base_slug TEXT;
    final_slug TEXT;
    counter INTEGER := 0;
BEGIN
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        base_slug := lower(regexp_replace(NEW.name, '[^a-zA-Z0-9]+', '-', 'g'));
        base_slug := trim(both '-' from base_slug);
        final_slug := base_slug;
        WHILE EXISTS (SELECT 1 FROM sports WHERE slug = final_slug AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)) LOOP
            counter := counter + 1;
            final_slug := base_slug || '-' || counter;
        END LOOP;
        NEW.slug := final_slug;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_sport_slug_trigger BEFORE INSERT ON sports FOR EACH ROW EXECUTE FUNCTION generate_sport_slug();

CREATE OR REPLACE FUNCTION get_applicable_fees(sport_id UUID)
RETURNS DECIMAL(10,2) AS $$
    SELECT CASE 
        WHEN early_bird_deadline IS NOT NULL AND now() < early_bird_deadline AND early_bird_fees IS NOT NULL
        THEN early_bird_fees
        ELSE fees
    END
    FROM sports WHERE id = sport_id;
$$ LANGUAGE sql STABLE;

-- =============================================
-- REGISTRATIONS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_number TEXT UNIQUE,
    participant_id UUID REFERENCES profiles(id) NOT NULL,
    sport_id UUID REFERENCES sports(id) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'payment_pending', 'confirmed', 'waitlist', 'cancelled', 'withdrawn')),
    is_team BOOLEAN DEFAULT false,
    team_name TEXT,
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
    amount_paid DECIMAL(10,2) DEFAULT 0,
    waitlist_position INTEGER,
    confirmed_at TIMESTAMPTZ,
    withdrawal_reason TEXT,
    cancelled_at TIMESTAMPTZ,
    cancelled_by UUID REFERENCES profiles(id),
    registered_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT unique_participant_sport UNIQUE (participant_id, sport_id)
);

CREATE INDEX IF NOT EXISTS idx_registrations_participant ON registrations(participant_id);
CREATE INDEX IF NOT EXISTS idx_registrations_sport ON registrations(sport_id);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON registrations(status);

ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own registrations" ON registrations FOR SELECT USING (participant_id = auth.uid());
CREATE POLICY "Users can create registrations" ON registrations FOR INSERT WITH CHECK (participant_id = auth.uid());
CREATE POLICY "Users can update own pending registrations" ON registrations FOR UPDATE USING (participant_id = auth.uid() AND status IN ('pending', 'payment_pending'));
CREATE POLICY "Admins can view all registrations" ON registrations FOR SELECT USING (is_admin());
CREATE POLICY "Admins can update any registration" ON registrations FOR UPDATE USING (is_admin());

CREATE TRIGGER set_registrations_updated_at BEFORE UPDATE ON registrations FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE OR REPLACE FUNCTION generate_registration_number()
RETURNS TRIGGER AS $$
DECLARE
    sport_code TEXT;
    seq_num INTEGER;
BEGIN
    SELECT upper(left(name, 3)) INTO sport_code FROM sports WHERE id = NEW.sport_id;
    SELECT COALESCE(MAX(CAST(right(registration_number, 4) AS INTEGER)), 0) + 1 
    INTO seq_num FROM registrations WHERE sport_id = NEW.sport_id AND registration_number IS NOT NULL;
    NEW.registration_number := 'REG-' || COALESCE(sport_code, 'UNK') || '-' || lpad(seq_num::TEXT, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_registration_number_trigger BEFORE INSERT ON registrations FOR EACH ROW EXECUTE FUNCTION generate_registration_number();

CREATE OR REPLACE FUNCTION sync_sport_participant_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE sports SET current_participants = (
        SELECT COUNT(*) FROM registrations WHERE sport_id = COALESCE(NEW.sport_id, OLD.sport_id) AND status = 'confirmed'
    ) WHERE id = COALESCE(NEW.sport_id, OLD.sport_id);
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_participant_count AFTER INSERT OR UPDATE OR DELETE ON registrations FOR EACH ROW EXECUTE FUNCTION sync_sport_participant_count();

CREATE OR REPLACE FUNCTION can_register_for_sport(p_sport_id UUID, p_user_id UUID)
RETURNS TABLE(can_register BOOLEAN, reason TEXT, waitlist_available BOOLEAN) AS $$
DECLARE
    v_sport RECORD;
    v_existing_reg RECORD;
BEGIN
    SELECT * INTO v_sport FROM sports WHERE id = p_sport_id;
    IF NOT FOUND THEN RETURN QUERY SELECT false, 'Sport not found'::TEXT, false; RETURN; END IF;
    IF v_sport.is_archived THEN RETURN QUERY SELECT false, 'Sport is archived'::TEXT, false; RETURN; END IF;
    IF NOT v_sport.is_registration_open THEN RETURN QUERY SELECT false, 'Registration is closed'::TEXT, false; RETURN; END IF;
    IF now() > v_sport.registration_deadline THEN RETURN QUERY SELECT false, 'Registration deadline passed'::TEXT, false; RETURN; END IF;
    IF now() < v_sport.registration_start THEN RETURN QUERY SELECT false, 'Registration not yet started'::TEXT, false; RETURN; END IF;
    
    SELECT * INTO v_existing_reg FROM registrations WHERE participant_id = p_user_id AND sport_id = p_sport_id AND status NOT IN ('cancelled', 'withdrawn');
    IF FOUND THEN RETURN QUERY SELECT false, 'Already registered for this sport'::TEXT, false; RETURN; END IF;
    
    IF v_sport.max_participants IS NOT NULL AND v_sport.current_participants >= v_sport.max_participants THEN
        IF v_sport.waitlist_enabled THEN RETURN QUERY SELECT true, 'Waitlist available'::TEXT, true;
        ELSE RETURN QUERY SELECT false, 'Sport is full'::TEXT, false; END IF;
        RETURN;
    END IF;
    RETURN QUERY SELECT true, 'OK'::TEXT, false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- TEAM MEMBERS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_id UUID REFERENCES registrations(id) ON DELETE CASCADE NOT NULL,
    member_order INTEGER NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    is_captain BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT unique_member_order UNIQUE (registration_id, member_order)
);

CREATE INDEX IF NOT EXISTS idx_team_members_registration ON team_members(registration_id);
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own team members" ON team_members FOR SELECT USING (
    EXISTS (SELECT 1 FROM registrations r WHERE r.id = registration_id AND r.participant_id = auth.uid())
);
CREATE POLICY "Admins can view all team members" ON team_members FOR SELECT USING (is_admin());

-- =============================================
-- PAYMENTS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_id UUID REFERENCES registrations(id) NOT NULL,
    user_id UUID REFERENCES profiles(id) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    convenience_fee DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    method TEXT NOT NULL CHECK (method IN ('online', 'offline', 'free')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'success', 'failed', 'refunded', 'partially_refunded')),
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    gateway_response JSONB,
    receipt_number TEXT,
    receipt_url TEXT,
    offline_verified_by UUID REFERENCES profiles(id),
    offline_verification_note TEXT,
    offline_verified_at TIMESTAMPTZ,
    refund_amount DECIMAL(10,2),
    refund_reason TEXT,
    refund_id TEXT,
    refund_processed_by UUID REFERENCES profiles(id),
    refund_processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    completed_at TIMESTAMPTZ,
    CONSTRAINT valid_refund CHECK (refund_amount IS NULL OR refund_amount <= total_amount)
);

CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_registration ON payments(registration_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "System can create payments" ON payments FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can view all payments" ON payments FOR SELECT USING (is_admin());
CREATE POLICY "Admins can update payments" ON payments FOR UPDATE USING (is_admin());

CREATE TRIGGER set_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE OR REPLACE FUNCTION sync_registration_payment_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'success' THEN
        UPDATE registrations SET payment_status = 'completed', status = 'confirmed', amount_paid = NEW.total_amount WHERE id = NEW.registration_id;
        NEW.completed_at := now();
    ELSIF NEW.status = 'failed' THEN
        UPDATE registrations SET payment_status = 'failed' WHERE id = NEW.registration_id;
    ELSIF NEW.status IN ('refunded', 'partially_refunded') THEN
        UPDATE registrations SET payment_status = 'refunded', status = 'cancelled' WHERE id = NEW.registration_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sync_registration_payment AFTER INSERT OR UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION sync_registration_payment_status();

-- =============================================
-- NOTIFICATIONS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('registration', 'payment', 'announcement', 'reminder', 'waitlist', 'cancellation')),
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    action_url TEXT,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    email_sent BOOLEAN DEFAULT false,
    email_sent_at TIMESTAMPTZ,
    related_sport_id UUID REFERENCES sports(id) ON DELETE SET NULL,
    related_registration_id UUID REFERENCES registrations(id) ON DELETE SET NULL,
    metadata JSONB,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient_read ON notifications(recipient_id, is_read);
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (recipient_id = auth.uid());
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (recipient_id = auth.uid());
CREATE POLICY "System can insert notifications" ON notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage all notifications" ON notifications FOR ALL USING (is_admin());

-- =============================================
-- AUDIT LOGS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    request_id TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit logs" ON audit_logs FOR SELECT USING (is_admin());
CREATE POLICY "System can insert audit logs" ON audit_logs FOR INSERT WITH CHECK (true);

CREATE OR REPLACE FUNCTION create_audit_log(
    p_action TEXT,
    p_entity_type TEXT,
    p_entity_id UUID DEFAULT NULL,
    p_old_values JSONB DEFAULT NULL,
    p_new_values JSONB DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_request_id TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE v_log_id UUID;
BEGIN
    INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_values, new_values, ip_address, user_agent, request_id)
    VALUES (auth.uid(), p_action, p_entity_type, p_entity_id, p_old_values, p_new_values, p_ip_address, p_user_agent, p_request_id)
    RETURNING id INTO v_log_id;
    RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- COLLEGES & SETTINGS TABLES
-- =============================================

CREATE TABLE IF NOT EXISTS colleges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    short_name TEXT,
    city TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE colleges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active colleges" ON colleges FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage colleges" ON colleges FOR ALL USING (is_admin());

CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_by UUID REFERENCES profiles(id),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Admins can update settings" ON settings FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can insert settings" ON settings FOR INSERT WITH CHECK (is_admin());

INSERT INTO settings (key, value, description) VALUES
    ('site_name', '"Sports Fest 2024"', 'Name of the sports fest'),
    ('registration_enabled', 'true', 'Global registration toggle'),
    ('payment_methods', '["online", "offline"]', 'Enabled payment methods'),
    ('convenience_fee', '0', 'Convenience fee for online payments'),
    ('contact_email', '"contact@sportsfest.com"', 'Contact email'),
    ('contact_phone', '"+91 9876543210"', 'Contact phone')
ON CONFLICT (key) DO NOTHING;

-- =============================================
-- ANALYTICS FUNCTIONS
-- =============================================

CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS JSON AS $$
BEGIN
    IF NOT is_admin() THEN RAISE EXCEPTION 'Unauthorized'; END IF;
    RETURN json_build_object(
        'total_registrations', (SELECT COUNT(*) FROM registrations WHERE status != 'cancelled'),
        'confirmed_registrations', (SELECT COUNT(*) FROM registrations WHERE status = 'confirmed'),
        'pending_payments', (SELECT COUNT(*) FROM registrations WHERE status = 'payment_pending'),
        'waitlisted', (SELECT COUNT(*) FROM registrations WHERE status = 'waitlist'),
        'total_revenue', (SELECT COALESCE(SUM(total_amount), 0) FROM payments WHERE status = 'success'),
        'todays_revenue', (SELECT COALESCE(SUM(total_amount), 0) FROM payments WHERE status = 'success' AND created_at::date = CURRENT_DATE),
        'active_sports', (SELECT COUNT(*) FROM sports WHERE is_registration_open = true AND is_archived = false),
        'total_participants', (SELECT COUNT(DISTINCT participant_id) FROM registrations WHERE status = 'confirmed'),
        'colleges_count', (SELECT COUNT(DISTINCT college) FROM profiles WHERE id IN (SELECT participant_id FROM registrations WHERE status = 'confirmed'))
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_sports_analytics_summary()
RETURNS JSON AS $$
BEGIN
    IF NOT is_admin() THEN RAISE EXCEPTION 'Unauthorized'; END IF;
    RETURN (
        SELECT json_agg(row_to_json(t))
        FROM (
            SELECT s.id, s.name, s.category, s.is_registration_open, s.current_participants, s.max_participants,
                COALESCE((SELECT SUM(p.total_amount) FROM payments p JOIN registrations r ON p.registration_id = r.id WHERE r.sport_id = s.id AND p.status = 'success'), 0) as revenue,
                (SELECT COUNT(*) FROM registrations WHERE sport_id = s.id AND status = 'waitlist') as waitlist_count
            FROM sports s WHERE s.is_archived = false ORDER BY s.current_participants DESC
        ) t
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_college_analytics()
RETURNS JSON AS $$
BEGIN
    IF NOT is_admin() THEN RAISE EXCEPTION 'Unauthorized'; END IF;
    RETURN (
        SELECT json_agg(row_to_json(t))
        FROM (
            SELECT p.college, COUNT(DISTINCT r.id) as registrations, COUNT(DISTINCT r.participant_id) as participants,
                COALESCE(SUM(pay.total_amount), 0) as total_paid
            FROM profiles p JOIN registrations r ON p.id = r.participant_id
            LEFT JOIN payments pay ON r.id = pay.registration_id AND pay.status = 'success'
            WHERE r.status = 'confirmed' GROUP BY p.college ORDER BY registrations DESC
        ) t
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_registration_trends(p_days INTEGER DEFAULT 30)
RETURNS JSON AS $$
BEGIN
    IF NOT is_admin() THEN RAISE EXCEPTION 'Unauthorized'; END IF;
    RETURN (
        SELECT json_agg(row_to_json(t))
        FROM (
            SELECT registered_at::date as date, COUNT(*) as registrations,
                COUNT(*) FILTER (WHERE status = 'confirmed') as confirmed,
                COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled
            FROM registrations WHERE registered_at >= CURRENT_DATE - (p_days || ' days')::INTERVAL
            GROUP BY registered_at::date ORDER BY registered_at::date
        ) t
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- STORAGE BUCKETS (Run in Supabase Dashboard)
-- =============================================
-- Note: Run these in SQL Editor or create via Dashboard

-- INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) VALUES
--     ('sport-images', 'sport-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
--     ('avatars', 'avatars', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp']),
--     ('receipts', 'receipts', false, 1048576, ARRAY['application/pdf'])
-- ON CONFLICT (id) DO NOTHING;

-- =============================================
-- DONE! Your database is ready.
-- =============================================
