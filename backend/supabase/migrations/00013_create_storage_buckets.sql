-- =============================================
-- STORAGE BUCKETS
-- =============================================

-- Create sport-images bucket (public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'sport-images',
    'sport-images',
    true,
    5242880, -- 5MB
    ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Create avatars bucket (public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'avatars',
    'avatars',
    true,
    2097152, -- 2MB
    ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Create receipts bucket (private)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'receipts',
    'receipts',
    false,
    1048576, -- 1MB
    ARRAY['application/pdf']
) ON CONFLICT (id) DO NOTHING;

-- =============================================
-- STORAGE POLICIES
-- =============================================

-- Sport Images Policies
CREATE POLICY "Anyone can view sport images" ON storage.objects
    FOR SELECT USING (bucket_id = 'sport-images');

CREATE POLICY "Admins can upload sport images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'sport-images' AND is_admin());

CREATE POLICY "Admins can update sport images" ON storage.objects
    FOR UPDATE USING (bucket_id = 'sport-images' AND is_admin());

CREATE POLICY "Admins can delete sport images" ON storage.objects
    FOR DELETE USING (bucket_id = 'sport-images' AND is_admin());

-- Avatar Policies
CREATE POLICY "Anyone can view avatars" ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'avatars' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can update own avatar" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'avatars' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete own avatar" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'avatars' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Receipt Policies
CREATE POLICY "Users can view own receipts" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'receipts' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "System can upload receipts" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'receipts');

CREATE POLICY "Admins can view all receipts" ON storage.objects
    FOR SELECT USING (bucket_id = 'receipts' AND is_admin());
