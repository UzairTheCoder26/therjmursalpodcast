import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/parent-consent")({
  head: () => ({
    meta: [
      { title: "Parent/Guardian Consent — The RJ Mursal Podcast" },
      {
        name: "description",
        content:
          "Parent or legal guardian consent form for minor participation in The RJ Mursal Podcast.",
      },
      { property: "og:title", content: "Parent/Guardian Consent — The RJ Mursal Podcast" },
      {
        property: "og:description",
        content: "Required consent before a minor under 18 can participate in The RJ Mursal Podcast.",
      },
    ],
  }),
  component: ParentConsentPage,
});

const CONSENT_POINTS = [
  "I am the parent or legal guardian of the above-mentioned child and have the legal authority to provide this consent.",
  "I voluntarily permit my child to participate in The RJ Mursal Podcast, including interviews, discussions, audio recordings, video recordings, photographs, and related media activities.",
  "I understand that the podcast may be edited before publication and may be published on the official website, YouTube, Facebook, Instagram, Spotify, Apple Podcasts, and other current or future media platforms.",
  "I grant The RJ Mursal Podcast permission to use, edit, reproduce, publish, distribute, and promote my child's voice, image, photographs, video recordings, and statements for podcast, promotional, educational, and archival purposes.",
  "I understand that participation is voluntary and that neither I nor my child will receive any financial compensation unless otherwise agreed in writing.",
  "I confirm that the information shared during the recording will be voluntary and truthful to the best of my knowledge.",
  "I understand that once content has been published online, complete removal from all platforms may not always be possible.",
  "I understand that The RJ Mursal Podcast reserves the right to edit, postpone, or choose not to publish any recording.",
  "I confirm that my child is fit to participate and that I have disclosed any important medical, behavioural, or communication needs relevant to the recording.",
  "I have read and understood all the information provided in this consent form.",
];

function ParentConsentPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    child_full_name: "",
    child_age: "",
    child_date_of_birth: "",
    guardian_full_name: "",
    guardian_relationship: "",
    guardian_mobile: "",
    guardian_email: "",
    accept_terms: false,
    confirm_guardian_consent: false,
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const age = Number(form.child_age);
    if (
      !form.child_full_name ||
      !form.child_age ||
      !form.child_date_of_birth ||
      !form.guardian_full_name ||
      !form.guardian_relationship ||
      !form.guardian_mobile ||
      !form.guardian_email
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    if (!Number.isFinite(age) || age < 1 || age >= 18) {
      toast.error("Child age must be under 18 years.");
      return;
    }

    if (!form.accept_terms || !form.confirm_guardian_consent) {
      toast.error("Please accept both confirmation checkboxes to submit.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("minor_participation_consents").insert({
      child_full_name: form.child_full_name.trim(),
      child_age: age,
      child_date_of_birth: form.child_date_of_birth,
      guardian_full_name: form.guardian_full_name.trim(),
      guardian_relationship: form.guardian_relationship.trim(),
      guardian_mobile: form.guardian_mobile.trim(),
      guardian_email: form.guardian_email.trim(),
      accept_terms: form.accept_terms,
      confirm_guardian_consent: form.confirm_guardian_consent,
    });
    setLoading(false);

    if (error) {
      toast.error("Could not submit. Please try again.");
      return;
    }

    toast.success("Consent form submitted. Thank you for completing this process.");
    setForm({
      child_full_name: "",
      child_age: "",
      child_date_of_birth: "",
      guardian_full_name: "",
      guardian_relationship: "",
      guardian_mobile: "",
      guardian_email: "",
      accept_terms: false,
      confirm_guardian_consent: false,
    });
  };

  return (
    <div className="py-20">
      <section className="max-w-3xl mx-auto px-5 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.4em] text-gold mb-3">The RJ Mursal Podcast</p>
          <h1 className="font-display text-5xl sm:text-6xl leading-tight">
            PARENT / GUARDIAN <span className="text-gold-gradient">CONSENT</span>
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            To ensure the safety and privacy of all participants, a parent or legal guardian must
            provide consent before a minor (under 18 years of age) can participate in The RJ Mursal
            Podcast.
          </p>
        </div>

        <div className="rounded-3xl border border-gold/30 bg-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-gold to-gold-glow flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-ink" />
            </div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold">Minor Participation</p>
          </div>

          <form onSubmit={submit} className="space-y-8">
            <section>
              <h2 className="font-display text-2xl tracking-wider mb-4">CHILD&apos;S INFORMATION</h2>
              <div className="space-y-3">
                <Input
                  label="Child's Full Name *"
                  value={form.child_full_name}
                  onChange={(v) => setForm({ ...form, child_full_name: v })}
                />
                <div className="grid sm:grid-cols-2 gap-3">
                  <Input
                    label="Age *"
                    type="number"
                    value={form.child_age}
                    onChange={(v) => setForm({ ...form, child_age: v })}
                  />
                  <Input
                    label="Date of Birth *"
                    type="date"
                    value={form.child_date_of_birth}
                    onChange={(v) => setForm({ ...form, child_date_of_birth: v })}
                  />
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-display text-2xl tracking-wider mb-4">PARENT / GUARDIAN INFORMATION</h2>
              <div className="space-y-3">
                <Input
                  label="Full Name *"
                  value={form.guardian_full_name}
                  onChange={(v) => setForm({ ...form, guardian_full_name: v })}
                />
                <Input
                  label="Relationship to the Child *"
                  value={form.guardian_relationship}
                  onChange={(v) => setForm({ ...form, guardian_relationship: v })}
                />
                <div className="grid sm:grid-cols-2 gap-3">
                  <Input
                    label="Mobile Number *"
                    type="tel"
                    value={form.guardian_mobile}
                    onChange={(v) => setForm({ ...form, guardian_mobile: v })}
                  />
                  <Input
                    label="Email Address *"
                    type="email"
                    value={form.guardian_email}
                    onChange={(v) => setForm({ ...form, guardian_email: v })}
                  />
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-display text-2xl tracking-wider mb-4">CONSENT</h2>
              <p className="text-sm text-muted-foreground mb-4">By submitting this form, I confirm that:</p>
              <ol className="space-y-3 text-sm text-muted-foreground list-decimal list-inside">
                {CONSENT_POINTS.map((point) => (
                  <li key={point} className="leading-relaxed">
                    {point}
                  </li>
                ))}
              </ol>
            </section>

            <section className="space-y-4 rounded-2xl border border-border bg-ink-2/50 p-5">
              <h2 className="font-display text-xl tracking-wider">CONFIRMATION</h2>
              <label className="flex items-start gap-3 cursor-pointer">
                <Checkbox
                  checked={form.accept_terms}
                  onCheckedChange={(checked) =>
                    setForm({ ...form, accept_terms: checked === true })
                  }
                  className="mt-0.5 border-gold data-[state=checked]:bg-gold data-[state=checked]:text-ink"
                />
                <span className="text-sm text-muted-foreground leading-relaxed">
                  I accept all the terms and conditions stated above.
                </span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <Checkbox
                  checked={form.confirm_guardian_consent}
                  onCheckedChange={(checked) =>
                    setForm({ ...form, confirm_guardian_consent: checked === true })
                  }
                  className="mt-0.5 border-gold data-[state=checked]:bg-gold data-[state=checked]:text-ink"
                />
                <span className="text-sm text-muted-foreground leading-relaxed">
                  I confirm that I am the parent or legal guardian of the above-mentioned child and
                  voluntarily consent to my child&apos;s participation in The RJ Mursal Podcast.
                </span>
              </label>
            </section>

            <button
              disabled={loading}
              className="w-full rounded-full bg-gradient-to-r from-gold to-gold-glow py-3 text-sm font-bold uppercase tracking-widest text-ink hover:shadow-gold disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Submit Consent Form
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl bg-input border border-border px-4 py-3 text-foreground focus:border-gold focus:outline-none transition-colors"
      />
    </div>
  );
}
