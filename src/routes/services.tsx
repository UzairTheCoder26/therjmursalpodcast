import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Radio, Camera, TrendingUp, Film, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const services = [
  {
    Icon: Radio,
    key: "Podcast Promotion",
    title: "Podcast Promotions",
    desc: "Sponsored mentions, brand integrations and podcast collaborations tailored to your brand.",
  },
  {
    Icon: Camera,
    key: "Brand Ads Shoot",
    title: "Brand Ads Shoot",
    desc: "Photography and video shoots that make your brand cinematic.",
  },
  {
    Icon: TrendingUp,
    key: "Digital Marketing",
    title: "Digital Marketing",
    desc: "Social media strategy, content calendars and performance campaigns.",
  },
  {
    Icon: Film,
    key: "Brand Shoot",
    title: "Brand Shoots & Reels",
    desc: "Identity films, reels and promotional content built for the algorithm.",
  },
];

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Podcast Promotions, Brand Shoots & Digital | RJMursal" },
      { name: "description", content: "Book podcast promotions, brand shoots, digital marketing and reels with RJ Mursal." },
      { property: "og:title", content: "RJMursal Services" },
      { property: "og:description", content: "Premium voice, video and digital services for brands." },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="py-20">
      <section className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.4em] text-gold mb-3">Services</p>
          <h1 className="font-display text-6xl sm:text-8xl">
            WHAT WE <span className="text-gold-gradient">DELIVER</span>
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Pick what you need. Or pick everything. We move fast.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {services.map(({ Icon, key, title, desc }) => (
            <div
              key={key}
              className="group relative rounded-3xl border border-border bg-card p-8 overflow-hidden hover:border-gold/60 hover:shadow-gold hover:-translate-y-1 transition-all duration-300"
            >
              <div className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-gold/5 group-hover:bg-gold/15 blur-2xl transition-all" />
              <div className="relative">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-gold/20 to-neon-red/20 border border-gold/30 flex items-center justify-center mb-6 group-hover:from-gold group-hover:to-gold-glow transition-all">
                  <Icon className="h-6 w-6 text-gold group-hover:text-ink transition-colors" strokeWidth={2} />
                </div>
                <h3 className="font-display text-3xl tracking-wider mb-3">{title}</h3>
                <p className="text-muted-foreground mb-6">{desc}</p>
                <button
                  onClick={() => setOpen(key)}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold to-gold-glow px-6 py-3 text-sm font-bold uppercase tracking-widest text-ink hover:shadow-gold transition-all"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {open && <BookingModal serviceType={open} onClose={() => setOpen(null)} />}
    </div>
  );
}

function BookingModal({ serviceType, onClose }: { serviceType: string; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    company: "",
    email: "",
    phone: "",
    service_type: serviceType,
    message: "",
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name.trim() || !form.email.trim() || !form.phone.trim()) {
      toast.error("Please fill in name, email and phone.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("service_bookings").insert(form);
    setLoading(false);
    if (error) {
      toast.error("Could not submit. Please try again.");
    } else {
      toast.success("Got it! We'll be in touch within 24 hours.");
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-ink/85 backdrop-blur-md flex items-end sm:items-center justify-center p-4 animate-fade-up"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-3xl bg-card border border-gold/30 p-6 sm:p-8 shadow-gold max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Booking Inquiry</p>
        <h3 className="font-display text-3xl mt-1 mb-6">{serviceType}</h3>
        <form onSubmit={submit} className="space-y-3">
          <Input label="Full Name *" value={form.full_name} onChange={(v) => setForm({ ...form, full_name: v })} />
          <Input label="Company / Brand" value={form.company} onChange={(v) => setForm({ ...form, company: v })} />
          <div className="grid sm:grid-cols-2 gap-3">
            <Input label="Email *" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
            <Input label="Phone *" type="tel" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5">Service Type</label>
            <select
              value={form.service_type}
              onChange={(e) => setForm({ ...form, service_type: e.target.value })}
              className="w-full rounded-xl bg-input border border-border px-4 py-3 text-foreground focus:border-gold focus:outline-none"
            >
              {services.map((s) => (
                <option key={s.key} value={s.key}>{s.key}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5">Message / Requirements</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={4}
              className="w-full rounded-xl bg-input border border-border px-4 py-3 text-foreground focus:border-gold focus:outline-none resize-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-full border border-border py-3 text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              className="flex-1 rounded-full bg-gradient-to-r from-gold to-gold-glow py-3 text-sm font-bold uppercase tracking-widest text-ink hover:shadow-gold disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Submit
            </button>
          </div>
        </form>
      </div>
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
