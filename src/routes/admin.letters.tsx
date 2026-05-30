import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SubmissionsTable, fmtDate } from "@/components/admin/SubmissionsTable";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { WriteALetterContent } from "@/components/home/WriteALetterSection";

export const Route = createFileRoute("/admin/letters")({
  component: AdminLettersPage,
});

function AdminLettersPage() {
  const [copy, setCopy] = useState<WriteALetterContent | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase
      .from("site_content")
      .select("value")
      .eq("key", "write_a_letter")
      .maybeSingle()
      .then(({ data }) => {
        if (data?.value) setCopy(data.value as unknown as WriteALetterContent);
        else {
          setCopy({
            heading: "Write a Letter",
            subheading: "Share your story, feedback, or a message for RJ — we read every letter.",
            submit_label: "Send Letter",
          });
        }
      });
  }, []);

  const saveCopy = async () => {
    if (!copy) return;
    setSaving(true);
    const updated_at = new Date().toISOString();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await supabase
      .from("site_content")
      .upsert({ key: "write_a_letter", value: copy as any, updated_at }, { onConflict: "key" });
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Section copy saved");
  };

  return (
    <div className="space-y-10">
      <div className="max-w-2xl rounded-2xl border border-border bg-card p-6">
        <h2 className="font-display text-2xl tracking-wider mb-4">HOMEPAGE COPY</h2>
        {!copy ? (
          <div className="flex justify-center p-6">
            <Loader2 className="h-6 w-6 animate-spin text-gold" />
          </div>
        ) : (
          <div className="space-y-4">
            <Field label="Heading" value={copy.heading} onChange={(v) => setCopy({ ...copy, heading: v })} />
            <Field
              label="Subheading"
              value={copy.subheading}
              onChange={(v) => setCopy({ ...copy, subheading: v })}
              multiline
            />
            <Field
              label="Submit button label"
              value={copy.submit_label}
              onChange={(v) => setCopy({ ...copy, submit_label: v })}
            />
            <button
              onClick={saveCopy}
              disabled={saving}
              className="rounded-full bg-gradient-to-r from-gold to-gold-glow px-8 py-3 text-sm font-bold uppercase tracking-widest text-ink hover:shadow-gold disabled:opacity-60 inline-flex items-center gap-2"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save Copy
            </button>
          </div>
        )}
      </div>

      <SubmissionsTable
        table="guest_letters"
        title="GUEST LETTERS"
        description="Messages submitted from the homepage Write a Letter section."
        statusOptions={["new", "read", "replied", "archived"]}
        exportable
        columns={[
          { key: "full_name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "phone", label: "Phone" },
          { key: "message", label: "Letter" },
          { key: "created_at", label: "Date", render: (r) => fmtDate(r.created_at) },
        ]}
      />
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
