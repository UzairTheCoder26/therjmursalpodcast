import { useEffect, useState } from "react";
import { Loader2, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface WriteALetterContent {
  heading: string;
  subheading: string;
  submit_label: string;
}

const defaultCopy: WriteALetterContent = {
  heading: "Write a Letter",
  subheading: "Share your story, feedback, or a message for RJ — we read every letter.",
  submit_label: "Send Letter",
};

export function WriteALetterSection() {
  const [copy, setCopy] = useState<WriteALetterContent>(defaultCopy);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    message: "",
  });

  useEffect(() => {
    let mounted = true;
    supabase
      .from("site_content")
      .select("value")
      .eq("key", "write_a_letter")
      .maybeSingle()
      .then(({ data }) => {
        if (mounted && data?.value) {
          setCopy({ ...defaultCopy, ...(data.value as unknown as WriteALetterContent) });
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in your name, email, and message.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("guest_letters").insert({
      full_name: form.full_name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      message: form.message.trim(),
    });
    setLoading(false);
    if (error) {
      toast.error("Could not send your letter. Please try again.");
    } else {
      toast.success("Letter sent — thank you!");
      setForm({ full_name: "", email: "", phone: "", message: "" });
    }
  };

  return (
    <section className="py-24 px-5">
      <div className="max-w-3xl mx-auto rounded-3xl border border-border bg-card p-8 sm:p-12 relative overflow-hidden hover:border-gold/40 transition-colors">
        <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-gold/10 blur-3xl pointer-events-none" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-gold/30 to-neon-red/20 border border-gold/30 flex items-center justify-center">
              <Mail className="h-5 w-5 text-gold" />
            </div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold">From the audience</p>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl tracking-wider">
            {copy.heading}
          </h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            {copy.subheading}
          </p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5">
                  Your name *
                </label>
                <input
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  required
                  className="w-full rounded-xl bg-input border border-border px-4 py-3 text-sm focus:border-gold focus:outline-none"
                  placeholder="Full name"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5">
                  Email *
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full rounded-xl bg-input border border-border px-4 py-3 text-sm focus:border-gold focus:outline-none"
                  placeholder="you@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5">
                Phone (optional)
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-xl bg-input border border-border px-4 py-3 text-sm focus:border-gold focus:outline-none"
                placeholder="+91 …"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5">
                Your letter *
              </label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
                rows={6}
                className="w-full rounded-xl bg-input border border-border px-4 py-3 text-sm resize-none focus:border-gold focus:outline-none"
                placeholder="Write your message here…"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto rounded-full bg-gradient-to-r from-gold to-gold-glow px-8 py-3.5 text-sm font-bold uppercase tracking-widest text-ink hover:shadow-gold disabled:opacity-60 inline-flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {copy.submit_label}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
