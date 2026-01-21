-- =============================================
-- REGISTRATIONS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_number TEXT UNIQUE,
    participant_id UUID REFERENCES profiles(id) NOT NULL,
    sport_id UUID REFERENCES sports(id) NOT NULL,
    
    -- Status Flow: pending -> payment_pending -> confirmed | waitlist -> cancelled
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'payment_pending', 'confirmed', 'waitlist', 'cancelled', 'withdrawn')),
    
    -- Team Details
    is_team BOOLEAN DEFAULT false,
    team_name TEXT,
    
    -- Payment Tracking (denormalized for quick access)
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
    amount_paid DECIMAL(10,2) DEFAULT 0,
    
    -- Position Tracking
    waitlist_position INTEGER,
    confirmed_at TIMESTAMPTZ,
    
    -- Cancellation
    withdrawal_reason TEXT,
    cancelled_at TIMESTAMPTZ,
    cancelled_by UUID REFERENCES profiles(id),
    
    -- Timestamps
    registered_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    -- Constraints
    CONSTRAINT unique_participant_sport UNIQUE (participant_id, sport_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_registrations_participant ON registrations(participant_id);
CREATE INDEX IF NOT EXISTS idx_registrations_sport ON registrations(sport_id);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON registrations(status);
CREATE INDEX IF NOT EXISTS idx_registrations_payment_status ON registrations(payment_status);
CREATE INDEX IF NOT EXISTS idx_registrations_number ON registrations(registration_number);
CREATE INDEX IF NOT EXISTS idx_registrations_waitlist ON registrations(sport_id, waitlist_position) WHERE status = 'waitlist';

-- Enable Row Level Security
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own registrations" ON registrations
    FOR SELECT USING (participant_id = auth.uid());

CREATE POLICY "Users can create registrations" ON registrations
    FOR INSERT WITH CHECK (participant_id = auth.uid());

CREATE POLICY "Users can update own pending registrations" ON registrations
    FOR UPDATE USING (participant_id = auth.uid() AND status IN ('pending', 'payment_pending'));

CREATE POLICY "Admins can view all registrations" ON registrations
    FOR SELECT USING (is_admin());

CREATE POLICY "Admins can update any registration" ON registrations
    FOR UPDATE USING (is_admin());

-- Trigger for updated_at
CREATE TRIGGER set_registrations_updated_at
    BEFORE UPDATE ON registrations
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

-- Function to generate unique registration number
CREATE OR REPLACE FUNCTION generate_registration_number()
RETURNS TRIGGER AS $$
DECLARE
    sport_code TEXT;
    seq_num INTEGER;
BEGIN
    SELECT upper(left(name, 3)) INTO sport_code FROM sports WHERE id = NEW.sport_id;
    SELECT COALESCE(MAX(CAST(right(registration_number, 4) AS INTEGER)), 0) + 1 
    INTO seq_num 
    FROM registrations 
    WHERE sport_id = NEW.sport_id AND registration_number IS NOT NULL;
    
    NEW.registration_number := 'REG-' || COALESCE(sport_code, 'UNK') || '-' || lpad(seq_num::TEXT, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to generate registration number
CREATE TRIGGER generate_registration_number_trigger
    BEFORE INSERT ON registrations
    FOR EACH ROW
    EXECUTE FUNCTION generate_registration_number();

-- Function to sync sport participant count
CREATE OR REPLACE FUNCTION sync_sport_participant_count()
RETURNS TRIGGER AS $$
DECLARE
    target_sport_id UUID;
BEGIN
    target_sport_id := COALESCE(NEW.sport_id, OLD.sport_id);
    
    UPDATE sports 
    SET current_participants = (
        SELECT COUNT(*) FROM registrations 
        WHERE sport_id = target_sport_id AND status = 'confirmed'
    )
    WHERE id = target_sport_id;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update participant count
CREATE TRIGGER update_participant_count
    AFTER INSERT OR UPDATE OR DELETE ON registrations
    FOR EACH ROW
    EXECUTE FUNCTION sync_sport_participant_count();

-- Function to handle registration status changes
CREATE OR REPLACE FUNCTION handle_registration_status_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Set confirmed_at timestamp
    IF OLD.status != 'confirmed' AND NEW.status = 'confirmed' THEN
        NEW.confirmed_at := now();
    END IF;
    
    -- Set cancelled_at timestamp  
    IF NEW.status IN ('cancelled', 'withdrawn') AND OLD.status NOT IN ('cancelled', 'withdrawn') THEN
        NEW.cancelled_at := now();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for status change handling
CREATE TRIGGER handle_status_change
    BEFORE UPDATE ON registrations
    FOR EACH ROW
    EXECUTE FUNCTION handle_registration_status_change();

-- Function to check if user can register for a sport
CREATE OR REPLACE FUNCTION can_register_for_sport(p_sport_id UUID, p_user_id UUID)
RETURNS TABLE(can_register BOOLEAN, reason TEXT, waitlist_available BOOLEAN) AS $$
DECLARE
    v_sport RECORD;
    v_existing_reg RECORD;
BEGIN
    -- Get sport details
    SELECT * INTO v_sport FROM sports WHERE id = p_sport_id;
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, 'Sport not found'::TEXT, false;
        RETURN;
    END IF;
    
    IF v_sport.is_archived THEN
        RETURN QUERY SELECT false, 'Sport is archived'::TEXT, false;
        RETURN;
    END IF;
    
    IF NOT v_sport.is_registration_open THEN
        RETURN QUERY SELECT false, 'Registration is closed'::TEXT, false;
        RETURN;
    END IF;
    
    IF now() > v_sport.registration_deadline THEN
        RETURN QUERY SELECT false, 'Registration deadline passed'::TEXT, false;
        RETURN;
    END IF;
    
    IF now() < v_sport.registration_start THEN
        RETURN QUERY SELECT false, 'Registration not yet started'::TEXT, false;
        RETURN;
    END IF;
    
    -- Check existing registration
    SELECT * INTO v_existing_reg FROM registrations 
    WHERE participant_id = p_user_id AND sport_id = p_sport_id 
    AND status NOT IN ('cancelled', 'withdrawn');
    
    IF FOUND THEN
        RETURN QUERY SELECT false, 'Already registered for this sport'::TEXT, false;
        RETURN;
    END IF;
    
    -- Check capacity
    IF v_sport.max_participants IS NOT NULL THEN
        IF v_sport.current_participants >= v_sport.max_participants THEN
            IF v_sport.waitlist_enabled THEN
                RETURN QUERY SELECT true, 'Waitlist available'::TEXT, true;
            ELSE
                RETURN QUERY SELECT false, 'Sport is full'::TEXT, false;
            END IF;
            RETURN;
        END IF;
    END IF;
    
    RETURN QUERY SELECT true, 'OK'::TEXT, false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to promote from waitlist when spot opens
CREATE OR REPLACE FUNCTION promote_from_waitlist(p_sport_id UUID)
RETURNS UUID AS $$
DECLARE
    v_next_reg RECORD;
BEGIN
    SELECT * INTO v_next_reg FROM registrations
    WHERE sport_id = p_sport_id AND status = 'waitlist'
    ORDER BY waitlist_position ASC
    LIMIT 1
    FOR UPDATE SKIP LOCKED;
    
    IF FOUND THEN
        UPDATE registrations 
        SET status = 'payment_pending', waitlist_position = NULL
        WHERE id = v_next_reg.id;
        
        -- Create notification
        INSERT INTO notifications (recipient_id, type, priority, title, message, related_sport_id, related_registration_id)
        VALUES (
            v_next_reg.participant_id,
            'waitlist',
            'high',
            'Spot Available!',
            'A spot has opened up for your waitlisted registration. Please complete payment within 24 hours.',
            p_sport_id,
            v_next_reg.id
        );
        
        RETURN v_next_reg.id;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger function to handle cancellation and promote from waitlist
CREATE OR REPLACE FUNCTION handle_registration_cancelled()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status = 'confirmed' AND NEW.status IN ('cancelled', 'withdrawn') THEN
        PERFORM promote_from_waitlist(NEW.sport_id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for waitlist promotion on cancellation
CREATE TRIGGER promote_waitlist_on_cancel
    AFTER UPDATE ON registrations
    FOR EACH ROW
    EXECUTE FUNCTION handle_registration_cancelled();
