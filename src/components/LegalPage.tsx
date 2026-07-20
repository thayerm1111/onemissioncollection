import type { ReactNode } from "react";

/**
 * Shared shell for the legal pages (/terms, /returns, /privacy) so they read
 * as one consistent document set rather than three different templates.
 */
export function LegalPage({
  eyebrow,
  title,
  updated,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-5 pb-28 pt-28 sm:px-8">
      <div className="border-b border-line pb-10">
        <div className="label text-mute">{eyebrow}</div>
        <h1 className="mt-4 text-3xl uppercase tracking-widest2 text-ink sm:text-4xl">
          {title}
        </h1>
        <p className="mt-5 text-[12px] uppercase tracking-wider2 text-mute">
          Last updated {updated}
        </p>
        {intro && (
          <p className="mt-7 text-[15px] leading-relaxed text-ink/80">{intro}</p>
        )}
      </div>

      <div className="legal-body mt-12">{children}</div>

      <div className="mt-20 border-t border-line pt-10 text-[13px] leading-relaxed text-mute">
        <p className="m-0">
          Questions about this page? Email{" "}
          <a href="mailto:support@onemissioncollection.com" className="text-ink underline">
            support@onemissioncollection.com
          </a>
          .
        </p>
        <p className="mt-3 m-0">
          One Mission Collection · 1301 Mount Curve Ave, Minneapolis, MN 55403,
          United States
        </p>
      </div>
    </div>
  );
}

export function Section({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="mb-4 text-[13px] uppercase tracking-wider2 text-ink">
        <span className="mr-3 text-mute">{n}</span>
        {title}
      </h2>
      <div className="space-y-4 text-[15px] leading-relaxed text-ink/80">{children}</div>
    </section>
  );
}
