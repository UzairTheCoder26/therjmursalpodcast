-- Parent/Guardian consent for minor participation in The RJ Mursal Podcast
CREATE TABLE IF NOT EXISTS public.minor_participation_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_full_name TEXT NOT NULL,
  child_age INTEGER NOT NULL,
  child_date_of_birth DATE NOT NULL,
  guardian_full_name TEXT NOT NULL,
  guardian_relationship TEXT NOT NULL,
  guardian_mobile TEXT NOT NULL,
  guardian_email TEXT NOT NULL,
  accept_terms BOOLEAN NOT NULL DEFAULT false,
  confirm_guardian_consent BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.minor_participation_consents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit minor consent" ON public.minor_participation_consents
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins manage minor consents" ON public.minor_participation_consents
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
