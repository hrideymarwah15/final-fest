-- =============================================
-- COLLEGES TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS colleges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    short_name TEXT,
    city TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_colleges_name ON colleges(name);
CREATE INDEX IF NOT EXISTS idx_colleges_is_active ON colleges(is_active);

-- Enable Row Level Security
ALTER TABLE colleges ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view active colleges" ON colleges
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage colleges" ON colleges
    FOR ALL USING (is_admin());

-- =============================================
-- SETTINGS TABLE (Key-Value Store)
-- =============================================

CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_by UUID REFERENCES profiles(id),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view settings" ON settings
    FOR SELECT USING (true);

CREATE POLICY "Admins can update settings" ON settings
    FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can insert settings" ON settings
    FOR INSERT WITH CHECK (is_admin());

-- Insert default settings
INSERT INTO settings (key, value, description) VALUES
    ('site_name', '"Sports Fest 2024"', 'Name of the sports fest'),
    ('registration_enabled', 'true', 'Global registration toggle'),
    ('payment_methods', '["online", "offline"]', 'Enabled payment methods'),
    ('convenience_fee', '0', 'Convenience fee for online payments'),
    ('contact_email', '"contact@sportsfest.com"', 'Contact email address'),
    ('contact_phone', '"+91 9876543210"', 'Contact phone number'),
    ('event_dates', '{"start": null, "end": null}', 'Event start and end dates')
ON CONFLICT (key) DO NOTHING;
