import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Trash2, Download } from "lucide-react";
import { toast } from "sonner";

interface Column {
  key: string;
  label: string;
  render?: (row: Record<string, unknown>) => React.ReactNode;
}

interface Props {
  table: "service_bookings" | "podcast_features" | "sponsorships" | "career_applications";
  title: string;
  description: string;
  columns: Column[];
  statusOptions?: string[];
  filterKey?: string;
  filterOptions?: string[];
  exportable?: boolean;
}

export function SubmissionsTable({
  table, title, description, columns, statusOptions, filterKey, filterOptions, exportable,
}: Props) {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  const load = async () => {
    setLoading(true);
    let q = supabase.from(table).select("*").order("created_at", { ascending: false });
    if (filter !== "all" && filterKey) q = q.eq(filterKey, filter);
    const { data, error } = await q;
    if (error) toast.error(error.message);
    setRows(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [filter]);

  const updateRow = async (id: string, patch: Record<string, unknown>) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from(table) as any).update(patch).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Updated"); load(); }
  };

  const deleteRow = async (id: string) => {
    if (!confirm("Delete this entry permanently?")) return;
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted"); load(); }
  };

  const exportCsv = () => {
    if (!rows.length) return;
    const keys = columns.map((c) => c.key);
    const head = keys.join(",");
    const body = rows.map((r) =>
      keys.map((k) => `"${String(r[k] ?? "").replace(/"/g, '""')}"`).join(",")
    ).join("\n");
    const blob = new Blob([head + "\n" + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${table}-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl tracking-wider">{title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
        <div className="flex gap-2">
          {filterKey && filterOptions && (
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-lg bg-input border border-border px-3 py-2 text-sm"
            >
              <option value="all">All</option>
              {filterOptions.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          )}
          {exportable && (
            <button onClick={exportCsv} className="rounded-lg border border-border px-4 py-2 text-xs uppercase tracking-widest hover:border-gold hover:text-gold flex items-center gap-2">
              <Download className="h-3.5 w-3.5" /> CSV
            </button>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-gold" /></div>
        ) : rows.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">No entries yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-ink-2 text-xs uppercase tracking-widest text-muted-foreground">
                <tr>
                  {columns.map((c) => <th key={c.key} className="text-left px-4 py-3 font-normal">{c.label}</th>)}
                  {statusOptions && <th className="text-left px-4 py-3 font-normal">Status</th>}
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={String(r.id)} className="border-t border-border hover:bg-accent/30">
                    {columns.map((c) => (
                      <td key={c.key} className="px-4 py-3 align-top max-w-[260px]">
                        {c.render ? c.render(r) : <span className="text-foreground/90 break-words">{String(r[c.key] ?? "—")}</span>}
                      </td>
                    ))}
                    {statusOptions && (
                      <td className="px-4 py-3">
                        <select
                          value={String(r.status || "new")}
                          onChange={(e) => updateRow(String(r.id), { status: e.target.value })}
                          className="rounded bg-input border border-border px-2 py-1 text-xs"
                        >
                          {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                    )}
                    <td className="px-4 py-3">
                      <button onClick={() => deleteRow(String(r.id))} className="text-muted-foreground hover:text-neon-red">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export function fmtDate(v: unknown) {
  if (!v) return "—";
  return new Date(String(v)).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
