import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface AboutContent {
  title: string;
  bio: string;
  stats: { label: string; value: string }[];
  socials: {
    instagram?: string;
    youtube?: string;
    spotify?: string;
    linkedin?: string;
  };
  profile_image?: string;
}

export interface SiteSettings {
  site_title: string;
  tagline: string;
  contact_email: string;
  contact_location?: string;
}

function normalizeAboutContent(data: AboutContent): AboutContent {
  return {
    ...data,
    stats: (data.stats || []).map((stat) => {
      if (
        (stat.label === "Podcast Episodes" || stat.label === "Episodes") &&
        stat.value === "100+"
      ) {
        return {
          label: "Podcasts",
          value: "50+",
        };
      }

      return stat;
    }),
  };
}

export function useAboutContent() {
  const [data, setData] = useState<AboutContent | null>(null);

  useEffect(() => {
    let mounted = true;

    supabase
      .from("site_content")
      .select("value")
      .eq("key", "about")
      .maybeSingle()
      .then(({ data }) => {
        if (mounted && data) {
          setData(normalizeAboutContent(data.value as unknown as AboutContent));
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  return data;
}

export function useSiteSettings() {
  const [data, setData] = useState<SiteSettings | null>(null);

  useEffect(() => {
    let mounted = true;

    supabase
      .from("site_content")
      .select("value")
      .eq("key", "settings")
      .maybeSingle()
      .then(({ data }) => {
        if (mounted && data) {
          setData(data.value as unknown as SiteSettings);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  return data;
}
