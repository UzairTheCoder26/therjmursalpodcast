
-- Guest letters (homepage "Write a Letter" form)
CREATE TABLE IF NOT EXISTS public.guest_letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.guest_letters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit letters" ON public.guest_letters
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins manage letters" ON public.guest_letters
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.site_content (key, value)
VALUES (
  'write_a_letter',
  '{"heading":"Write a Letter","subheading":"Share your story, feedback, or a message for RJ — we read every letter.","submit_label":"Send Letter"}'
)
ON CONFLICT (key) DO NOTHING;
