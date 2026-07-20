import type { Metadata } from "next";

/**
 * /wallpapers — destination for the "Download your wallpapers" button in the
 * welcome email. Files live in public/wallpapers so the URLs are stable and on
 * our own domain. Each card shows a light JPG preview but downloads the
 * full-resolution PNG.
 */

export const metadata: Metadata = {
  title: "Wallpapers — One Mission Collection",
  description:
    "Founders' Club wallpapers for your phone and desktop. Free. A reminder that somebody came looking for you.",
};

type Paper = {
  file: string;
  preview: string;
  name: string;
  note: string;
  size: string;
  kind: "Phone" | "Desktop";
};

const PAPERS: Paper[] = [
  {
    file: "/wallpapers/om-founders-phone.png",
    preview: "/wallpapers/om-founders-phone-preview.jpg",
    name: "Founders' Club — Phone",
    note: "Set low on purpose, so your clock and notifications stay clear.",
    size: "1290 × 2796",
    kind: "Phone",
  },
  {
    file: "/wallpapers/om-founders-desktop.png",
    preview: "/wallpapers/om-founders-desktop-preview.jpg",
    name: "Founders' Club — Desktop",
    note: "Built by visionaries, driven by purpose.",
    size: "2560 × 1440",
    kind: "Desktop",
  },
];

function Card({ p }: { p: Paper }) {
  return (
    <div className="flex flex-col">
      <div className="overflow-hidden border border-line bg-ink">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={p.preview}
          alt={`${p.name} wallpaper`}
          className={
            p.kind === "Phone"
              ? "mx-auto h-[520px] w-auto object-contain"
              : "h-[320px] w-full object-cover"
          }
        />
      </div>

      <div className="mt-5 flex items-start justify-between gap-6">
        <div>
          <div className="text-[15px] text-ink">{p.name}</div>
          <div className="mt-1 text-[13px] leading-relaxed text-mute">{p.note}</div>
          <div className="mt-2 text-[11px] uppercase tracking-wider2 text-mute">
            {p.size}
          </div>
        </div>
        <a
          href={p.file}
          download
          className="shrink-0 border border-ink px-5 py-3 text-[10px] uppercase tracking-widest2 text-ink transition-colors hover:bg-ink hover:text-paper"
        >
          Download
        </a>
      </div>
    </div>
  );
}

export default function WallpapersPage() {
  return (
    <div className="mx-auto max-w-site px-5 pb-28 pt-28 sm:px-8">
      <div className="text-center">
        <div className="label text-mute">Founders&rsquo; Club</div>
        <h1 className="mt-4 text-3xl uppercase tracking-widest2 text-ink sm:text-5xl">
          Wallpapers
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-mute">
          You look at your phone a hundred times a day. Might as well be reminded
          of something that matters.
        </p>
      </div>

      <div className="mx-auto mt-20 grid max-w-4xl gap-16 sm:grid-cols-2">
        {PAPERS.map((p) => (
          <Card key={p.file} p={p} />
        ))}
      </div>

      <div className="mt-24 border-t border-line pt-12 text-center">
        <p className="text-[13px] leading-relaxed text-mute">
          On iPhone: download → open Photos → tap share → &ldquo;Use as
          Wallpaper&rdquo; → Set.
        </p>
        <p
          className="mt-10 text-[15px] uppercase text-ink"
          style={{ letterSpacing: "0.18em" }}
        >
          Somebody&rsquo;s looking for you.
        </p>
      </div>
    </div>
  );
}
