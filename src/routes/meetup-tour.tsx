import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2, MapPin, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useMeetupTourContent } from "@/hooks/useMeetupTourContent";
import { isValidWhatsapp, normalizeWhatsapp } from "@/lib/meetupTour";
import { SoundWave } from "@/components/SoundWave";

export const Route = createFileRoute("/meetup-tour")({
  head: () => ({
    meta: [
      { title: "Kashmir Meet-Up Tour 2026 — Register | RJMursal" },
      {
        name: "description",
        content:
          "Join the Kashmir Meet-Up Tour 2026. Register from any district and get notified when RJ Mursal visits your area.",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Kashmir Meet-Up Tour 2026 | RJMursal" },
      {
        property: "og:description",
        content:
          "One Valley. One Journey. One Community. Register for the Kashmir Meet-Up Tour 2026.",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Kashmir Meet-Up Tour 2026 | RJMursal" },
      {
        name: "twitter:description",
        content:
          "Register for the Kashmir Meet-Up Tour 2026 and get notified when RJ Mursal visits your district.",
      },
    ],
    links: [{ rel: "canonical", href: "https://rjmursal.com/meetup-tour" }],
  }),
  component: MeetupTourPage,
});

function MeetupTourPage() {
  const { content, loading: contentLoading } = useMeetupTourContent();
  const formRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState({ name: "", location: "", whatsapp: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (contentLoading) return;
    document.title = content.seo_title;

    const setMeta = (attr: "name" | "property", key: string, value: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", value);
    };

    setMeta("name", "description", content.seo_description);
    setMeta("property", "og:title", content.seo_title);
    setMeta("property", "og:description", content.seo_description);
    setMeta("name", "twitter:title", content.seo_title);
    setMeta("name", "twitter:description", content.seo_description);

    const canonical =
      document.querySelector('link[rel="canonical"]') ||
      (() => {
        const link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
        return link;
      })();
    canonical.setAttribute("href", `${window.location.origin}/meetup-tour`);

    const scriptId = "meetup-tour-jsonld";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Event",
      name: content.hero_title,
      description: content.seo_description,
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: content.registration_open
        ? "https://schema.org/EventScheduled"
        : "https://schema.org/EventCancelled",
      location: {
        "@type": "Place",
        name: "Kashmir Valley",
        address: {
          "@type": "PostalAddress",
          addressRegion: "Jammu and Kashmir",
          addressCountry: "IN",
        },
      },
      organizer: {
        "@type": "Person",
        name: "RJ Mursal",
        url: window.location.origin,
      },
    });
  }, [content, contentLoading]);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.registration_open) return;

    const name = form.name.trim();
    const location = form.location.trim();
    const whatsappRaw = form.whatsapp.trim();

    if (!name || !location || !whatsappRaw) {
      toast.error("Please fill all fields.");
      return;
    }
    if (!isValidWhatsapp(whatsappRaw)) {
      toast.error("Enter a valid WhatsApp number (10-digit Indian mobile).");
      return;
    }

    const whatsapp = normalizeWhatsapp(whatsappRaw);
    setSubmitting(true);

    const { error } = await supabase.from("meetup_tour_registrations").insert({
      name,
      location,
      whatsapp,
    });

    setSubmitting(false);

    if (error) {
      if (error.code === "23505") {
        toast.error("This WhatsApp number is already registered.");
      } else {
        toast.error("Could not register. Please try again.");
      }
      return;
    }

    setSuccess(true);
    setForm({ name: "", location: "", whatsapp: "" });
    toast.success(content.success_message);
  };

  return (
    <div className="py-16 sm:py-20">
      {/* Hero */}
      <section className="relative max-w-7xl mx-auto px-5 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.12] pointer-events-none">
          <SoundWave count={80} />
        </div>
        <div className="absolute top-0 left-1/4 h-72 w-72 rounded-full bg-gold/20 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-neon-red/15 blur-[100px] pointer-events-none" />

        <div className="relative rounded-[2rem] border border-gold/25 bg-card/40 backdrop-blur-xl p-8 sm:p-12 lg:p-14 shadow-[0_0_80px_rgba(255,215,0,0.08)]">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs uppercase tracking-[0.35em] text-gold mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            Kashmir Valley Tour
          </div>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight max-w-4xl text-gold-gradient">
            {content.hero_title}
          </h1>

          <p className="mt-4 font-display text-xl sm:text-2xl tracking-wider text-gold/90">
            {content.hero_subtitle}
          </p>

          <p className="mt-6 text-muted-foreground text-base sm:text-lg max-w-2xl leading-relaxed">
            {content.description}
          </p>

          <button
            type="button"
            onClick={scrollToForm}
            className="mt-8 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-gold to-gold-glow px-8 py-3.5 text-sm font-bold uppercase tracking-widest text-ink hover:shadow-gold transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {content.button_text}
          </button>
        </div>
      </section>

      {/* Districts */}
      <section className="max-w-7xl mx-auto px-5 lg:px-8 mt-14 sm:mt-16">
        <div className="flex items-center gap-2 mb-6">
          <MapPin className="h-5 w-5 text-gold" />
          <h2 className="font-display text-2xl sm:text-3xl tracking-wider">
            DISTRICTS I&apos;LL VISIT
          </h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {content.districts.map((district) => (
            <span
              key={district}
              className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-sm px-5 py-2.5 text-sm font-medium text-foreground/90 hover:border-gold/50 hover:bg-gold/5 hover:shadow-gold transition-all duration-300"
            >
              {district}
            </span>
          ))}
        </div>
      </section>

      {/* Registration */}
      <section ref={formRef} className="max-w-xl mx-auto px-5 lg:px-8 mt-14 sm:mt-16 scroll-mt-24">
        <div className="rounded-3xl border border-gold/30 bg-card/50 backdrop-blur-xl p-6 sm:p-8 shadow-[0_0_40px_rgba(0,0,0,0.25)]">
          <h2 className="font-display text-3xl tracking-wider mb-2">REGISTER</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Fill in your details — we&apos;ll reach out on WhatsApp when the tour hits your area.
          </p>

          {success ? (
            <div className="flex flex-col items-center text-center py-8 animate-fade-up">
              <div className="relative mb-4">
                <div className="absolute inset-0 rounded-full bg-gold/30 blur-xl animate-pulse" />
                <CheckCircle2 className="relative h-16 w-16 text-gold" strokeWidth={1.5} />
              </div>
              <p className="font-display text-2xl tracking-wider text-gold mb-2">YOU&apos;RE IN!</p>
              <p className="text-muted-foreground max-w-sm">{content.success_message}</p>
              <button
                type="button"
                onClick={() => setSuccess(false)}
                className="mt-6 text-xs uppercase tracking-widest text-gold hover:underline"
              >
                Register another person
              </button>
            </div>
          ) : !content.registration_open ? (
            <div className="rounded-2xl border border-border bg-ink-2/80 px-6 py-10 text-center">
              <p className="font-display text-xl tracking-wider text-muted-foreground">
                {content.closed_message}
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <Field
                label="Full Name"
                value={form.name}
                onChange={(v) => setForm({ ...form, name: v })}
                autoComplete="name"
                required
              />
              <Field
                label="Where are you from?"
                value={form.location}
                onChange={(v) => setForm({ ...form, location: v })}
                placeholder="District, town, or area"
                required
              />
              <Field
                label="WhatsApp Number"
                value={form.whatsapp}
                onChange={(v) => setForm({ ...form, whatsapp: v })}
                type="tel"
                placeholder="10-digit mobile or +91…"
                autoComplete="tel"
                required
              />

              <button
                type="submit"
                disabled={submitting || contentLoading}
                className="w-full mt-2 rounded-full bg-gradient-to-r from-gold to-gold-glow py-3.5 text-sm font-bold uppercase tracking-widest text-ink hover:shadow-gold disabled:opacity-60 flex items-center justify-center gap-2 transition-all"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Register
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  autoComplete,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
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
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className="w-full rounded-xl bg-input/80 border border-border px-4 py-3 text-foreground focus:border-gold focus:outline-none transition-colors backdrop-blur-sm"
      />
    </div>
  );
}
