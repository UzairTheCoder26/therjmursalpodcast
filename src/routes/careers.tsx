import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Briefcase, MapPin, Loader2, X } from "lucide-react";
import { toast } from "sonner";

interface Job {
  id: string;
  title: string;
  job_type: string;
  location: string;
  description: string;
}

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers — Work With The RJMursal Podcast" },
      { name: "description", content: "Open roles at the RJMursal Podcast. Join the team building bold conversations." },
      { property: "og:title", content: "Careers at RJMursal" },
      { property: "og:description", content: "Build the future of audio with us." },
    ],
  }),
  component: CareersPage,
});

function CareersPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [open, setOpen] = useState<Job | null>(null);

  useEffect(() => {
    supabase
      .from("job_listings")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => setJobs(data || []));
  }, []);

  return (
    <div className="py-20">
      <section className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-xs uppercase tracking-[0.4em] text-gold mb-3">Careers</p>
          <h1 className="font-display text-5xl sm:text-7xl">
            WORK WITH THE <span className="text-gold-gradient">RJMURSAL</span> PODCAST
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            We're a small, sharp team obsessed with making audio that travels.
            If you ship work you're proud of, we want to talk.
          </p>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-20 rounded-3xl border border-border bg-card">
            <p className="font-display text-3xl text-muted-foreground">NO OPENINGS RIGHT NOW</p>
            <p className="text-sm text-muted-foreground mt-2">Check back soon — we hire often.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="group rounded-2xl border border-border bg-card p-6 hover:border-gold/60 hover:-translate-y-1 hover:shadow-gold transition-all flex flex-col"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center gap-1 rounded-full bg-gold/10 border border-gold/30 px-3 py-1 text-xs uppercase tracking-widest text-gold">
                    <Briefcase className="h-3 w-3" />
                    {job.job_type}
                  </span>
                </div>
                <h3 className="font-display text-2xl tracking-wider mb-2">{job.title}</h3>
                <p className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                  <MapPin className="h-3 w-3" />
                  {job.location}
                </p>
                <p className="text-sm text-muted-foreground mb-6 flex-1">{job.description}</p>
                <button
                  onClick={() => setOpen(job)}
                  className="rounded-full bg-gradient-to-r from-gold to-gold-glow py-2.5 text-sm font-bold uppercase tracking-widest text-ink hover:shadow-gold transition-all"
                >
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {open && <ApplyModal job={open} onClose={() => setOpen(null)} />}
    </div>
  );
}

function ApplyModal({ job, onClose }: { job: Job; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [resume, setResume] = useState<File | null>(null);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    portfolio_link: "",
    reason: "",
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.phone || !form.reason) {
      toast.error("Please fill all required fields.");
      return;
    }
    if (!resume) {
      toast.error("Please attach your resume (PDF).");
      return;
    }
    if (resume.type !== "application/pdf") {
      toast.error("Resume must be a PDF.");
      return;
    }

    setLoading(true);
    const filePath = `${Date.now()}-${resume.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const { error: upErr } = await supabase.storage
      .from("resumes")
      .upload(filePath, resume, { contentType: "application/pdf" });

    if (upErr) {
      setLoading(false);
      toast.error("Resume upload failed. Try again.");
      return;
    }

    const { error } = await supabase.from("career_applications").insert({
      ...form,
      position: job.title,
      resume_path: filePath,
    });

    setLoading(false);
    if (error) {
      toast.error("Submission failed. Try again.");
    } else {
      toast.success("Application sent! We review every one.");
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-ink/85 backdrop-blur-md flex items-end sm:items-center justify-center p-4 animate-fade-up"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-3xl bg-card border border-gold/30 p-6 sm:p-8 shadow-gold max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground">
          <X className="h-5 w-5" />
        </button>
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Application</p>
        <h3 className="font-display text-3xl mt-1 mb-1">{job.title}</h3>
        <p className="text-xs text-muted-foreground mb-6">{job.job_type} · {job.location}</p>

        <form onSubmit={submit} className="space-y-3">
          <Input label="Full Name *" value={form.full_name} onChange={(v) => setForm({ ...form, full_name: v })} />
          <div className="grid sm:grid-cols-2 gap-3">
            <Input label="Email *" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
            <Input label="Phone *" type="tel" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
          </div>
          <Input label="Portfolio / LinkedIn URL" value={form.portfolio_link} onChange={(v) => setForm({ ...form, portfolio_link: v })} />
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5">Why join us? *</label>
            <textarea
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              rows={4}
              className="w-full rounded-xl bg-input border border-border px-4 py-3 text-foreground focus:border-gold focus:outline-none resize-none"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5">Resume (PDF) *</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setResume(e.target.files?.[0] || null)}
              className="w-full text-sm text-muted-foreground file:mr-3 file:rounded-full file:border-0 file:bg-gold file:px-4 file:py-2 file:text-xs file:font-bold file:uppercase file:tracking-widest file:text-ink hover:file:bg-gold-glow"
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
