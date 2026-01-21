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
    
    -- Constraints
    CONSTRAINT unique_member_order UNIQUE (registration_id, member_order),
    CONSTRAINT unique_member_email UNIQUE (registration_id, email)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_team_members_registration ON team_members(registration_id);
CREATE INDEX IF NOT EXISTS idx_team_members_email ON team_members(email);

-- Enable Row Level Security
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own team members" ON team_members
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM registrations r 
            WHERE r.id = registration_id AND r.participant_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage own team members" ON team_members
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM registrations r 
            WHERE r.id = registration_id 
            AND r.participant_id = auth.uid() 
            AND r.status IN ('pending', 'payment_pending')
        )
    );

CREATE POLICY "Admins can view all team members" ON team_members
    FOR SELECT USING (is_admin());

CREATE POLICY "Admins can manage all team members" ON team_members
    FOR ALL USING (is_admin());
