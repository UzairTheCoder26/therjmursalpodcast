import { createFileRoute } from "@tanstack/react-router";
import { SubmissionsTable, fmtDate } from "@/components/admin/SubmissionsTable";

export const Route = createFileRoute("/admin/sponsorships")({
  component: () => (
    <SubmissionsTable
      table="sponsorships"
      title="SPONSORSHIP INQUIRIES"
      description="Brands interested in sponsoring the podcast."
      statusOptions={["new", "in_discussion", "closed"]}
      filterKey="budget_range"
      filterOptions={["Under ₹10K", "₹10K–₹50K", "₹50K–₹1L", "₹1L+"]}
      exportable
      columns={[
        { key: "full_name", label: "Name" },
        { key: "company", label: "Company" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        { key: "budget_range", label: "Budget" },
        { key: "message", label: "Message" },
        { key: "created_at", label: "Date", render: (r) => fmtDate(r.created_at) },
      ]}
    />
  ),
});
