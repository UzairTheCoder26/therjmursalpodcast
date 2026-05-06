
-- Team Members
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  role TEXT NOT NULL,
  instagram_handle TEXT NOT NULL DEFAULT '',
  contact_button_label TEXT NOT NULL DEFAULT 'Contact',
  photo_path TEXT NOT NULL DEFAULT '',
  featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view team members" ON public.team_members
  FOR SELECT USING (true);

CREATE POLICY "Admins manage team members" ON public.team_members
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.set_updated_at_team_members()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_updated_at_team_members ON public.team_members;
CREATE TRIGGER trg_set_updated_at_team_members
BEFORE UPDATE ON public.team_members
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at_team_members();

-- Seed default team members (idempotent)
INSERT INTO public.team_members (full_name, role, instagram_handle, contact_button_label, featured, sort_order, photo_path)
SELECT 'RJ Mursal', 'Owner', 'rjmursal', 'Contact RJ', true, 1, ''
WHERE NOT EXISTS (SELECT 1 FROM public.team_members WHERE full_name = 'RJ Mursal');

INSERT INTO public.team_members (full_name, role, instagram_handle, contact_button_label, featured, sort_order, photo_path)
SELECT 'Huzaif', 'Cinematographer', 'huzaif', 'Contact Huzaif', true, 2, ''
WHERE NOT EXISTS (SELECT 1 FROM public.team_members WHERE full_name = 'Huzaif');

INSERT INTO public.team_members (full_name, role, instagram_handle, contact_button_label, featured, sort_order, photo_path)
SELECT 'Aaliya', 'Manager', 'aaliya', 'Contact Aaliya', true, 3, ''
WHERE NOT EXISTS (SELECT 1 FROM public.team_members WHERE full_name = 'Aaliya');

-- Team page + homepage team section content (key-value)
INSERT INTO public.site_content (key, value)
VALUES
  ('team_page_intro', '{"heading":"Meet the Team","body":"A small crew with a big voice — we plan, shoot, cut, and publish stories that people actually feel."}'),
  ('home_team', '{"meet_whole_team_button_label":"Meet Our Whole Team \u2192"}')
ON CONFLICT (key) DO NOTHING;

