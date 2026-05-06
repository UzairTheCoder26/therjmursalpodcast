import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type TeamMember = {
  id: string;
  full_name: string;
  role: string;
  instagram_handle: string;
  contact_button_label: string;
  photo_path: string;
  featured: boolean;
  sort_order: number;
};

export function useTeamMembers() {
  const [members, setMembers] = useState<TeamMember[] | null>(null);

  useEffect(() => {
    let mounted = true;

    supabase
      .from("team_members")
      .select("id, full_name, role, instagram_handle, contact_button_label, photo_path, featured, sort_order")
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        if (!mounted) return;
        setMembers((data as unknown as TeamMember[]) || []);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return members;
}

export function useFeaturedTeamMembers(limit = 3) {
  const [members, setMembers] = useState<TeamMember[] | null>(null);

  useEffect(() => {
    let mounted = true;

    supabase
      .from("team_members")
      .select("id, full_name, role, instagram_handle, contact_button_label, photo_path, featured, sort_order")
      .eq("featured", true)
      .order("sort_order", { ascending: true })
      .limit(limit)
      .then(({ data }) => {
        if (!mounted) return;
        setMembers((data as unknown as TeamMember[]) || []);
      });

    return () => {
      mounted = false;
    };
  }, [limit]);

  return members;
}

