import { createFileRoute, Link } from "@tanstack/react-router";
import { SubmissionsTable, fmtDate } from "@/components/admin/SubmissionsTable";
import { formatWhatsappDisplay } from "@/lib/meetupTour";
import { Settings } from "lucide-react";

export const Route = createFileRoute("/admin/meetup")({
  component: AdminMeetupPage,
});

function AdminMeetupPage() {
  return (
    <div className="space-y-6">
      <Link
        to="/admin/meetup-settings"
        className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs uppercase tracking-widest text-muted-foreground hover:border-gold hover:text-gold transition-colors"
      >
        <Settings className="h-3.5 w-3.5" />
        Page Settings
      </Link>

      <SubmissionsTable
        table="meetup_tour_registrations"
        title="MEET-UP REGISTRATIONS"
        description="Kashmir Meet-Up Tour 2026 sign-ups from the public registration form."
        exportable
        columns={[
          { key: "name", label: "Name" },
          { key: "location", label: "Location" },
          {
            key: "whatsapp",
            label: "WhatsApp",
            render: (r) => formatWhatsappDisplay(String(r.whatsapp ?? "")),
          },
          { key: "created_at", label: "Registered", render: (r) => fmtDate(r.created_at) },
        ]}
      />
    </div>
  );
}
