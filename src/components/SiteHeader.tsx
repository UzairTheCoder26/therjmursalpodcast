import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, Mic } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/podcast", label: "Podcast" },
  { to: "/careers", label: "Careers" },
  { to: "/terms", label: "Terms" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-ink/85 backdrop-blur-xl border-b border-border/60"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-gold to-neon-red shadow-gold">
            <Mic className="h-4 w-4 text-ink" strokeWidth={3} />
          </span>
          <span className="font-display text-2xl tracking-wider text-foreground group-hover:text-gold transition-colors">
            RJ<span className="text-gold">MURSAL</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="px-4 py-2 text-sm uppercase tracking-widest text-muted-foreground hover:text-gold transition-colors relative"
              activeProps={{ className: "text-gold" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/services"
            className="ml-3 px-5 py-2 rounded-full bg-gradient-to-r from-gold to-gold-glow text-ink font-bold text-sm uppercase tracking-wider hover:shadow-gold transition-all"
          >
            Book Now
          </Link>
        </nav>

        <button
          onClick={() => setOpen((o) => !o)}
          className="lg:hidden p-2 text-foreground"
          aria-label="Menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-ink/95 backdrop-blur-xl border-t border-border animate-fade-up">
          <nav className="flex flex-col px-5 py-6 gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="px-3 py-3 text-base uppercase tracking-widest text-muted-foreground hover:text-gold transition-colors border-b border-border/40"
                activeProps={{ className: "text-gold" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/services"
              className="mt-4 px-5 py-3 rounded-full bg-gradient-to-r from-gold to-gold-glow text-ink font-bold text-sm uppercase tracking-wider text-center"
            >
              Book Now
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
