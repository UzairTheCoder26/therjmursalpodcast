import { createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { TeamMemberCard } from "@/components/team/TeamMemberCard";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { useTeamPageIntroContent } from "@/hooks/useTeamContent";
import { publicProfileUrl } from "@/lib/storage";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Our Team — RJMursal" },
      { name: "description", content: "Meet the team behind RJMursal and Studio M." },
    ],
  }),
  component: TeamPage,
});

function TeamPage() {
  const intro = useTeamPageIntroContent();
  const members = useTeamMembers();

  return (
    <div className="py-20">
      <section className="max-w-7xl mx-auto px-5 lg:px-8">
        <p className="text-xs uppercase tracking-[0.4em] text-gold mb-3">Our Team</p>

        <div className="grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5">
            <h1 className="font-display text-5xl sm:text-6xl tracking-wider">
              {intro?.heading || "Meet the Team"}
            </h1>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              {intro?.body ||
                "A small crew with a big voice — we plan, shoot, cut, and publish stories that people actually feel."}
            </p>
          </div>

          <div className="lg:col-span-7">
            {!members ? (
              <div className="flex justify-center p-12">
                <Loader2 className="h-6 w-6 animate-spin text-gold" />
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {members.map((m) => (
                  <TeamMemberCard
                    key={m.id}
                    member={{
                      full_name: m.full_name,
                      role: m.role,
                      instagram_handle: m.instagram_handle,
                      contact_button_label: m.contact_button_label,
                      photo_url: publicProfileUrl(m.photo_path),
                    }}
                    onContact={() => {
                      // current behavior: send user to Instagram
                      const url = m.instagram_handle ? `https://instagram.com/${m.instagram_handle.replace(/^@/, "")}` : "";
                      if (url) window.open(url, "_blank", "noopener,noreferrer");
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

