-- Kashmir Meet-Up Tour 2026 registrations
CREATE TABLE IF NOT EXISTS public.meetup_tour_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS meetup_tour_registrations_whatsapp_unique
  ON public.meetup_tour_registrations (whatsapp);

ALTER TABLE public.meetup_tour_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit meetup registration" ON public.meetup_tour_registrations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins manage meetup registrations" ON public.meetup_tour_registrations
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.site_content (key, value)
VALUES (
  'meetup_tour',
  '{
    "registration_open": true,
    "hero_title": "Kashmir Meet-Up Tour 2026",
    "hero_subtitle": "One Valley. One Journey. One Community.",
    "description": "I''m coming to every district of Kashmir to meet creators, students, entrepreneurs, and anyone. Register below and I''ll notify you when I visit your district.",
    "button_text": "Register Now",
    "districts": ["Srinagar", "Pulwama", "Kupwara", "Baramulla", "Bandipora", "Ganderbal", "Budgam", "Shopian", "Kulgam", "Anantnag"],
    "success_message": "You''re registered! We''ll notify you on WhatsApp when RJ Mursal visits your district.",
    "closed_message": "Registrations are currently closed.",
    "seo_title": "Kashmir Meet-Up Tour 2026 — Register | RJMursal",
    "seo_description": "Join the Kashmir Meet-Up Tour 2026. Register from any district and get notified when RJ Mursal visits your area."
  }'::jsonb
)
ON CONFLICT (key) DO NOTHING;

-- Remove guest letter feature
DROP POLICY IF EXISTS "Anyone can submit letters" ON public.guest_letters;
DROP POLICY IF EXISTS "Admins manage letters" ON public.guest_letters;
DROP TABLE IF EXISTS public.guest_letters;

DELETE FROM public.site_content WHERE key = 'write_a_letter';
