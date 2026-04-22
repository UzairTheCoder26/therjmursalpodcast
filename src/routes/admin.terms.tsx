import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin/terms")({
  component: EditTerms,
});

function EditTerms() {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("site_content").select("value").eq("key", "terms").maybeSingle()
      .then(({ data }) => {
        if (data) setContent((data.value as { content: string }).content);
        setLoading(false);
      });
  }, []);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("site_content").update({ value: { content }, updated_at: new Date().toISOString() }).eq("key", "terms");
    setSaving(false);
    if (error) toast.error(error.message); else toast.success("Saved!");
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="h-6 w-6 animate-spin text-gold"/></div>;

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-3xl tracking-wider mb-2">EDIT TERMS &amp; CONDITIONS</h1>
      <p className="text-sm text-muted-foreground mb-6">Use Markdown: <code className="text-gold"># Heading</code>, <code className="text-gold">## Subheading</code>, blank line for paragraphs.</p>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={24}
        className="w-full rounded-2xl bg-input border border-border px-4 py-3 text-sm font-mono focus:border-gold focus:outline-none"
      />
      <button onClick={save} disabled={saving} className="mt-4 rounded-full bg-gradient-to-r from-gold to-gold-glow px-8 py-3 text-sm font-bold uppercase tracking-widest text-ink hover:shadow-gold disabled:opacity-60 inline-flex items-center gap-2">
        {saving && <Loader2 className="h-4 w-4 animate-spin"/>} Save
      </button>
    </div>
  );
}
