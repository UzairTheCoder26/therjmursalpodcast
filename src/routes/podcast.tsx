import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mic, Megaphone, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SoundWave } from "@/components/SoundWave";

export const Route = createFileRoute("/podcast")({
  head: () => ({
    meta: [
      { title: "The RJMursal Podcast — Get Featured or Sponsor" },
      { name: "description", content: "Be a guest on the RJMursal Podcast or sponsor episodes that reach millions." },
      { property: "og:title", content: "The RJMursal Podcast" },
      { property: "og:description", content: "Get featured. Get heard. Get partnered." },
    ],
  }),
  component: PodcastPage,
});

function PodcastPage() {
  return (
    <div className="py-20">
      <section className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-xs uppercase tracking-[0.4em] text-gold mb-3">The Podcast</p>
          <h1 className="font-display text-6xl sm:text-8xl">
            BE PART OF THE <span className="text-gold-gradient">CONVO</span>
          </h1>
        </div>

        <div className="relative h-32 mb-14 opacity-40">
          <SoundWave count={80} />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <FeatureCard />
          <SponsorCard />
        </div>
      </section>
    </div>
  );
}

function FeatureCard() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    profession: "",
    email: "",
    phone: "",
    reason: "",
    social_handle: "",
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.phone || !form.profession || !form.reason) {
      toast.error("Please fill all required fields.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("podcast_features").insert(form);
    setLoading(false);
    if (error) {
      toast.error("Could not submit. Please try again.");
    } else {
      toast.success("Submitted! We review every pitch personally.");
      setForm({ full_name: "", profession: "", email: "", phone: "", reason: "", social_handle: "" });
    }
  };

  return (
    <div className="rounded-3xl border border-gold/30 bg-card p-8 hover:shadow-gold transition-all">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-gold to-gold-glow flex items-center justify-center">
          <Mic className="h-5 w-5 text-ink" />
        </div>
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Get Featured</p>
      </div>
      <h2 className="font-display text-4xl mb-3">BE OUR NEXT GUEST</h2>
      <p className="text-muted-foreground mb-6">
        Founders, artists, athletes, dreamers — pitch your story. We host bold,
        honest conversations that travel.
      </p>

      <form onSubmit={submit} className="space-y-3">
        <Input label="Full Name *" value={form.full_name} onChange={(v) => setForm({ ...form, full_name: v })} />
        <Input label="Profession / What You Do *" value={form.profession} onChange={(v) => setForm({ ...form, profession: v })} />
        <div className="grid sm:grid-cols-2 gap-3">
          <Input label="Email *" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
          <Input label="Phone *" type="tel" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
        </div>
        <Input label="Social Handle (optional)" value={form.social_handle} onChange={(v) => setForm({ ...form, social_handle: v })} />
        <Textarea label="Why do you want to be featured? *" value={form.reason} onChange={(v) => setForm({ ...form, reason: v })} />
        <button
          disabled={loading}
          className="w-full rounded-full bg-gradient-to-r from-gold to-gold-glow py-3 text-sm font-bold uppercase tracking-widest text-ink hover:shadow-gold disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Pitch Me
        </button>
      </form>
    </div>
  );
}

function SponsorCard() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    company: "",
    email: "",
    phone: "",
    budget_range: "Under ₹10K",
    message: "",
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name || !form.company || !form.email || !form.phone) {
      toast.error("Please fill all required fields.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("sponsorships").insert(form);
    setLoading(false);
    if (error) {
      toast.error("Could not submit. Please try again.");
    } else {
      toast.success("Thanks! We'll reach out with a media kit.");
      setForm({ full_name: "", company: "", email: "", phone: "", budget_range: "Under ₹10K", message: "" });
    }
  };

  return (
    <div className="rounded-3xl border border-neon-red/40 bg-card p-8 hover:shadow-red transition-all">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-neon-red to-neon-red-glow flex items-center justify-center">
          <Megaphone className="h-5 w-5 text-foreground" />
        </div>
        <p className="text-xs uppercase tracking-[0.3em] text-neon-red">Become A Sponsor</p>
      </div>
      <h2 className="font-display text-4xl mb-3">PUT YOUR BRAND ON THE MIC</h2>
      <p className="text-muted-foreground mb-6">
        2M+ monthly listeners. 50+ podcasts. Custom integrations from
        host-reads to full-episode title sponsorships.
      </p>

      <form onSubmit={submit} className="space-y-3">
        <Input label="Full Name *" value={form.full_name} onChange={(v) => setForm({ ...form, full_name: v })} />
        <Input label="Company / Brand *" value={form.company} onChange={(v) => setForm({ ...form, company: v })} />
        <div className="grid sm:grid-cols-2 gap-3">
          <Input label="Email *" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
          <Input label="Phone *" type="tel" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5">Sponsorship Budget</label>
          <select
            value={form.budget_range}
            onChange={(e) => setForm({ ...form, budget_range: e.target.value })}
            className="w-full rounded-xl bg-input border border-border px-4 py-3 text-foreground focus:border-gold focus:outline-none"
          >
            {["Under ₹10K", "₹10K–₹50K", "₹50K–₹1L", "₹1L+"].map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
        <Textarea label="Message" value={form.message} onChange={(v) => setForm({ ...form, message: v })} />
        <button
          disabled={loading}
          className="w-full rounded-full bg-gradient-to-r from-neon-red to-neon-red-glow py-3 text-sm font-bold uppercase tracking-widest text-foreground hover:shadow-red disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Get The Media Kit
        </button>
      </form>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl bg-input border border-border px-4 py-3 text-foreground focus:border-gold focus:outline-none transition-colors"
      />
    </div>
  );
}

function Textarea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full rounded-xl bg-input border border-border px-4 py-3 text-foreground focus:border-gold focus:outline-none resize-none"
      />
    </div>
  );
}
