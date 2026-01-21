-- =============================================
-- ANALYTICS FUNCTIONS
-- =============================================

-- Get admin dashboard statistics
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS JSON AS $$
BEGIN
    IF NOT is_admin() THEN
        RAISE EXCEPTION 'Unauthorized';
    END IF;
    
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

-- Get detailed analytics for a specific sport
CREATE OR REPLACE FUNCTION get_sport_analytics(p_sport_id UUID)
RETURNS JSON AS $$
BEGIN
    RETURN json_build_object(
        'total_registrations', (SELECT COUNT(*) FROM registrations WHERE sport_id = p_sport_id AND status != 'cancelled'),
        'confirmed', (SELECT COUNT(*) FROM registrations WHERE sport_id = p_sport_id AND status = 'confirmed'),
        'pending', (SELECT COUNT(*) FROM registrations WHERE sport_id = p_sport_id AND status IN ('pending', 'payment_pending')),
        'waitlist', (SELECT COUNT(*) FROM registrations WHERE sport_id = p_sport_id AND status = 'waitlist'),
        'cancelled', (SELECT COUNT(*) FROM registrations WHERE sport_id = p_sport_id AND status IN ('cancelled', 'withdrawn')),
        'revenue', (SELECT COALESCE(SUM(p.total_amount), 0) FROM payments p JOIN registrations r ON p.registration_id = r.id WHERE r.sport_id = p_sport_id AND p.status = 'success'),
        'colleges', (SELECT json_agg(DISTINCT pr.college) FROM registrations r JOIN profiles pr ON r.participant_id = pr.id WHERE r.sport_id = p_sport_id AND r.status = 'confirmed')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get sports analytics summary
CREATE OR REPLACE FUNCTION get_sports_analytics_summary()
RETURNS JSON AS $$
BEGIN
    IF NOT is_admin() THEN
        RAISE EXCEPTION 'Unauthorized';
    END IF;
    
    RETURN (
        SELECT json_agg(row_to_json(t))
        FROM (
            SELECT 
                s.id,
                s.name,
                s.category,
                s.is_registration_open,
                s.current_participants,
                s.max_participants,
                COALESCE((
                    SELECT SUM(p.total_amount) 
                    FROM payments p 
                    JOIN registrations r ON p.registration_id = r.id 
                    WHERE r.sport_id = s.id AND p.status = 'success'
                ), 0) as revenue,
                (SELECT COUNT(*) FROM registrations WHERE sport_id = s.id AND status = 'waitlist') as waitlist_count
            FROM sports s
            WHERE s.is_archived = false
            ORDER BY s.current_participants DESC
        ) t
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get college-wise participation
CREATE OR REPLACE FUNCTION get_college_analytics()
RETURNS JSON AS $$
BEGIN
    IF NOT is_admin() THEN
        RAISE EXCEPTION 'Unauthorized';
    END IF;
    
    RETURN (
        SELECT json_agg(row_to_json(t))
        FROM (
            SELECT 
                p.college,
                COUNT(DISTINCT r.id) as registrations,
                COUNT(DISTINCT r.participant_id) as participants,
                COALESCE(SUM(pay.total_amount), 0) as total_paid
            FROM profiles p
            JOIN registrations r ON p.id = r.participant_id
            LEFT JOIN payments pay ON r.id = pay.registration_id AND pay.status = 'success'
            WHERE r.status = 'confirmed'
            GROUP BY p.college
            ORDER BY registrations DESC
        ) t
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get revenue analytics by period
CREATE OR REPLACE FUNCTION get_revenue_analytics(
    p_period TEXT DEFAULT 'daily',
    p_from DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
    p_to DATE DEFAULT CURRENT_DATE
)
RETURNS JSON AS $$
DECLARE
    v_interval TEXT;
    v_format TEXT;
BEGIN
    IF NOT is_admin() THEN
        RAISE EXCEPTION 'Unauthorized';
    END IF;
    
    CASE p_period
        WHEN 'daily' THEN
            v_interval := '1 day';
            v_format := 'YYYY-MM-DD';
        WHEN 'weekly' THEN
            v_interval := '1 week';
            v_format := 'YYYY-"W"IW';
        WHEN 'monthly' THEN
            v_interval := '1 month';
            v_format := 'YYYY-MM';
        ELSE
            v_interval := '1 day';
            v_format := 'YYYY-MM-DD';
    END CASE;
    
    RETURN (
        SELECT json_agg(row_to_json(t))
        FROM (
            SELECT 
                to_char(date_trunc(p_period, created_at), v_format) as period,
                COUNT(*) as transactions,
                SUM(total_amount) as revenue
            FROM payments
            WHERE status = 'success'
            AND created_at::date >= p_from
            AND created_at::date <= p_to
            GROUP BY date_trunc(p_period, created_at)
            ORDER BY date_trunc(p_period, created_at)
        ) t
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get registration trends
CREATE OR REPLACE FUNCTION get_registration_trends(p_days INTEGER DEFAULT 30)
RETURNS JSON AS $$
BEGIN
    IF NOT is_admin() THEN
        RAISE EXCEPTION 'Unauthorized';
    END IF;
    
    RETURN (
        SELECT json_agg(row_to_json(t))
        FROM (
            SELECT 
                registered_at::date as date,
                COUNT(*) as registrations,
                COUNT(*) FILTER (WHERE status = 'confirmed') as confirmed,
                COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled
            FROM registrations
            WHERE registered_at >= CURRENT_DATE - (p_days || ' days')::INTERVAL
            GROUP BY registered_at::date
            ORDER BY registered_at::date
        ) t
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
