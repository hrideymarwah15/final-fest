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
    
    -- Team Configuration
    is_team_event BOOLEAN DEFAULT false,
    team_size_min INTEGER NOT NULL DEFAULT 1,
    team_size_max INTEGER NOT NULL DEFAULT 1,
    
    -- Pricing
    fees DECIMAL(10,2) NOT NULL,
    early_bird_fees DECIMAL(10,2),
    early_bird_deadline TIMESTAMPTZ,
    
    -- Schedule
    schedule_start TIMESTAMPTZ,
    schedule_end TIMESTAMPTZ,
    venue TEXT,
    
    -- Registration Control
    registration_start TIMESTAMPTZ NOT NULL,
    registration_deadline TIMESTAMPTZ NOT NULL,
    is_registration_open BOOLEAN DEFAULT false,
    
    -- Capacity
    max_participants INTEGER,
    current_participants INTEGER DEFAULT 0,
    waitlist_enabled BOOLEAN DEFAULT true,
    max_waitlist INTEGER DEFAULT 10,
    
    -- Metadata
    created_by UUID REFERENCES profiles(id),
    is_archived BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    -- Constraints
    CONSTRAINT valid_team_size CHECK (team_size_max >= team_size_min),
    CONSTRAINT valid_registration_period CHECK (registration_deadline > registration_start),
    CONSTRAINT valid_schedule CHECK (schedule_end IS NULL OR schedule_end > schedule_start),
    CONSTRAINT valid_capacity CHECK (current_participants >= 0)
);

-- Indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_sports_slug ON sports(slug);
CREATE INDEX IF NOT EXISTS idx_sports_category ON sports(category);
CREATE INDEX IF NOT EXISTS idx_sports_is_registration_open ON sports(is_registration_open);
CREATE INDEX IF NOT EXISTS idx_sports_registration_deadline ON sports(registration_deadline);
CREATE INDEX IF NOT EXISTS idx_sports_is_archived ON sports(is_archived);
CREATE INDEX IF NOT EXISTS idx_sports_registration_period ON sports(registration_start, registration_deadline);

-- Enable Row Level Security
ALTER TABLE sports ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view active sports" ON sports
    FOR SELECT USING (is_archived = false);

CREATE POLICY "Admins can view all sports" ON sports
    FOR SELECT USING (is_admin());

CREATE POLICY "Admins can insert sports" ON sports
    FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can update sports" ON sports
    FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete sports" ON sports
    FOR DELETE USING (is_admin());

-- Trigger for updated_at
CREATE TRIGGER set_sports_updated_at
    BEFORE UPDATE ON sports
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

-- Function to generate URL-friendly slug from sport name
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

-- Trigger to auto-generate slug
CREATE TRIGGER generate_sport_slug_trigger
    BEFORE INSERT ON sports
    FOR EACH ROW
    EXECUTE FUNCTION generate_sport_slug();

-- Function to auto-close registration when capacity is reached
CREATE OR REPLACE FUNCTION check_registration_capacity()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.max_participants IS NOT NULL AND NEW.current_participants >= NEW.max_participants THEN
        NEW.is_registration_open := false;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for capacity check
CREATE TRIGGER check_sport_capacity
    BEFORE UPDATE ON sports
    FOR EACH ROW
    EXECUTE FUNCTION check_registration_capacity();

-- Function to get applicable fees (early bird or regular)
CREATE OR REPLACE FUNCTION get_applicable_fees(sport_id UUID)
RETURNS DECIMAL(10,2) AS $$
    SELECT CASE 
        WHEN early_bird_deadline IS NOT NULL AND now() < early_bird_deadline AND early_bird_fees IS NOT NULL
        THEN early_bird_fees
        ELSE fees
    END
    FROM sports WHERE id = sport_id;
$$ LANGUAGE sql STABLE;
