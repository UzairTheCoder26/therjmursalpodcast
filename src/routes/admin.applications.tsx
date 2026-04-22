import { createFileRoute } from "@tanstack/react-router";
import { SubmissionsTable, fmtDate } from "@/components/admin/SubmissionsTable";
import { supabase } from "@/integrations/supabase/client";
import { Download } from "lucide-react";
import { toast } from "sonner";

async function downloadResume(path: string) {
  const { data, error } = await supabase.storage.from("resumes").createSignedUrl(path, 60);
  if (error || !data) { toast.error("Could not generate download link"); return; }
  window.open(data.signedUrl, "_blank");
}

export const Route = createFileRoute("/admin/applications")({
  component: () => (
    <SubmissionsTable
      table="career_applications"
      title="CAREER APPLICATIONS"
      description="Job applications with downloadable resumes."
      statusOptions={["new", "reviewed", "shortlisted", "rejected"]}
      filterKey="position"
      filterOptions={["Podcast Producer", "Social Media Manager", "Video Editor"]}
      exportable
      columns={[
        { key: "full_name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        { key: "position", label: "Position" },
        { key: "portfolio_link", label: "Portfolio", render: (r) => r.portfolio_link
            ? <a href={String(r.portfolio_link)} target="_blank" rel="noreferrer" className="text-gold underline">link</a>
            : "—" },
        { key: "reason", label: "Why join" },
        { key: "resume_path", label: "Resume", render: (r) => r.resume_path
            ? <button onClick={() => downloadResume(String(r.resume_path))} className="inline-flex items-center gap-1 text-gold hover:underline"><Download className="h-3 w-3"/>PDF</button>
            : "—" },
        { key: "created_at", label: "Date", render: (r) => fmtDate(r.created_at) },
      ]}
    />
  ),
});
