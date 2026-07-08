import { createFileRoute } from "@tanstack/react-router";
import { SubmissionsTable, fmtDate } from "@/components/admin/SubmissionsTable";

export const Route = createFileRoute("/admin/consent")({
  component: AdminConsentPage,
});

function AdminConsentPage() {
  return (
    <SubmissionsTable
      table="minor_participation_consents"
      title="MINOR PARTICIPATION CONSENT"
      description="Parent/guardian consent forms submitted for minor podcast participation."
      statusOptions={["new", "reviewed", "approved", "rejected"]}
      exportable
      columns={[
        { key: "child_full_name", label: "Child Name" },
        { key: "child_age", label: "Age" },
        { key: "child_date_of_birth", label: "DOB" },
        { key: "guardian_full_name", label: "Guardian" },
        { key: "guardian_relationship", label: "Relationship" },
        { key: "guardian_mobile", label: "Mobile" },
        { key: "guardian_email", label: "Email" },
        {
          key: "accept_terms",
          label: "Terms Accepted",
          render: (r) => (r.accept_terms ? "Yes" : "No"),
        },
        {
          key: "confirm_guardian_consent",
          label: "Guardian Confirmed",
          render: (r) => (r.confirm_guardian_consent ? "Yes" : "No"),
        },
        { key: "created_at", label: "Submitted", render: (r) => fmtDate(r.created_at) },
      ]}
    />
  );
}
