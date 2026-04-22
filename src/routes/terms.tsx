import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — RJMursal" },
      { name: "description", content: "Terms and conditions governing services, podcast features and sponsorships at RJMursal." },
    ],
  }),
  component: TermsPage,
});

function renderMarkdown(md: string) {
  // Lightweight markdown: # H1, ## H2, paragraphs
  const blocks = md.split(/\n\n+/);
  return blocks.map((block, i) => {
    const trimmed = block.trim();
    if (trimmed.startsWith("## ")) {
      return <h2 key={i} className="font-display text-3xl text-gold mt-10 mb-3 tracking-wider">{trimmed.slice(3)}</h2>;
    }
    if (trimmed.startsWith("# ")) {
      return <h1 key={i} className="font-display text-5xl mb-6 tracking-wider">{trimmed.slice(2)}</h1>;
    }
    return <p key={i} className="text-muted-foreground leading-relaxed mb-4 whitespace-pre-line">{trimmed}</p>;
  });
}

function TermsPage() {
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    supabase
      .from("site_content")
      .select("value")
      .eq("key", "terms")
      .maybeSingle()
      .then(({ data }) => {
        if (data) setContent((data.value as { content: string }).content);
      });
  }, []);

  return (
    <div className="py-20">
      <section className="max-w-3xl mx-auto px-5 lg:px-8">
        <p className="text-xs uppercase tracking-[0.4em] text-gold mb-3">Legal</p>
        <article className="prose prose-invert max-w-none">
          {content ? renderMarkdown(content) : <p className="text-muted-foreground">Loading…</p>}
        </article>
      </section>
    </div>
  );
}
