import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Loader2, Mic, Lock, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

const LOCK_KEY = "rj_admin_lock";
const ATTEMPTS_KEY = "rj_admin_attempts";
const LOCK_MS = 15 * 60 * 1000; // 15 min

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Admin Login — RJMursal" }, { name: "robots", content: "noindex" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { session, isAdmin, loading: authLoading } = useAdminAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [lockedUntil, setLockedUntil] = useState<number>(0);

  useEffect(() => {
    const lock = Number(localStorage.getItem(LOCK_KEY) || 0);
    if (lock > Date.now()) setLockedUntil(lock);
  }, []);

  useEffect(() => {
    if (!authLoading && session && isAdmin) {
      navigate({ to: "/admin" });
    }
  }, [session, isAdmin, authLoading, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockedUntil > Date.now()) {
      toast.error("Too many attempts. Try again later.");
      return;
    }
    setSubmitting(true);

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      setSubmitting(false);
      if (error) toast.error(error.message);
      else toast.success("Account created. Sign in now.");
      setMode("signin");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);

    if (error) {
      const attempts = Number(localStorage.getItem(ATTEMPTS_KEY) || 0) + 1;
      localStorage.setItem(ATTEMPTS_KEY, String(attempts));
      if (attempts >= 5) {
        const until = Date.now() + LOCK_MS;
        localStorage.setItem(LOCK_KEY, String(until));
        setLockedUntil(until);
        toast.error("Locked for 15 minutes after 5 failed attempts.");
      } else {
        toast.error(`${error.message} (${5 - attempts} left)`);
      }
    } else {
      localStorage.removeItem(ATTEMPTS_KEY);
      localStorage.removeItem(LOCK_KEY);
      toast.success("Signed in.");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  if (session && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <ShieldAlert className="h-12 w-12 text-neon-red mx-auto mb-4" />
          <h1 className="font-display text-3xl mb-2">NOT AUTHORIZED</h1>
          <p className="text-muted-foreground text-sm mb-6">
            This account does not have admin access. Only the designated admin email can access this area.
          </p>
          <button
            onClick={async () => { await supabase.auth.signOut(); }}
            className="rounded-full border border-border px-6 py-3 text-sm font-bold uppercase tracking-widest hover:border-gold hover:text-gold"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  const locked = lockedUntil > Date.now();

  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gold to-neon-red">
            <Mic className="h-5 w-5 text-ink" strokeWidth={3} />
          </span>
          <span className="font-display text-2xl tracking-wider">
            RJ<span className="text-gold">MURSAL</span>
          </span>
        </Link>

        <div className="rounded-3xl border border-gold/30 bg-card p-8 shadow-gold">
          <div className="flex items-center gap-2 mb-1">
            <Lock className="h-4 w-4 text-gold" />
            <p className="text-xs uppercase tracking-[0.3em] text-gold">Admin Console</p>
          </div>
          <h1 className="font-display text-3xl mb-6">
            {mode === "signin" ? "SIGN IN" : "CREATE ADMIN"}
          </h1>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={locked}
                className="w-full rounded-xl bg-input border border-border px-4 py-3 focus:border-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                disabled={locked}
                className="w-full rounded-xl bg-input border border-border px-4 py-3 focus:border-gold focus:outline-none"
              />
            </div>
            <button
              disabled={submitting || locked}
              className="w-full rounded-full bg-gradient-to-r from-gold to-gold-glow py-3 text-sm font-bold uppercase tracking-widest text-ink hover:shadow-gold disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "signin" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <button
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="mt-4 w-full text-xs text-muted-foreground hover:text-gold uppercase tracking-widest"
          >
            {mode === "signin" ? "First time? Create the admin account" : "Already have an account? Sign in"}
          </button>

          {locked && (
            <p className="mt-4 text-center text-xs text-neon-red">
              Locked. Try again in {Math.ceil((lockedUntil - Date.now()) / 60000)} min.
            </p>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Only <span className="text-gold">mursalaltaf17@gmail.com</span> is granted admin access.
        </p>
      </div>
    </div>
  );
}
