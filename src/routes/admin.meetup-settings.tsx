import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { defaultMeetupTourContent, type MeetupTourContent } from "@/lib/meetupTour";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/admin/meetup-settings")({
  component: AdminMeetupSettingsPage,
});

function AdminMeetupSettingsPage() {
  const [content, setContent] = useState<MeetupTourContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [newDistrict, setNewDistrict] = useState("");

  useEffect(() => {
    supabase
      .from("site_content")
      .select("value")
      .eq("key", "meetup_tour")
      .maybeSingle()
      .then(({ data }) => {
        if (data?.value) {
          setContent({ ...defaultMeetupTourContent, ...(data.value as MeetupTourContent) });
        } else {
          setContent(defaultMeetupTourContent);
        }
      });
  }, []);

  const save = async () => {
    if (!content) return;
    setSaving(true);
    const updated_at = new Date().toISOString();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await supabase
      .from("site_content")
      .upsert({ key: "meetup_tour", value: content as any, updated_at }, { onConflict: "key" });
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Meet-up page settings saved");
  };

  const addDistrict = () => {
    const d = newDistrict.trim();
    if (!d || !content) return;
    if (content.districts.includes(d)) {
      toast.error("District already listed");
      return;
    }
    setContent({ ...content, districts: [...content.districts, d] });
    setNewDistrict("");
  };

  const removeDistrict = (district: string) => {
    if (!content) return;
    setContent({ ...content, districts: content.districts.filter((d) => d !== district) });
  };

  if (!content) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="h-6 w-6 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="font-display text-3xl tracking-wider mb-2">MEET-UP TOUR SETTINGS</h1>
        <p className="text-sm text-muted-foreground">
          Control the Kashmir Meet-Up Tour page content without touching code.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
        <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-ink-2/50 px-4 py-3">
          <div>
            <p className="text-sm font-medium">Registration Open</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              When off, visitors see the closed message instead of the form.
            </p>
          </div>
          <Switch
            checked={content.registration_open}
            onCheckedChange={(v) => setContent({ ...content, registration_open: v })}
          />
        </div>

        <Field label="Hero Title" value={content.hero_title} onChange={(v) => setContent({ ...content, hero_title: v })} />
        <Field label="Hero Subtitle" value={content.hero_subtitle} onChange={(v) => setContent({ ...content, hero_subtitle: v })} />
        <Field label="Description" value={content.description} onChange={(v) => setContent({ ...content, description: v })} multiline />
        <Field label="CTA Button Text" value={content.button_text} onChange={(v) => setContent({ ...content, button_text: v })} />
        <Field label="Success Message" value={content.success_message} onChange={(v) => setContent({ ...content, success_message: v })} multiline />
        <Field label="Closed Message" value={content.closed_message} onChange={(v) => setContent({ ...content, closed_message: v })} />

        <div>
          <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">
            District List
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {content.districts.map((d) => (
              <span
                key={d}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-ink-2 px-3 py-1 text-sm"
              >
                {d}
                <button
                  type="button"
                  onClick={() => removeDistrict(d)}
                  className="text-muted-foreground hover:text-neon-red"
                  aria-label={`Remove ${d}`}
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={newDistrict}
              onChange={(e) => setNewDistrict(e.target.value)}
              placeholder="Add district…"
              className="flex-1 rounded-lg bg-input border border-border px-3 py-2 text-sm focus:border-gold focus:outline-none"
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addDistrict())}
            />
            <button
              type="button"
              onClick={addDistrict}
              className="rounded-lg border border-gold/40 px-3 py-2 text-gold hover:bg-gold/10"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="border-t border-border pt-6 space-y-4">
          <p className="text-xs uppercase tracking-widest text-gold">SEO</p>
          <Field label="SEO Title" value={content.seo_title} onChange={(v) => setContent({ ...content, seo_title: v })} />
          <Field label="SEO Description" value={content.seo_description} onChange={(v) => setContent({ ...content, seo_description: v })} multiline />
        </div>

        <button
          onClick={save}
          disabled={saving}
          className="rounded-full bg-gradient-to-r from-gold to-gold-glow px-8 py-3 text-sm font-bold uppercase tracking-widest text-ink hover:shadow-gold disabled:opacity-60 inline-flex items-center gap-2"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          Save Settings
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full rounded-lg bg-input border border-border px-3 py-2 text-sm resize-none focus:border-gold focus:outline-none"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg bg-input border border-border px-3 py-2 text-sm focus:border-gold focus:outline-none"
        />
      )}
    </div>
  );
}
