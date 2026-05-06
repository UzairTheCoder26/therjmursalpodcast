import { supabase } from "@/integrations/supabase/client";

export function publicProfileUrl(path: string) {
  const p = (path || "").trim();
  if (!p) return "";
  const { data } = supabase.storage.from("profile").getPublicUrl(p);
  return data.publicUrl || "";
}

