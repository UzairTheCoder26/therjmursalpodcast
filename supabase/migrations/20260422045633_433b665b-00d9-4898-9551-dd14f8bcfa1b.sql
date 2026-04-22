
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can upload resumes" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'resumes');
CREATE POLICY "Admins can read resumes" ON storage.objects FOR SELECT
  USING (bucket_id = 'resumes' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete resumes" ON storage.objects FOR DELETE
  USING (bucket_id = 'resumes' AND public.has_role(auth.uid(), 'admin'));

INSERT INTO storage.buckets (id, name, public) VALUES ('profile', 'profile', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view profile images" ON storage.objects FOR SELECT
  USING (bucket_id = 'profile');
CREATE POLICY "Admins manage profile images" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'profile' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update profile images" ON storage.objects FOR UPDATE
  USING (bucket_id = 'profile' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete profile images" ON storage.objects FOR DELETE
  USING (bucket_id = 'profile' AND public.has_role(auth.uid(), 'admin'));
