
-- Roles enum + user_roles table
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Service Bookings
CREATE TABLE public.service_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  company TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  service_type TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.service_bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit bookings" ON public.service_bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins manage bookings" ON public.service_bookings FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Podcast Feature Requests
CREATE TABLE public.podcast_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  profession TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  reason TEXT NOT NULL,
  social_handle TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.podcast_features ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit feature requests" ON public.podcast_features FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins manage features" ON public.podcast_features FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Sponsorship Inquiries
CREATE TABLE public.sponsorships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  budget_range TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.sponsorships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit sponsorships" ON public.sponsorships FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins manage sponsorships" ON public.sponsorships FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Job Listings
CREATE TABLE public.job_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  job_type TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.job_listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active jobs" ON public.job_listings FOR SELECT
  USING (is_active = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage jobs" ON public.job_listings FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Career Applications
CREATE TABLE public.career_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  position TEXT NOT NULL,
  portfolio_link TEXT,
  reason TEXT NOT NULL,
  resume_path TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.career_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can apply" ON public.career_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins manage applications" ON public.career_applications FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Site Content (key-value store for editable content)
CREATE TABLE public.site_content (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view content" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "Admins manage content" ON public.site_content FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Seed default content
INSERT INTO public.site_content (key, value) VALUES
('about', '{"title":"The Voice Behind The Mic","bio":"From the bustling streets of India to the airwaves of Studio M, RJ Mursal has spent years crafting stories that move millions. As a podcast host and storyteller, he brings raw, unfiltered conversations to life — interviewing changemakers, entertainers, and everyday heroes. His podcast has become a cultural pulse, blending humor, depth, and authenticity. Whether behind the mic or building branded stories in the studio, RJ Mursal is the voice that connects, inspires, and entertains.","stats":[{"label":"Years Experience","value":"5+"},{"label":"Podcasts","value":"50+"},{"label":"Brand Collaborations","value":"50+"},{"label":"Listeners Monthly","value":"2M+"}],"socials":{"instagram":"https://instagram.com/rjmursal","youtube":"https://youtube.com/@rjmursal","spotify":"https://open.spotify.com/show/rjmursal","linkedin":"https://linkedin.com/in/rjmursal"},"profile_image":""}'),
('terms', '{"content":"# Terms & Conditions\n\n## Services Terms\nAll services booked through RJMursal are subject to availability and confirmation. Payment terms will be discussed prior to engagement.\n\n## Podcast Feature Terms\nFeature selection is at the sole discretion of RJMursal. Submission does not guarantee inclusion.\n\n## Sponsorship Terms\nSponsorship packages are customized based on campaign goals and audience fit. All deliverables will be agreed upon in writing.\n\n## General Disclaimer\nContent shared on the podcast represents personal views of guests and does not reflect official endorsement.\n\n## Contact for Queries\nReach out via the contact form for any clarifications regarding these terms."}'),
('settings', '{"site_title":"RJMursal — Voice of the Masses","tagline":"Studio M | Podcast Host | Storyteller","contact_email":"mursalaltaf17@gmail.com","contact_location":"Srinagar Kashmir"}')
ON CONFLICT (key) DO NOTHING;

-- Seed sample jobs
INSERT INTO public.job_listings (title, job_type, location, description, is_active) VALUES
('Podcast Producer', 'Full-time', 'Mumbai (On-site)', 'Lead end-to-end production of weekly podcast episodes. Edit audio, coordinate guests, manage release schedule.', true),
('Social Media Manager', 'Full-time', 'Remote', 'Run Instagram, YouTube Shorts, and Twitter for the RJMursal brand. Plan reels, write captions, track analytics.', true),
('Video Editor', 'Freelance', 'Remote', 'Cut podcast episodes into long-form YouTube videos and short-form reels. Color grade and add motion graphics.', true);
