import { Link } from "@tanstack/react-router";
import { Instagram, Youtube, Linkedin, Music2, Mic } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="relative border-t border-border/60 bg-ink-2 mt-20">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-gold to-neon-red">
              <Mic className="h-4 w-4 text-ink" strokeWidth={3} />
            </span>
            <span className="font-display text-2xl tracking-wider">
              RJ<span className="text-gold">MURSAL</span>
            </span>
          </Link>
          <p className="mt-4 text-muted-foreground max-w-md">
            Voice of the Masses. From FM Tadka studios to your favourite
            streaming app — stories that hit different.
          </p>
          <div className="flex gap-3 mt-6">
            {[
              { Icon: Instagram, href: "https://instagram.com/rjmursal" },
              { Icon: Youtube, href: "https://youtube.com/@rjmursal" },
              { Icon: Music2, href: "https://open.spotify.com" },
              { Icon: Linkedin, href: "https://linkedin.com" },
            ].map(({ Icon, href }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="h-10 w-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold hover:shadow-gold transition-all"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display text-xl tracking-widest text-gold mb-4">
            Explore
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-gold">About</Link></li>
            <li><Link to="/services" className="hover:text-gold">Services</Link></li>
            <li><Link to="/podcast" className="hover:text-gold">Podcast</Link></li>
            <li><Link to="/careers" className="hover:text-gold">Careers</Link></li>
            <li><Link to="/terms" className="hover:text-gold">Terms</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-xl tracking-widest text-gold mb-4">
            Get In Touch
          </h4>
          <a
            href="mailto:hello@rjmursal.com"
            className="text-muted-foreground hover:text-gold text-sm"
          >
            hello@rjmursal.com
          </a>
          <p className="text-muted-foreground text-sm mt-3">
            Mumbai · Available Worldwide
          </p>
        </div>
      </div>
      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground tracking-wider">
        © 2025 RJMURSAL · FM TADKA · ALL RIGHTS RESERVED
      </div>
    </footer>
  );
}
