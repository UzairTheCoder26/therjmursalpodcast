import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { initialsFromName, instagramUrl, normalizeInstagramHandle } from "@/lib/team";

export type TeamMemberCardData = {
  full_name: string;
  role: string;
  instagram_handle: string;
  contact_button_label: string;
  photo_url?: string;
};

export function TeamMemberCard({
  member,
  onContact,
}: {
  member: TeamMemberCardData;
  onContact?: () => void;
}) {
  const handle = normalizeInstagramHandle(member.instagram_handle);
  const igUrl = instagramUrl(handle);
  const initials = initialsFromName(member.full_name);

  return (
    <div className="group rounded-2xl border border-border bg-card p-6 hover:border-gold/60 hover:-translate-y-1 hover:shadow-gold transition-all duration-300">
      <div className="flex items-start gap-4">
        <Avatar className="h-14 w-14 border border-gold/30">
          <AvatarImage src={member.photo_url || ""} alt={member.full_name} className="object-cover" />
          <AvatarFallback className="bg-gradient-to-br from-gold/20 to-neon-red/20 text-gold font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="font-display text-xl tracking-wider truncate">{member.full_name}</div>
          <div className="text-sm text-muted-foreground">{member.role}</div>
          {handle ? (
            <a
              href={igUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex text-sm font-bold text-gold hover:underline"
            >
              @{handle}
            </a>
          ) : (
            <div className="mt-2 text-sm text-muted-foreground/70">@</div>
          )}
        </div>
      </div>

      <div className="mt-5">
        <Button
          type="button"
          onClick={onContact}
          className="w-full rounded-full bg-gradient-to-r from-gold to-gold-glow text-ink font-bold uppercase tracking-widest hover:shadow-gold"
        >
          {member.contact_button_label || `Contact ${member.full_name.split(" ")[0]}`}
        </Button>
      </div>
    </div>
  );
}

