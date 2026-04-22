import { createFileRoute } from "@tanstack/react-router";
import { SubmissionsTable, fmtDate } from "@/components/admin/SubmissionsTable";

export const Route = createFileRoute("/admin/features")({
  component: () => (
    <SubmissionsTable
      table="podcast_features"
      title="PODCAST FEATURE REQUESTS"
      description="People pitching to be guests on the show."
      statusOptions={["new", "reviewed", "shortlisted", "rejected"]}
      exportable
      columns={[
        { key: "full_name", label: "Name" },
        { key: "profession", label: "Profession" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        { key: "social_handle", label: "Social" },
        { key: "reason", label: "Why featured" },
        { key: "created_at", label: "Date", render: (r) => fmtDate(r.created_at) },
      ]}
    />
  ),
});
