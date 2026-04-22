import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Inbox, Mic2, Megaphone, Briefcase } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: Overview,
});

function Overview() {
  const [counts, setCounts] = useState({ b: 0, f: 0, s: 0, c: 0 });

  useEffect(() => {
    Promise.all([
      supabase.from("service_bookings").select("*", { count: "exact", head: true }),
      supabase.from("podcast_features").select("*", { count: "exact", head: true }),
      supabase.from("sponsorships").select("*", { count: "exact", head: true }),
      supabase.from("career_applications").select("*", { count: "exact", head: true }),
    ]).then(([b, f, s, c]) => setCounts({ b: b.count || 0, f: f.count || 0, s: s.count || 0, c: c.count || 0 }));
  }, []);

  const stats = [
    { Icon: Inbox, label: "Service Bookings", value: counts.b, color: "text-gold" },
    { Icon: Mic2, label: "Podcast Features", value: counts.f, color: "text-gold" },
    { Icon: Megaphone, label: "Sponsorships", value: counts.s, color: "text-neon-red" },
    { Icon: Briefcase, label: "Applications", value: counts.c, color: "text-gold" },
  ];

  return (
    <div>
      <h1 className="font-display text-4xl tracking-wider mb-2">DASHBOARD</h1>
      <p className="text-muted-foreground mb-8">Welcome back. Here's what's happening.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ Icon, label, value, color }) => (
          <div key={label} className="rounded-2xl border border-border bg-card p-6">
            <Icon className={`h-6 w-6 ${color} mb-3`} />
            <div className="font-display text-5xl">{value}</div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
