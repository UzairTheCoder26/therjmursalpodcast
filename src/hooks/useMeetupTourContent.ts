import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { defaultMeetupTourContent, type MeetupTourContent } from "@/lib/meetupTour";

export function useMeetupTourContent() {
  const [content, setContent] = useState<MeetupTourContent>(defaultMeetupTourContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase
      .from("site_content")
      .select("value")
      .eq("key", "meetup_tour")
      .maybeSingle()
      .then(({ data }) => {
        if (!mounted) return;
        if (data?.value) {
          setContent({ ...defaultMeetupTourContent, ...(data.value as MeetupTourContent) });
        }
        setLoading(false);
      })
      .catch(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { content, loading };
}
