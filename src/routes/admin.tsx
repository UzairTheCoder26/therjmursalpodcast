import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  Loader2, Mic, LayoutDashboard, Inbox, Mic2, Megaphone,
  Briefcase, FileText, UserCog, Settings, LogOut, User,
} from "lucide-react";

const INACTIVITY_MS = 30 * 60 * 1000; // 30 min

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — RJMursal" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

const navItems = [
  { to: "/admin", label: "Overview", Icon: LayoutDashboard, exact: true },
  { to: "/admin/bookings", label: "Service Bookings", Icon: Inbox },
  { to: "/admin/features", label: "Podcast Features", Icon: Mic2 },
  { to: "/admin/sponsorships", label: "Sponsorships", Icon: Megaphone },
  { to: "/admin/applications", label: "Career Applications", Icon: Briefcase },
  { to: "/admin/jobs", label: "Job Listings", Icon: UserCog },
  { to: "/admin/about", label: "Edit About", Icon: User },
  { to: "/admin/terms", label: "Edit Terms", Icon: FileText },
  { to: "/admin/settings", label: "Settings", Icon: Settings },
] as { to: string; label: string; Icon: typeof LayoutDashboard; exact?: boolean }[];

function AdminLayout() {
  const navigate = useNavigate();
  const { session, isAdmin, loading } = useAdminAuth();
  const path = useRouterState({ select: (s) => s.location.pathname });

  // Redirect to login when unauthenticated
  useEffect(() => {
    if (!loading && (!session || !isAdmin) && path !== "/admin/login") {
      navigate({ to: "/admin/login" });
    }
  }, [session, isAdmin, loading, path, navigate]);

  // Auto logout on inactivity
  useEffect(() => {
    if (!session) return;
    let timer: ReturnType<typeof setTimeout>;
    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(async () => {
        await supabase.auth.signOut();
        navigate({ to: "/admin/login" });
      }, INACTIVITY_MS);
    };
    const events = ["mousemove", "keydown", "click", "scroll"];
    events.forEach((e) => window.addEventListener(e, reset));
    reset();
    return () => {
      clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [session, navigate]);

  if (path === "/admin/login") return <Outlet />;

  if (loading || !session || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-ink">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border bg-ink-2 sticky top-0 h-screen">
        <Link to="/" className="flex items-center gap-2 px-6 h-16 border-b border-border">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-gold to-neon-red">
            <Mic className="h-3.5 w-3.5 text-ink" strokeWidth={3} />
          </span>
          <span className="font-display text-lg tracking-wider">RJ<span className="text-gold">MURSAL</span></span>
        </Link>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(({ to, label, Icon, exact }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              activeProps={{ className: "bg-gold/10 text-gold border border-gold/30" }}
              activeOptions={{ exact: exact }}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            navigate({ to: "/admin/login" });
          }}
          className="m-3 flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-neon-red/10 hover:text-neon-red border border-border"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="lg:hidden h-14 border-b border-border bg-ink-2 px-5 flex items-center justify-between sticky top-0 z-30">
          <Link to="/admin" className="font-display text-lg tracking-wider">
            ADMIN<span className="text-gold">·</span>
          </Link>
          <button
            onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/admin/login" }); }}
            className="text-xs uppercase tracking-widest text-muted-foreground"
          >
            Sign out
          </button>
        </header>

        {/* Mobile nav scroller */}
        <div className="lg:hidden overflow-x-auto border-b border-border bg-ink-2">
          <nav className="flex gap-1 px-3 py-2 min-w-max">
            {navItems.map(({ to, label, Icon, exact }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap text-muted-foreground hover:bg-accent"
                activeProps={{ className: "bg-gold/10 text-gold" }}
                activeOptions={{ exact: exact }}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <main className="flex-1 p-5 lg:p-8 overflow-x-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
