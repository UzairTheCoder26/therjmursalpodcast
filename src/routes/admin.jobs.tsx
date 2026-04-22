import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Trash2, Plus } from "lucide-react";

interface Job {
  id: string;
  title: string;
  job_type: string;
  location: string;
  description: string;
  is_active: boolean;
}

export const Route = createFileRoute("/admin/jobs")({
  component: JobsAdmin,
});

function JobsAdmin() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title: "", job_type: "Full-time", location: "Remote", description: "" });

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("job_listings").select("*").order("created_at", { ascending: false });
    setJobs((data as Job[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description) { toast.error("Title and description required"); return; }
    setCreating(true);
    const { error } = await supabase.from("job_listings").insert({ ...form, is_active: true });
    setCreating(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Job created");
      setForm({ title: "", job_type: "Full-time", location: "Remote", description: "" });
      load();
    }
  };

  const toggle = async (id: string, active: boolean) => {
    await supabase.from("job_listings").update({ is_active: !active }).eq("id", id);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this job?")) return;
    await supabase.from("job_listings").delete().eq("id", id);
    load();
  };

  return (
    <div>
      <h1 className="font-display text-3xl tracking-wider mb-1">JOB LISTINGS</h1>
      <p className="text-sm text-muted-foreground mb-6">Add, edit and toggle visibility of job openings.</p>

      <form onSubmit={create} className="rounded-2xl border border-border bg-card p-6 mb-8 grid sm:grid-cols-2 gap-3">
        <input
          placeholder="Job title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="rounded-lg bg-input border border-border px-3 py-2 text-sm"
        />
        <select value={form.job_type} onChange={(e) => setForm({ ...form, job_type: e.target.value })} className="rounded-lg bg-input border border-border px-3 py-2 text-sm">
          <option>Full-time</option><option>Part-time</option><option>Freelance</option><option>Internship</option>
        </select>
        <input
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          className="rounded-lg bg-input border border-border px-3 py-2 text-sm"
        />
        <button disabled={creating} className="rounded-full bg-gradient-to-r from-gold to-gold-glow py-2 text-sm font-bold uppercase tracking-widest text-ink flex items-center justify-center gap-2 disabled:opacity-60">
          {creating ? <Loader2 className="h-4 w-4 animate-spin"/> : <Plus className="h-4 w-4"/>} Add Job
        </button>
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
          className="sm:col-span-2 rounded-lg bg-input border border-border px-3 py-2 text-sm resize-none"
        />
      </form>

      {loading ? (
        <div className="p-12 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-gold"/></div>
      ) : (
        <div className="space-y-3">
          {jobs.map((j) => (
            <div key={j.id} className="rounded-2xl border border-border bg-card p-5 flex flex-wrap gap-4 items-start">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-display text-xl tracking-wider">{j.title}</h3>
                  {!j.is_active && <span className="text-xs text-muted-foreground">(Hidden)</span>}
                </div>
                <p className="text-xs text-muted-foreground mb-2">{j.job_type} · {j.location}</p>
                <p className="text-sm text-muted-foreground">{j.description}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => toggle(j.id, j.is_active)} className="px-4 py-2 rounded-lg border border-border text-xs uppercase tracking-widest hover:border-gold hover:text-gold">
                  {j.is_active ? "Hide" : "Show"}
                </button>
                <button onClick={() => remove(j.id)} className="px-3 py-2 rounded-lg border border-border text-muted-foreground hover:text-neon-red hover:border-neon-red">
                  <Trash2 className="h-4 w-4"/>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
