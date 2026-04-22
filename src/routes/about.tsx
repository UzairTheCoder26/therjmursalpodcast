import { createFileRoute } from "@tanstack/react-router";
import heroImg from "@/assets/rj-hero.svg";
import { useAboutContent } from "@/hooks/useSiteContent";
import { Instagram, Youtube, Music2, Linkedin } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About RJMursal — From Studio M to India's airwaves" },
      { name: "description", content: "The story behind RJ Mursal — from Studio M to one of India's most listened-to podcasts." },
      { property: "og:title", content: "About RJMursal" },
      { property: "og:description", content: "The story behind the voice." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const data = useAboutContent();

  const img = data?.profile_image || heroImg;
  const socials = data?.socials || {};

  return (
    <div className="py-20">
      <section className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-xs uppercase tracking-[0.4em] text-gold mb-3">About</p>
          <h1 className="font-display text-6xl sm:text-8xl">
            THE <span className="text-gold-gradient">STORY</span>
          </h1>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-gold/30 shadow-gold">
              <img
                src={img}
                alt="RJ Mursal"
                className="h-full w-full object-cover"
                width={800}
                height={1000}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
            </div>
          </div>

          <div className="lg:col-span-7">
            <h2 className="font-display text-4xl sm:text-5xl mb-6">
              {data?.title || "The Voice Behind The Mic"}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
              {data?.bio ||
                "Loading…"}
            </p>

            <div className="mt-10 flex gap-3">
              {socials.instagram && (
                <a href={socials.instagram} target="_blank" rel="noreferrer"
                  className="h-11 w-11 rounded-full border border-border flex items-center justify-center hover:border-gold hover:text-gold hover:shadow-gold transition-all">
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {socials.youtube && (
                <a href={socials.youtube} target="_blank" rel="noreferrer"
                  className="h-11 w-11 rounded-full border border-border flex items-center justify-center hover:border-gold hover:text-gold hover:shadow-gold transition-all">
                  <Youtube className="h-4 w-4" />
                </a>
              )}
              {socials.spotify && (
                <a href={socials.spotify} target="_blank" rel="noreferrer"
                  className="h-11 w-11 rounded-full border border-border flex items-center justify-center hover:border-gold hover:text-gold hover:shadow-gold transition-all">
                  <Music2 className="h-4 w-4" />
                </a>
              )}
              {socials.linkedin && (
                <a href={socials.linkedin} target="_blank" rel="noreferrer"
                  className="h-11 w-11 rounded-full border border-border flex items-center justify-center hover:border-gold hover:text-gold hover:shadow-gold transition-all">
                  <Linkedin className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-5">
          {(data?.stats || []).map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-6 text-center hover:border-gold/60 hover:shadow-gold transition-all">
              <div className="font-display text-5xl sm:text-6xl text-gold-gradient">{s.value}</div>
              <div className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
