import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Settings { site_title: string; tagline: string; contact_email: string }

export const Route = createFileRoute("/admin/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const [s, setS] = useState<Settings | null>(null);
  const [pwd, setPwd] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("site_content").select("value").eq("key", "settings").maybeSingle()
      .then(({ data }) => { if (data) setS(data.value as unknown as Settings); });
  }, []);

  if (!s) return <div className="flex justify-center p-12"><Loader2 className="h-6 w-6 animate-spin text-gold"/></div>;

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("site_content").update({ value: s as unknown as Record<string, unknown>, updated_at: new Date().toISOString() }).eq("key", "settings");
    setSaving(false);
    if (error) toast.error(error.message); else toast.success("Saved");
  };

  const changePassword = async () => {
    if (pwd.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    const { error } = await supabase.auth.updateUser({ password: pwd });
    if (error) toast.error(error.message); else { toast.success("Password updated"); setPwd(""); }
  };

  return (
    <div className="max-w-2xl space-y-10">
      <div>
        <h1 className="font-display text-3xl tracking-wider mb-6">SITE SETTINGS</h1>
        <div className="space-y-4">
          <Field label="Site Title" value={s.site_title} onChange={(v) => setS({ ...s, site_title: v })}/>
          <Field label="Tagline" value={s.tagline} onChange={(v) => setS({ ...s, tagline: v })}/>
          <Field label="Contact Email" value={s.contact_email} onChange={(v) => setS({ ...s, contact_email: v })}/>
          <button onClick={save} disabled={saving} className="rounded-full bg-gradient-to-r from-gold to-gold-glow px-8 py-3 text-sm font-bold uppercase tracking-widest text-ink hover:shadow-gold disabled:opacity-60 inline-flex items-center gap-2">
            {saving && <Loader2 className="h-4 w-4 animate-spin"/>} Save Settings
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-neon-red/30 bg-card p-6">
        <h2 className="font-display text-2xl tracking-wider mb-4">CHANGE PASSWORD</h2>
        <input type="password" placeholder="New password" value={pwd} onChange={(e) => setPwd(e.target.value)} className="w-full rounded-lg bg-input border border-border px-3 py-2 text-sm mb-3"/>
        <button onClick={changePassword} className="rounded-full border-2 border-neon-red px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-neon-red/10">
          Update Password
        </button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg bg-input border border-border px-3 py-2 text-sm focus:border-gold focus:outline-none"/>
    </div>
  );
}
