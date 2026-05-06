import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface TeamPageIntroContent {
  heading: string;
  body: string;
}

export interface HomeTeamContent {
  meet_whole_team_button_label: string;
}

export function useTeamPageIntroContent() {
  const [data, setData] = useState<TeamPageIntroContent | null>(null);

  useEffect(() => {
    let mounted = true;

    supabase
      .from("site_content")
      .select("value")
      .eq("key", "team_page_intro")
      .maybeSingle()
      .then(({ data }) => {
        if (!mounted || !data) return;
        setData(data.value as unknown as TeamPageIntroContent);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return data;
}

export function useHomeTeamContent() {
  const [data, setData] = useState<HomeTeamContent | null>(null);

  useEffect(() => {
    let mounted = true;

    supabase
      .from("site_content")
      .select("value")
      .eq("key", "home_team")
      .maybeSingle()
      .then(({ data }) => {
        if (!mounted || !data) return;
        setData(data.value as unknown as HomeTeamContent);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return data;
}

