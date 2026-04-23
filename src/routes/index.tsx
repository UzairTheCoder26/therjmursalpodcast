import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/rj-hero.svg";
import { SoundWave } from "@/components/SoundWave";
import { useAboutContent } from "@/hooks/useSiteContent";
import { Mic, Radio, Sparkles, ArrowRight, Headphones } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RJMursal — Voice of the Masses | Studio M | Podcast Host" },
      { name: "description", content: "RJ Mursal — voice of Studio M, host of one of India's boldest podcasts. Book ads, get featured, partner up." },
      { property: "og:title", content: "RJMursal — Voice of the Masses" },
      { property: "og:description", content: "Studio M RJ. Podcast Host. Brand Storyteller." },
    ],
  }),
  component: HomePage,
});

const marqueeItems = [
  "STUDIO M",
  "PODCAST HOST",
  "BRAND VOICE",
  "STORYTELLER",
  "RADIO JOCKEY",
  "50+ PODCASTS",
  "BOOK NOW",
];

function HomePage() {
  const aboutData = useAboutContent();
  const heroStats = aboutData?.stats?.length
    ? aboutData.stats.slice(0, 4)
    : [
        { value: "5+", label: "Years Experience" },
        { value: "50+", label: "Podcasts" },
        { value: "2M+", label: "Listeners Monthly" },
      ];
  const currentHeroImg = aboutData?.profile_image || heroImg;

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[100vh] w-full overflow-hidden flex items-center">
        {/* Soundwave background layer */}
        <div className="absolute inset-0 opacity-[0.18] pointer-events-none">
          <SoundWave count={120} />
        </div>

        {/* Glow orbs */}
        <div className="absolute top-1/4 -left-32 h-96 w-96 rounded-full bg-neon-red/30 blur-[120px]" />
        <div className="absolute bottom-1/4 -right-32 h-96 w-96 rounded-full bg-gold/30 blur-[120px]" />

        <div className="w-full max-w-7xl mx-auto px-5 lg:px-8 grid lg:grid-cols-12 gap-8 items-center relative z-10 py-20 overflow-x-hidden">
          <div className="lg:col-span-7 min-w-0 animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/5 px-4 py-1.5 text-xs uppercase tracking-[0.3em] text-gold mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-neon-red animate-pulse" />
              Studio M Presents
            </div>
            <h1 className="ml-[4px] sm:ml-[1px] lg:-ml-[3px] font-display text-[18vw] sm:text-[14vw] lg:text-[10rem] xl:text-[12rem] leading-[0.85] tracking-tight">
              <span className="block text-foreground">RJ</span>
              <span className="block text-gold-gradient">MURSAL</span>
            </h1>
            <p className="mt-6 ml-[8px] sm:ml-[5px] text-lg sm:text-xl text-muted-foreground max-w-xl">
              Voice of the Masses · Studio M · Podcast Host. Stories that move
              millions, conversations that hit different.
            </p>

            <div className="mt-8 flex w-full flex-wrap gap-3">
              <Link
                to="/services"
                className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold to-gold-glow px-7 py-3.5 text-sm font-bold uppercase tracking-[0.12em] sm:tracking-widest text-ink hover:shadow-gold transition-all glow-pulse"
              >
                Book A Service
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/podcast"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border-2 border-neon-red px-7 py-3.5 text-sm font-bold uppercase tracking-[0.12em] sm:tracking-widest text-foreground hover:bg-neon-red/10 hover:shadow-red transition-all"
              >
                <Mic className="h-4 w-4" />
                Get Featured
              </Link>
            </div>

            <div className="mt-10 flex flex-nowrap gap-3 sm:gap-8 text-sm max-w-full overflow-x-auto sm:overflow-visible">
              {heroStats.map((s, i) => (
                <div key={s.label} className={`min-w-0 shrink-0 sm:shrink ${i === 3 ? "hidden sm:block" : ""}`}>
                  <div className="font-display text-2xl sm:text-3xl text-gold">{s.value}</div>
                  <div className="text-[10px] sm:text-xs uppercase tracking-wide sm:tracking-widest text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 relative min-w-0 w-full max-w-[22rem] sm:max-w-md lg:max-w-none mx-auto animate-fade-up" style={{ animationDelay: "200ms" }}>
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden border border-gold/30 shadow-gold">
              <img
                src={currentHeroImg}
                alt="RJ Mursal at the studio microphone"
                className="h-full w-full object-cover"
                width={1080}
                height={1440}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-6">
                <div className="h-12">
                  <SoundWave count={28} />
                </div>
              </div>
            </div>
            <div className="hidden sm:block absolute -top-4 -right-4 rounded-2xl bg-neon-red px-4 py-2 font-display text-xl tracking-widest text-foreground rotate-3 shadow-red">
              ON AIR
            </div>
          </div>
        </div>

        {/* Marquee */}
        <div className="absolute bottom-0 inset-x-0 border-y border-gold/20 bg-ink/60 backdrop-blur overflow-hidden py-3">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((m, i) => (
              <span key={i} className="font-display text-xl tracking-[0.4em] mx-8 text-muted-foreground">
                {m} <span className="text-gold mx-4">●</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="py-24 max-w-7xl mx-auto px-5 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.4em] text-gold mb-3">What We Do</p>
          <h2 className="font-display text-5xl sm:text-7xl">
            BUILT FOR <span className="text-gold-gradient">BRANDS</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            From branded stories to podcast moments that
            spread overnight — a complete voice & story studio.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { Icon: Radio, t: "Podcast Promotions", d: "Sponsored mentions, brand integrations and podcast collaborations that land." },
            { Icon: Sparkles, t: "Brand Ads Shoot", d: "Photo + video campaigns with a cinematic edge." },
            { Icon: Headphones, t: "Digital Marketing", d: "Strategy, content, paid — your full social engine." },
            { Icon: Mic, t: "Brand Shoots", d: "Reels, identity films and promo content built to convert." },
          ].map(({ Icon, t, d }) => (
            <div
              key={t}
              className="group relative rounded-2xl border border-border bg-card p-6 hover:border-gold/60 hover:-translate-y-1 hover:shadow-gold transition-all duration-300"
            >
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-gold/20 to-neon-red/20 border border-gold/30 flex items-center justify-center mb-5 group-hover:from-gold group-hover:to-gold-glow transition-all">
                <Icon className="h-5 w-5 text-gold group-hover:text-ink transition-colors" />
              </div>
              <h3 className="font-display text-2xl tracking-wider mb-2">{t}</h3>
              <p className="text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-gold font-bold uppercase tracking-widest text-sm hover:gap-4 transition-all"
          >
            Explore All Services <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="py-24 px-5">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-br from-neon-red/20 via-ink-2 to-gold/20 border border-gold/30 p-10 sm:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <SoundWave count={80} />
          </div>
          <div className="relative">
            <h2 className="font-display text-4xl sm:text-6xl">
              GOT A STORY <span className="text-gold-gradient">WORTH HEARING?</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Pitch your brand, your business or yourself. The mic is always warm.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <Link
                to="/podcast"
                className="rounded-full bg-gradient-to-r from-gold to-gold-glow px-7 py-3.5 text-sm font-bold uppercase tracking-widest text-ink hover:shadow-gold"
              >
                Get Featured
              </Link>
              <Link
                to="/podcast"
                className="rounded-full border-2 border-neon-red px-7 py-3.5 text-sm font-bold uppercase tracking-widest text-foreground hover:bg-neon-red/10"
              >
                Become A Sponsor
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
