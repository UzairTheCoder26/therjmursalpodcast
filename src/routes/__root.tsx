import { Outlet, Link, createRootRoute, HeadContent, Scripts, useRouterState } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-9xl text-gold-gradient">404</h1>
        <h2 className="mt-4 font-display text-3xl tracking-widest">SIGNAL LOST</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This frequency doesn't exist on our airwaves.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-gold to-gold-glow px-6 py-3 text-sm font-bold uppercase tracking-widest text-ink hover:shadow-gold transition-all"
          >
            Back to Studio
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "RJMursal — Voice of the Masses | FM Tadka | Podcast Host" },
      { name: "description", content: "Official site of RJ Mursal — Radio Jockey at FM Tadka and Podcast Host. Book brand ads, podcast features, sponsorships and more." },
      { name: "author", content: "RJMursal" },
      { property: "og:title", content: "RJMursal — Voice of the Masses" },
      { property: "og:description", content: "FM Tadka RJ. Podcast Host. Brand Storyteller." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = path.startsWith("/admin");

  if (isAdmin) {
    return (
      <>
        <Outlet />
        <Toaster theme="dark" position="top-right" richColors />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <SiteFooter />
      <Toaster theme="dark" position="top-right" richColors />
    </div>
  );
}
