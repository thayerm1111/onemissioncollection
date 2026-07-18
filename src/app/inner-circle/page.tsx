"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Headphones, BookOpen, Play, MapPin, Lock, ArrowRight, Download, Sparkles,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  LIBRARY, EXPERIENCES, RESOURCES, WEEKLY, TRACKS,
  type Track, type MediaKind,
} from "@/data/innerCircle";

type Access = { allowed: boolean; reason: "affiliate" | "purchase" | null };

function KindIcon({ kind, className = "h-4 w-4" }: { kind: MediaKind; className?: string }) {
  if (kind === "audio") return <Headphones className={className} />;
  if (kind === "video") return <Play className={className} />;
  return <BookOpen className={className} />;
}

const kindLabel: Record<MediaKind, string> = { audio: "Listen", video: "Watch", read: "Read" };

export default function InnerCirclePage() {
  const { user, session, loading, configured } = useAuth();
  const [access, setAccess] = useState<Access | null>(null);
  const [checking, setChecking] = useState(false);
  const [track, setTrack] = useState<Track | "All">("All");

  useEffect(() => {
    const token = session?.access_token;
    if (!token) { setAccess(null); return; }
    let active = true;
    setChecking(true);
    fetch("/api/inner-circle/access", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => { if (active) setAccess({ allowed: !!d.allowed, reason: d.reason ?? null }); })
      .catch(() => { if (active) setAccess({ allowed: false, reason: null }); })
      .finally(() => { if (active) setChecking(false); });
    return () => { active = false; };
  }, [session?.access_token]);

  const items = useMemo(
    () => (track === "All" ? LIBRARY : LIBRARY.filter((i) => i.track === track)),
    [track],
  );

  // ---- Gate states ------------------------------------------------------
  if (loading || (user && checking && !access)) {
    return <Centered><p className="label text-mute">Loading…</p></Centered>;
  }

  if (!configured || !user) {
    return (
      <Centered>
        <Eyebrow>The Inner Circle</Eyebrow>
        <h1 className="mt-3 text-3xl uppercase tracking-widest2 sm:text-4xl">Members Only</h1>
        <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-mute">
          A private space for personal growth — audios, teachings, books, and
          experiences around the world. Sign in to your One Mission account to enter.
        </p>
        <Link href="/account" className="mt-8 inline-flex items-center gap-2 bg-ink px-8 py-4 text-xs uppercase tracking-widest2 text-paper hover:opacity-90">
          Sign In <ArrowRight className="h-4 w-4" />
        </Link>
      </Centered>
    );
  }

  if (access && !access.allowed) {
    return (
      <Centered>
        <div className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-full border border-line">
          <Lock className="h-5 w-5 text-ink" />
        </div>
        <Eyebrow>The Inner Circle</Eyebrow>
        <h1 className="mt-3 text-3xl uppercase tracking-widest2 sm:text-4xl">Access Is Earned</h1>
        <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-mute">
          The Inner Circle unlocks two ways — become part of the movement, and
          the door opens automatically.
        </p>

        <div className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-2">
          <UnlockCard
            href="/featured"
            title="Make it yours"
            body="Purchase anything from the collection and you're in — access unlocks on the email you checked out with."
            cta="Shop the collection"
          />
          <UnlockCard
            href="/affiliate"
            title="Join as an affiliate"
            body="Get approved as a One Mission affiliate and the Inner Circle opens with your membership."
            cta="Become an affiliate"
          />
        </div>

        <p className="mt-8 text-[13px] text-mute">
          Already qualified?{" "}
          <button onClick={() => location.reload()} className="border-b border-ink pb-0.5 text-ink hover:opacity-70">
            Refresh access
          </button>
        </p>
      </Centered>
    );
  }

  // ---- Unlocked ---------------------------------------------------------
  const name = (user.user_metadata?.full_name as string)?.split(" ")[0] || "friend";

  return (
    <div className="mx-auto max-w-site px-5 pb-24 pt-14 sm:px-8">
      {/* Hero */}
      <header className="border-b border-line pb-10 text-center">
        <Eyebrow>The Inner Circle</Eyebrow>
        <h1 className="mx-auto mt-3 max-w-2xl text-3xl uppercase leading-tight tracking-widest2 sm:text-5xl">
          Welcome in, {name}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-mute">
          Your private library for becoming the best version of yourself —
          teachings, audios, reads, and experiences, added to over time.
        </p>
        <p className="mt-4 text-[11px] uppercase tracking-widest2 text-mute">
          {access?.reason === "affiliate" ? "Affiliate Member" : "Founding Member"}
        </p>
      </header>

      {/* Weekly feature */}
      <section className="mt-12">
        <div className="flex flex-col gap-6 bg-ink px-7 py-9 text-paper sm:flex-row sm:items-center sm:px-10 sm:py-11">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest2 text-paper/60">
              <Sparkles className="h-3.5 w-3.5" /> {WEEKLY.eyebrow}
            </div>
            <h2 className="mt-3 text-2xl leading-snug sm:text-3xl">{WEEKLY.title}</h2>
            <p className="mt-3 max-w-lg text-[14px] leading-relaxed text-paper/70">{WEEKLY.summary}</p>
          </div>
          <a
            href={WEEKLY.href}
            className="inline-flex shrink-0 items-center gap-2 bg-paper px-7 py-4 text-xs uppercase tracking-widest2 text-ink hover:opacity-90"
          >
            <KindIcon kind={WEEKLY.kind} /> {kindLabel[WEEKLY.kind]} · {WEEKLY.meta}
          </a>
        </div>
      </section>

      {/* Library */}
      <section className="mt-16">
        <SectionHead title="The Library" sub="Audios, teachings, and reads for the work of becoming." />
        <div className="mt-6 flex flex-wrap gap-2">
          {(["All", ...TRACKS] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTrack(t)}
              className={`px-4 py-2 text-[11px] uppercase tracking-widest2 transition-colors ${
                track === t ? "bg-ink text-paper" : "border border-line text-mute hover:text-ink"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <article key={it.id} className="flex flex-col">
              <div className="mb-4 flex aspect-[4/3] items-center justify-center bg-stone">
                <KindIcon kind={it.kind} className="h-8 w-8 text-ink/40" />
              </div>
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest2 text-mute">
                <KindIcon kind={it.kind} /> {it.track}{it.meta ? ` · ${it.meta}` : ""}
              </div>
              <h3 className="mt-2 text-[16px] leading-snug text-ink">{it.title}</h3>
              <p className="mt-2 flex-1 text-[13px] leading-relaxed text-mute">{it.summary}</p>
              <a
                href={it.href || "#"}
                className="mt-4 inline-flex items-center gap-2 self-start border-b border-ink pb-1 text-[11px] uppercase tracking-widest2 text-ink hover:opacity-70"
              >
                {kindLabel[it.kind]} <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </article>
          ))}
        </div>
      </section>

      {/* Experiences */}
      <section className="mt-20">
        <SectionHead title="Experiences" sub="Gatherings and retreats around the world. Members get first access." />
        <div className="mt-8 divide-y divide-line border-y border-line">
          {EXPERIENCES.map((e) => (
            <div key={e.id} className="flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-xl">
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest2 text-mute">
                  <MapPin className="h-3.5 w-3.5" /> {e.location} · {e.date}
                </div>
                <h3 className="mt-1.5 text-[17px] text-ink">{e.title}</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-mute">{e.blurb}</p>
              </div>
              <a
                href={e.href || "#"}
                className="inline-flex shrink-0 items-center gap-2 self-start bg-ink px-6 py-3 text-[11px] uppercase tracking-widest2 text-paper hover:opacity-90 sm:self-center"
              >
                {e.status === "waitlist" ? "Join waitlist" : e.status === "soon" ? "Notify me" : "RSVP"}
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Resources */}
      <section className="mt-20">
        <SectionHead title="Resources" sub="Guides and worksheets to take with you." />
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {RESOURCES.map((r) => (
            <a
              key={r.id}
              href={r.href || "#"}
              className="group flex flex-col border border-line p-6 transition-colors hover:border-ink"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-widest2 text-mute">{r.format}</span>
                <Download className="h-4 w-4 text-mute group-hover:text-ink" />
              </div>
              <h3 className="mt-3 text-[16px] text-ink">{r.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-mute">{r.blurb}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Affiliate growth band */}
      <section className="mt-20 bg-stone px-7 py-10 text-center sm:px-10">
        <Eyebrow>Grow With Us</Eyebrow>
        <h2 className="mx-auto mt-3 max-w-xl text-2xl uppercase tracking-widest2 sm:text-3xl">
          Turn the mission into momentum
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-[14px] leading-relaxed text-mute">
          Share what changed you and earn as you do it. Everything you need to
          build as a One Mission affiliate.
        </p>
        <Link href="/affiliate" className="mt-7 inline-flex items-center gap-2 bg-ink px-8 py-4 text-xs uppercase tracking-widest2 text-paper hover:opacity-90">
          Affiliate resources <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}

/* ---------- small presentational helpers ---------- */

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-6 py-24 text-center">
      {children}
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="text-[11px] uppercase tracking-[0.3em] text-mute">{children}</div>;
}

function SectionHead({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="max-w-2xl">
      <h2 className="text-xl uppercase tracking-widest2 text-ink sm:text-2xl">{title}</h2>
      <p className="mt-2 text-[14px] leading-relaxed text-mute">{sub}</p>
    </div>
  );
}

function UnlockCard({ href, title, body, cta }: { href: string; title: string; body: string; cta: string }) {
  return (
    <Link href={href} className="group flex flex-col border border-line p-7 text-left transition-colors hover:border-ink">
      <h3 className="text-[15px] uppercase tracking-widest2 text-ink">{title}</h3>
      <p className="mt-3 flex-1 text-[13px] leading-relaxed text-mute">{body}</p>
      <span className="mt-5 inline-flex items-center gap-2 text-[11px] uppercase tracking-widest2 text-ink">
        {cta} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
