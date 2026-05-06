import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Loader2, Plus, Trash2, Upload } from "lucide-react";
import { publicProfileUrl } from "@/lib/storage";
import { normalizeInstagramHandle } from "@/lib/team";

type TeamMemberRow = {
  id: string;
  full_name: string;
  role: string;
  instagram_handle: string;
  contact_button_label: string;
  photo_path: string;
  featured: boolean;
  sort_order: number;
};

type TeamPageIntroContent = { heading: string; body: string };
type HomeTeamContent = { meet_whole_team_button_label: string };

export const Route = createFileRoute("/admin/team")({
  component: AdminTeamPage,
});

function AdminTeamPage() {
  const [members, setMembers] = useState<TeamMemberRow[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [intro, setIntro] = useState<TeamPageIntroContent>({ heading: "", body: "" });
  const [homeTeam, setHomeTeam] = useState<HomeTeamContent>({ meet_whole_team_button_label: "" });
  const [savingContent, setSavingContent] = useState(false);

  const [localPreviewUrl, setLocalPreviewUrl] = useState<string>("");

  useEffect(() => {
    let mounted = true;

    Promise.all([
      supabase
        .from("team_members")
        .select("id, full_name, role, instagram_handle, contact_button_label, photo_path, featured, sort_order")
        .order("sort_order", { ascending: true }),
      supabase.from("site_content").select("value").eq("key", "team_page_intro").maybeSingle(),
      supabase.from("site_content").select("value").eq("key", "home_team").maybeSingle(),
    ]).then(([mRes, introRes, homeRes]) => {
      if (!mounted) return;
      setMembers((mRes.data as unknown as TeamMemberRow[]) || []);
      if (introRes.data?.value) setIntro(introRes.data.value as unknown as TeamPageIntroContent);
      if (homeRes.data?.value) setHomeTeam(homeRes.data.value as unknown as HomeTeamContent);
      setSelectedId((mRes.data?.[0] as any)?.id ?? null);
    });

    return () => {
      mounted = false;
    };
  }, []);

  const selected = useMemo(() => members?.find((m) => m.id === selectedId) || null, [members, selectedId]);
  const featuredCount = useMemo(() => (members || []).filter((m) => m.featured).length, [members]);

  const updateSelected = (patch: Partial<TeamMemberRow>) => {
    if (!members || !selected) return;
    setMembers(
      members.map((m) => (m.id === selected.id ? { ...m, ...patch } : m)),
    );
  };

  const addMember = async () => {
    setSaving(true);
    const nextSort = (members?.reduce((acc, m) => Math.max(acc, m.sort_order), 0) ?? 0) + 1;
    const { data, error } = await supabase
      .from("team_members")
      .insert({
        full_name: "New Member",
        role: "Role",
        instagram_handle: "",
        contact_button_label: "Contact",
        photo_path: "",
        featured: false,
        sort_order: nextSort,
      })
      .select("id, full_name, role, instagram_handle, contact_button_label, photo_path, featured, sort_order")
      .maybeSingle();
    setSaving(false);
    if (error || !data) {
      toast.error(error?.message || "Failed to add member");
      return;
    }
    setMembers([...(members || []), data as unknown as TeamMemberRow].sort((a, b) => a.sort_order - b.sort_order));
    setSelectedId((data as any).id);
    toast.success("Member added");
  };

  const deleteMember = async (id: string) => {
    if (!members) return;
    setSaving(true);
    const { error } = await supabase.from("team_members").delete().eq("id", id);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    const next = members.filter((m) => m.id !== id);
    setMembers(next);
    if (selectedId === id) setSelectedId(next[0]?.id ?? null);
    toast.success("Deleted");
  };

  const saveSelected = async () => {
    if (!selected) return;
    setSaving(true);
    const payload = {
      full_name: selected.full_name.trim(),
      role: selected.role.trim(),
      instagram_handle: normalizeInstagramHandle(selected.instagram_handle),
      contact_button_label: selected.contact_button_label.trim(),
      photo_path: selected.photo_path,
      featured: selected.featured,
      sort_order: selected.sort_order,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("team_members").update(payload).eq("id", selected.id);
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Saved");
  };

  const swapOrder = async (a: TeamMemberRow, b: TeamMemberRow) => {
    if (!members) return;
    // optimistic
    setMembers(
      members
        .map((m) => {
          if (m.id === a.id) return { ...m, sort_order: b.sort_order };
          if (m.id === b.id) return { ...m, sort_order: a.sort_order };
          return m;
        })
        .sort((x, y) => x.sort_order - y.sort_order),
    );

    const { error: e1 } = await supabase.from("team_members").update({ sort_order: b.sort_order }).eq("id", a.id);
    const { error: e2 } = await supabase.from("team_members").update({ sort_order: a.sort_order }).eq("id", b.id);
    if (e1 || e2) toast.error((e1 || e2)?.message || "Failed to reorder");
  };

  const toggleFeatured = (next: boolean) => {
    if (!members || !selected) return;
    if (next && !selected.featured) {
      const count = members.filter((m) => m.featured).length;
      if (count >= 3) {
        toast.error("Only 3 members can be featured on the homepage.");
        return;
      }
    }
    updateSelected({ featured: next });
  };

  const onUploadPhoto = async (file: File) => {
    if (!selected) return;
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      toast.error("Please upload a JPG, PNG, or WebP image.");
      return;
    }

    // local preview
    if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl);
    const preview = URL.createObjectURL(file);
    setLocalPreviewUrl(preview);

    setUploading(true);
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const path = `team/${selected.id}-${Date.now()}-${safeName}`;
    const { error } = await supabase.storage.from("profile").upload(path, file, { upsert: true });
    setUploading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    updateSelected({ photo_path: path });
    toast.success("Photo uploaded — click Save to apply.");
  };

  const saveContent = async () => {
    setSavingContent(true);
    const updated_at = new Date().toISOString();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const a = await supabase.from("site_content").upsert({ key: "team_page_intro", value: intro as any, updated_at }, { onConflict: "key" });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const b = await supabase.from("site_content").upsert({ key: "home_team", value: homeTeam as any, updated_at }, { onConflict: "key" });
    setSavingContent(false);
    if (a.error) toast.error(a.error.message);
    else if (b.error) toast.error(b.error.message);
    else toast.success("Team content saved");
  };

  if (!members) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="h-6 w-6 animate-spin text-gold" />
      </div>
    );
  }

  const ordered = [...members].sort((x, y) => x.sort_order - y.sort_order);

  return (
    <div className="max-w-6xl space-y-10">
      <div>
        <h1 className="font-display text-3xl tracking-wider mb-2">TEAM</h1>
        <p className="text-muted-foreground text-sm">
          Manage team members, homepage featured picks (max 3), ordering, and team page intro content.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* List */}
        <div className="lg:col-span-5 rounded-2xl border border-border bg-card">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              Members ({members.length}) · Featured {featuredCount}/3
            </div>
            <button
              onClick={addMember}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs uppercase tracking-widest hover:border-gold hover:text-gold disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />} Add
            </button>
          </div>

          {featuredCount > 3 && (
            <div className="px-4 py-3 border-b border-neon-red/30 bg-neon-red/10 text-neon-red text-xs">
              Too many featured members selected. Only 3 will appear on the homepage.
            </div>
          )}

          <div className="divide-y divide-border">
            {ordered.map((m, idx) => (
              <div
                key={m.id}
                className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-accent/30 ${
                  selectedId === m.id ? "bg-gold/10" : ""
                }`}
                onClick={() => setSelectedId(m.id)}
              >
                <div className="min-w-0 flex-1">
                  <div className="font-display tracking-wider truncate">
                    {m.full_name} {m.featured ? <span className="text-gold">· FEATURED</span> : null}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">{m.role}</div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    disabled={idx === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (idx === 0) return;
                      swapOrder(ordered[idx], ordered[idx - 1]);
                    }}
                    className="h-9 w-9 rounded-lg border border-border hover:border-gold hover:text-gold disabled:opacity-40 inline-flex items-center justify-center"
                    title="Move up"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    disabled={idx === ordered.length - 1}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (idx === ordered.length - 1) return;
                      swapOrder(ordered[idx], ordered[idx + 1]);
                    }}
                    className="h-9 w-9 rounded-lg border border-border hover:border-gold hover:text-gold disabled:opacity-40 inline-flex items-center justify-center"
                    title="Move down"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Editor */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-2xl tracking-wider mb-4">EDIT MEMBER</h2>
            {!selected ? (
              <p className="text-muted-foreground text-sm">Select a team member to edit.</p>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5">
                    Profile photo (JPG, PNG, WebP)
                  </label>
                  <div className="flex items-center gap-4">
                    <img
                      src={localPreviewUrl || publicProfileUrl(selected.photo_path) || ""}
                      alt=""
                      className="h-20 w-20 rounded-xl object-cover border border-border bg-ink-2"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "";
                      }}
                    />
                    <label className="inline-flex items-center gap-2 cursor-pointer rounded-lg border border-border px-4 py-2 text-xs uppercase tracking-widest hover:border-gold hover:text-gold">
                      {uploading ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Upload className="h-3.5 w-3.5" />
                      )}
                      Upload / Replace
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && onUploadPhoto(e.target.files[0])}
                      />
                    </label>
                  </div>
                </div>

                <Field label="Full name" value={selected.full_name} onChange={(v) => updateSelected({ full_name: v })} />
                <Field label="Role / designation" value={selected.role} onChange={(v) => updateSelected({ role: v })} />
                <Field
                  label="Instagram handle (without @)"
                  value={selected.instagram_handle}
                  onChange={(v) => updateSelected({ instagram_handle: v })}
                />
                <Field
                  label='Contact button label (e.g. "Message Aaliya")'
                  value={selected.contact_button_label}
                  onChange={(v) => updateSelected({ contact_button_label: v })}
                />

                <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={selected.featured}
                    onChange={(e) => toggleFeatured(e.target.checked)}
                    className="h-4 w-4 rounded border-border accent-gold"
                  />
                  Featured on homepage (max 3)
                </label>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={saveSelected}
                    disabled={saving}
                    className="rounded-full bg-gradient-to-r from-gold to-gold-glow px-8 py-3 text-sm font-bold uppercase tracking-widest text-ink hover:shadow-gold disabled:opacity-60 inline-flex items-center gap-2"
                  >
                    {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save Member
                  </button>

                  <button
                    onClick={() => deleteMember(selected.id)}
                    disabled={saving}
                    className="rounded-full border-2 border-neon-red px-8 py-3 text-sm font-bold uppercase tracking-widest text-foreground hover:bg-neon-red/10 disabled:opacity-60 inline-flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" /> Delete
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-2xl tracking-wider mb-4">TEAM PAGE + HOMEPAGE COPY</h2>
            <div className="space-y-4">
              <Field label="Team page intro heading" value={intro.heading || ""} onChange={(v) => setIntro({ ...intro, heading: v })} />
              <Field
                label="Team page intro body"
                value={intro.body || ""}
                onChange={(v) => setIntro({ ...intro, body: v })}
                multiline
              />
              <Field
                label='Homepage button label ("/team")'
                value={homeTeam.meet_whole_team_button_label || ""}
                onChange={(v) => setHomeTeam({ ...homeTeam, meet_whole_team_button_label: v })}
              />

              <button
                onClick={saveContent}
                disabled={savingContent}
                className="rounded-full border-2 border-gold/50 px-8 py-3 text-sm font-bold uppercase tracking-widest text-foreground hover:bg-gold/10 disabled:opacity-60 inline-flex items-center gap-2"
              >
                {savingContent && <Loader2 className="h-4 w-4 animate-spin" />} Save Content
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={5}
          className="w-full rounded-lg bg-input border border-border px-3 py-2 text-sm resize-none focus:border-gold focus:outline-none"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg bg-input border border-border px-3 py-2 text-sm focus:border-gold focus:outline-none"
        />
      )}
    </div>
  );
}

