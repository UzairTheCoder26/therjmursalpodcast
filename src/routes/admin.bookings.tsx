import { createFileRoute } from "@tanstack/react-router";
import { SubmissionsTable, fmtDate } from "@/components/admin/SubmissionsTable";

export const Route = createFileRoute("/admin/bookings")({
  component: () => (
    <SubmissionsTable
      table="service_bookings"
      title="SERVICE BOOKINGS"
      description="All service inquiries from the public site."
      filterKey="service_type"
      filterOptions={["Radio Ad", "Brand Ads Shoot", "Digital Marketing", "Brand Shoot"]}
      statusOptions={["new", "contacted", "closed"]}
      exportable
      columns={[
        { key: "full_name", label: "Name" },
        { key: "company", label: "Company" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        { key: "service_type", label: "Service" },
        { key: "message", label: "Message" },
        { key: "created_at", label: "Date", render: (r) => fmtDate(r.created_at) },
      ]}
    />
  ),
});
