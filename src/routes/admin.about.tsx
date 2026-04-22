import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Upload } from "lucide-react";

interface AboutData {
  title: string;
  bio: string;
  stats: { label: string; value: string }[];
  socials: { instagram?: string; youtube?: string; spotify?: string; linkedin?: string };
  profile_image?: string;
}

export const Route = createFileRoute("/admin/about")({
  component: EditAbout,
});

function EditAbout() {
  const [data, setData] = useState<AboutData | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    supabase.from("site_content").select("value").eq("key", "about").maybeSingle()
      .then(({ data }) => { if (data) setData(data.value as unknown as AboutData); });
  }, []);

  if (!data) return <div className="flex justify-center p-12"><Loader2 className="h-6 w-6 animate-spin text-gold"/></div>;

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("site_content").update({ value: data as unknown as Record<string, unknown>, updated_at: new Date().toISOString() }).eq("key", "about");
    setSaving(false);
    if (error) toast.error(error.message); else toast.success("Saved!");
  };

  const onUpload = async (file: File) => {
    setUploading(true);
    const path = `profile-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const { error } = await supabase.storage.from("profile").upload(path, file, { upsert: true });
    if (error) { setUploading(false); toast.error(error.message); return; }
    const { data: pub } = supabase.storage.from("profile").getPublicUrl(path);
    setData({ ...data, profile_image: pub.publicUrl });
    setUploading(false);
    toast.success("Image uploaded — click Save to apply.");
  };

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl tracking-wider mb-6">EDIT ABOUT</h1>

      <div className="space-y-5">
        <div>
          <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5">Profile Image</label>
          {data.profile_image && <img src={data.profile_image} alt="" className="h-32 w-32 object-cover rounded-xl mb-3 border border-border" />}
          <label className="inline-flex items-center gap-2 cursor-pointer rounded-lg border border-border px-4 py-2 text-xs uppercase tracking-widest hover:border-gold hover:text-gold">
            {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin"/> : <Upload className="h-3.5 w-3.5"/>} Upload New
            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])} />
          </label>
        </div>

        <Field label="Title" value={data.title} onChange={(v) => setData({ ...data, title: v })} />
        <Field label="Bio" value={data.bio} onChange={(v) => setData({ ...data, bio: v })} multiline />

        <div>
          <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5">Stats</label>
          <div className="space-y-2">
            {data.stats.map((s, i) => (
              <div key={i} className="flex gap-2">
                <input value={s.value} onChange={(e) => { const stats = [...data.stats]; stats[i] = { ...stats[i], value: e.target.value }; setData({ ...data, stats }); }} className="w-32 rounded-lg bg-input border border-border px-3 py-2 text-sm" placeholder="5+" />
                <input value={s.label} onChange={(e) => { const stats = [...data.stats]; stats[i] = { ...stats[i], label: e.target.value }; setData({ ...data, stats }); }} className="flex-1 rounded-lg bg-input border border-border px-3 py-2 text-sm" placeholder="Years"/>
                <button onClick={() => setData({ ...data, stats: data.stats.filter((_, j) => j !== i) })} className="px-3 rounded-lg border border-border hover:text-neon-red"><Trash2 className="h-4 w-4"/></button>
              </div>
            ))}
            <button onClick={() => setData({ ...data, stats: [...data.stats, { label: "New", value: "0" }] })} className="text-xs text-gold inline-flex items-center gap-1"><Plus className="h-3 w-3"/>Add stat</button>
          </div>
        </div>

        <Field label="Instagram URL" value={data.socials.instagram || ""} onChange={(v) => setData({ ...data, socials: { ...data.socials, instagram: v } })} />
        <Field label="YouTube URL" value={data.socials.youtube || ""} onChange={(v) => setData({ ...data, socials: { ...data.socials, youtube: v } })} />
        <Field label="Spotify URL" value={data.socials.spotify || ""} onChange={(v) => setData({ ...data, socials: { ...data.socials, spotify: v } })} />
        <Field label="LinkedIn URL" value={data.socials.linkedin || ""} onChange={(v) => setData({ ...data, socials: { ...data.socials, linkedin: v } })} />

        <button onClick={save} disabled={saving} className="rounded-full bg-gradient-to-r from-gold to-gold-glow px-8 py-3 text-sm font-bold uppercase tracking-widest text-ink hover:shadow-gold disabled:opacity-60 inline-flex items-center gap-2">
          {saving && <Loader2 className="h-4 w-4 animate-spin"/>} Save Changes
        </button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, multiline }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5">{label}</label>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={6} className="w-full rounded-lg bg-input border border-border px-3 py-2 text-sm resize-none focus:border-gold focus:outline-none"/>
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg bg-input border border-border px-3 py-2 text-sm focus:border-gold focus:outline-none"/>
      )}
    </div>
  );
}
