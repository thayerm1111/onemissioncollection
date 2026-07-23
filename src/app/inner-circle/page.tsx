"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Headphones, BookOpen, FileText, Play, MapPin, Lock, ArrowRight, Download,
  Sparkles, Plus, Star, Trash2, Pencil, X, UploadCloud, Loader2, Calendar,
  Gauge, GraduationCap, FolderOpen, CheckSquare, Square, Copy, Image as ImageIcon,
  Users, Link2, Flame, ExternalLink,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { getSupabase } from "@/lib/supabaseClient";

/* -------------------------------------------------------------------------
   INNER CIRCLE — customer + affiliate back office.
   Owners upload/manage everything and mark affiliates. Live UpPromote stats
   connect later; referral link/code are owner-set per affiliate for now.
------------------------------------------------------------------------- */

const OWNERS = [
  "thayerm1111@gmail.com", "wilson55082@gmail.com",
  "wilson55082@yahoo.com", "onemissioncollection@yahoo.com",
];
const UPPROMOTE_PORTAL = "https://app.uppromote.com/";

type Kind = "audio" | "video" | "pdf" | "image" | "copy";
type Audience = "customer" | "affiliate";

const CUSTOMER_CATS = [
  ["identity", "Identity"], ["purpose", "Purpose"], ["faith", "Faith"],
  ["mindset", "Mindset"], ["confidence", "Confidence"], ["discipline", "Discipline"],
  ["leadership", "Leadership"], ["goals", "Goal Setting"], ["health", "Health & Performance"],
  ["relationships", "Relationships"], ["finance", "Financial"], ["adversity", "Overcoming Adversity"],
  ["habits", "Better Habits"],
] as const;
const AFFILIATE_CATS = [
  ["start_here", "Start Here"], ["sales", "Sales Academy"],
  ["social", "Social Media"], ["leadership_aff", "Leadership"], ["resources", "Resources"],
] as const;
const ACADEMY_TRACKS = ["start_here", "sales", "social", "leadership_aff"];
const allLabel = (c: string) =>
  [...CUSTOMER_CATS, ...AFFILIATE_CATS].find(([k]) => k === c)?.[1] ?? c;

const KINDS: { key: Kind; label: string; accept: string; icon: typeof Headphones }[] = [
  { key: "audio", label: "Audio", accept: "audio/*", icon: Headphones },
  { key: "video", label: "Video", accept: "video/*", icon: Play },
  { key: "pdf", label: "PDF", accept: "application/pdf", icon: FileText },
  { key: "image", label: "Image", accept: "image/*", icon: ImageIcon },
  { key: "copy", label: "Copy / Script", accept: "*/*", icon: Copy },
];

type Item = {
  id: string; audience: Audience; category: string; kind: Kind;
  title: string; author: string | null; meta: string | null;
  summary: string | null; body: string | null; file_url: string | null;
  featured: boolean; sort: number; created_at: string;
};
type Affiliate = { email: string; referral_url: string | null; discount_code: string | null; level: string | null };
type Access = { allowed: boolean; reason: "affiliate" | "purchase" | null };
type Tab = "command" | "featured" | "development" | "academy" | "resources" | "daily" | "experiences";

const EXPERIENCES = [
  { title: "The Founders Retreat", blurb: "A weekend to reset, refocus, and build with people on the same mission." },
  { title: "One Mission Live", blurb: "An evening of teaching, worship, and real conversation — in person." },
  { title: "Growth Intensive", blurb: "A focused workshop on discipline, purpose, and the habits that carry you." },
];
const DAILY_ITEMS = [
  ["post", "Post one piece of content"], ["stories", "Share three stories"],
  ["convos", "Start five conversations"], ["followup", "Follow up with five people"],
  ["engage", "Engage with ten accounts"], ["study", "Study one training lesson"],
  ["track", "Track your results"], ["recognize", "Recognize a customer or teammate"],
] as const;

function copyText(t: string) { try { navigator.clipboard.writeText(t); } catch { /* noop */ } }
const todayKey = () => new Date().toISOString().slice(0, 10);

/* ---------------- Media ---------------- */
function Media({ item }: { item: Item }) {
  if (item.kind === "copy") {
    if (!item.body) return null;
    return (
      <div className="mt-3">
        <pre className="whitespace-pre-wrap border border-line bg-stone/40 p-3 text-[13px] leading-relaxed text-ink/85">{item.body}</pre>
        <button onClick={() => copyText(item.body || "")} className="mt-2 inline-flex items-center gap-1.5 border border-ink px-3 py-1.5 text-[10px] uppercase tracking-widest2 hover:bg-ink hover:text-paper"><Copy className="h-3.5 w-3.5" /> Copy</button>
      </div>
    );
  }
  if (!item.file_url) return null;
  if (item.kind === "audio") return <audio controls preload="none" src={item.file_url} className="mt-3 w-full">Audio not supported.</audio>;
  if (item.kind === "video") return <video controls preload="none" src={item.file_url} className="mt-3 w-full rounded-sm bg-ink" />;
  if (item.kind === "image")
    return (
      <div className="mt-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.file_url} alt={item.title} className="w-full max-w-md rounded-sm border border-line" />
        <a href={item.file_url} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1.5 border border-ink px-3 py-1.5 text-[10px] uppercase tracking-widest2 hover:bg-ink hover:text-paper"><Download className="h-3.5 w-3.5" /> Download</a>
      </div>
    );
  return <a href={item.file_url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 border border-ink px-4 py-2 text-[11px] uppercase tracking-widest2 hover:bg-ink hover:text-paper"><Download className="h-4 w-4" /> Open PDF</a>;
}

export default function InnerCirclePage() {
  const { user, session, loading } = useAuth();
  const email = (user?.email ?? "").toLowerCase() || null;
  const isOwner = Boolean(email && OWNERS.includes(email));

  const [access, setAccess] = useState<Access | null>(null);
  const [checking, setChecking] = useState(false);
  const [tab, setTab] = useState<Tab>("featured");
  const [cat, setCat] = useState<string>("all");

  const [items, setItems] = useState<Item[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [editing, setEditing] = useState<Item | null>(null);
  const [adding, setAdding] = useState(false);
  const [managingAff, setManagingAff] = useState(false);

  const [myAff, setMyAff] = useState<Affiliate | null>(null);
  const [isAff, setIsAff] = useState(false);

  useEffect(() => {
    const token = session?.access_token;
    if (!token) { setAccess(null); return; }
    let active = true;
    setChecking(true);
    fetch("/api/inner-circle/access", { method: "POST", headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => { if (active) setAccess({ allowed: !!d.allowed, reason: d.reason ?? null }); })
      .catch(() => { if (active) setAccess({ allowed: false, reason: null }); })
      .finally(() => { if (active) setChecking(false); });
    return () => { active = false; };
  }, [session?.access_token]);

  const allowed = Boolean(access?.allowed) || isOwner;

  // Am I an affiliate? RLS returns only my own affiliate row.
  useEffect(() => {
    const sb = getSupabase();
    if (!sb || !session) return;
    let active = true;
    sb.from("omc_affiliates").select("*").eq("email", email).maybeSingle().then(({ data }) => {
      if (!active) return;
      setMyAff((data as Affiliate) ?? null);
      setIsAff(Boolean(data) || isOwner);
    });
    return () => { active = false; };
  }, [session, email, isOwner]);
  const isAffiliate = isAff || isOwner;

  const loadItems = useCallback(async () => {
    const sb = getSupabase();
    if (!sb) return;
    setLoadingItems(true);
    const { data } = await sb.from("omc_inner_circle_content").select("*")
      .order("sort", { ascending: true }).order("created_at", { ascending: false });
    setItems((data as Item[]) ?? []);
    setLoadingItems(false);
  }, []);
  useEffect(() => { if (allowed) loadItems(); }, [allowed, loadItems]);

  const customerItems = useMemo(() => items.filter((i) => i.audience === "customer"), [items]);
  const academyItems = useMemo(() => items.filter((i) => i.audience === "affiliate" && ACADEMY_TRACKS.includes(i.category)), [items]);
  const resourceItems = useMemo(() => items.filter((i) => i.audience === "affiliate" && i.category === "resources"), [items]);
  const featured = useMemo(() => customerItems.find((i) => i.featured) ?? customerItems[0] ?? null, [customerItems]);
  const devCats = useMemo(() => {
    const s = new Set(customerItems.map((i) => i.category));
    return CUSTOMER_CATS.filter(([k]) => s.has(k));
  }, [customerItems]);
  const devItems = useMemo(() => (cat === "all" ? customerItems : customerItems.filter((i) => i.category === cat)), [customerItems, cat]);

  async function makeFeatured(id: string) {
    const sb = getSupabase(); if (!sb) return;
    await sb.from("omc_inner_circle_content").update({ featured: false }).neq("id", id);
    await sb.from("omc_inner_circle_content").update({ featured: true }).eq("id", id);
    await loadItems();
  }
  async function removeItem(id: string) {
    const sb = getSupabase(); if (!sb) return;
    if (!confirm("Delete this item? This cannot be undone.")) return;
    await sb.from("omc_inner_circle_content").delete().eq("id", id);
    await loadItems();
  }

  /* ---- gate states ---- */
  if (loading || (session && checking && access === null && !isOwner)) {
    return <Shell><Centered><Loader2 className="h-5 w-5 animate-spin text-mute" /></Centered></Shell>;
  }
  if (!session && !loading) {
    return (<Shell><Centered>
      <Lock className="h-6 w-6 text-mute" />
      <h1 className="mt-4 text-2xl">The Inner Circle</h1>
      <p className="mt-2 max-w-sm text-[14px] text-mute">A members-only space for growth — teachings, interviews, and daily motivation. Sign in to enter.</p>
      <Link href="/account" className="mt-6 inline-flex items-center gap-2 bg-ink px-6 py-3 text-xs uppercase tracking-widest2 text-paper hover:opacity-90">Sign in <ArrowRight className="h-4 w-4" /></Link>
    </Centered></Shell>);
  }
  if (!allowed) {
    return (<Shell><Centered>
      <Lock className="h-6 w-6 text-mute" />
      <h1 className="mt-4 text-2xl">You&apos;re almost in</h1>
      <p className="mt-2 max-w-sm text-[14px] text-mute">The Inner Circle unlocks once you&apos;ve made a purchase or joined as an affiliate. Grab a piece from the collection and it opens automatically.</p>
      <Link href="/featured" className="mt-6 inline-flex items-center gap-2 bg-ink px-6 py-3 text-xs uppercase tracking-widest2 text-paper hover:opacity-90">Shop the collection <ArrowRight className="h-4 w-4" /></Link>
    </Centered></Shell>);
  }

  const TABS: { key: Tab; label: string; icon: typeof Headphones; aff?: boolean }[] = [
    { key: "command", label: "Command Center", icon: Gauge, aff: true },
    { key: "featured", label: "This Week", icon: Star },
    { key: "development", label: "Development", icon: BookOpen },
    { key: "academy", label: "Academy", icon: GraduationCap, aff: true },
    { key: "resources", label: "Resources", icon: FolderOpen, aff: true },
    { key: "daily", label: "Daily Actions", icon: CheckSquare, aff: true },
    { key: "experiences", label: "Experiences", icon: MapPin },
  ];
  const visibleTabs = TABS.filter((t) => !t.aff || isAffiliate);

  return (
    <Shell>
      <div className="mx-auto max-w-6xl px-5 py-10">
        <header className="mb-8">
          <p className="label text-mute">One Mission {isAffiliate && <span className="ml-2 rounded-sm bg-sky-500 px-1.5 py-0.5 text-[9px] tracking-widest2 text-white">Affiliate</span>}</p>
          <h1 className="mt-1 text-3xl md:text-4xl">The Inner Circle</h1>
          <p className="mt-2 text-[14px] text-mute">Your back office for {isAffiliate ? "growth and building the mission." : "personal development."}</p>
        </header>

        <div className="mb-6 md:hidden">
          <select value={tab} onChange={(e) => setTab(e.target.value as Tab)} className="w-full border border-line bg-paper px-4 py-3 text-sm uppercase tracking-wider2 text-ink">
            {visibleTabs.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
          </select>
        </div>

        <div className="flex gap-8">
          <aside className="hidden w-52 flex-shrink-0 md:block">
            <nav className="sticky top-24 space-y-1">
              {visibleTabs.map((t) => {
                const Icon = t.icon; const on = tab === t.key;
                return (
                  <button key={t.key} onClick={() => setTab(t.key)}
                    className={`flex w-full items-center gap-3 border-l-2 px-4 py-3 text-left text-[13px] uppercase tracking-wider2 transition-colors ${on ? "border-sky-500 bg-sky-50 text-ink" : "border-transparent text-mute hover:text-ink"}`}>
                    <Icon className="h-4 w-4" /> {t.label}
                  </button>
                );
              })}
              {isOwner && (
                <div className="mt-4 space-y-1">
                  <button onClick={() => setAdding(true)} className="flex w-full items-center justify-center gap-2 bg-ink px-4 py-3 text-[11px] uppercase tracking-widest2 text-paper hover:opacity-90"><Plus className="h-4 w-4" /> Add content</button>
                  <button onClick={() => setManagingAff(true)} className="flex w-full items-center justify-center gap-2 border border-line px-4 py-2.5 text-[11px] uppercase tracking-widest2 text-ink hover:border-ink"><Users className="h-4 w-4" /> Affiliates</button>
                </div>
              )}
            </nav>
          </aside>

          <main className="min-w-0 flex-1">
            {isOwner && (
              <div className="mb-6 flex flex-wrap items-center justify-between gap-2 border border-sky-200 bg-sky-50 px-4 py-3">
                <span className="label-sm text-mute">Admin — upload &amp; manage everything, and mark affiliates.</span>
                <div className="flex gap-3 md:hidden">
                  <button onClick={() => setAdding(true)} className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest2 text-ink"><Plus className="h-4 w-4" /> Add</button>
                  <button onClick={() => setManagingAff(true)} className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest2 text-ink"><Users className="h-4 w-4" /> Affiliates</button>
                </div>
              </div>
            )}

            {tab === "command" && <CommandCenter aff={myAff} isOwner={isOwner} />}
            {tab === "featured" && <FeaturedView featured={featured} isOwner={isOwner} onManage={() => setTab("development")} />}
            {tab === "development" && <ListView title="Development" items={devItems} cats={devCats.map(([k, l]) => ({ key: k, label: l }))} cat={cat} setCat={setCat} loading={loadingItems} isOwner={isOwner} onFeature={makeFeatured} onDelete={removeItem} onEdit={setEditing} emptyOwner="Nothing here yet. Use “Add content” to upload your first audio, video, or PDF." emptyMember="New teachings are on the way. Check back soon." />}
            {tab === "academy" && <ListView title="Affiliate Academy" items={academyItems} cats={AFFILIATE_CATS.filter(([k]) => ACADEMY_TRACKS.includes(k)).map(([k, l]) => ({ key: k, label: l }))} cat={cat} setCat={setCat} loading={loadingItems} isOwner={isOwner} onFeature={makeFeatured} onDelete={removeItem} onEdit={setEditing} emptyOwner="No training yet. Add content with audience “Affiliate” and a track (Start Here, Sales, Social, Leadership)." emptyMember="Your training is being built. Check back soon." />}
            {tab === "resources" && <ResourcesView items={resourceItems} loading={loadingItems} isOwner={isOwner} onDelete={removeItem} onEdit={setEditing} />}
            {tab === "daily" && <DailyActions email={email} />}
            {tab === "experiences" && <ExperiencesView />}
          </main>
        </div>
      </div>

      {(adding || editing) && <ContentForm existing={editing} onClose={() => { setAdding(false); setEditing(null); }} onSaved={async () => { setAdding(false); setEditing(null); await loadItems(); }} />}
      {managingAff && <ManageAffiliates onClose={() => setManagingAff(false)} />}
    </Shell>
  );
}

/* ---------------- Command Center ---------------- */
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-line bg-paper p-4">
      <p className="label-sm text-mute">{label}</p>
      <p className="mt-1 text-2xl text-ink">{value}</p>
    </div>
  );
}
function CommandCenter({ aff, isOwner }: { aff: Affiliate | null; isOwner: boolean }) {
  return (
    <section>
      <p className="label text-mute">Command Center</p>
      <div className="mt-4 border border-line bg-gradient-to-br from-sky-50 to-stone/40 p-6">
        <p className="label-sm text-mute">Your referral link</p>
        {aff?.referral_url ? (
          <div className="mt-2 flex items-center gap-2">
            <input readOnly value={aff.referral_url} className="min-w-0 flex-1 border border-line bg-white px-3 py-2 text-[13px] text-ink" />
            <button onClick={() => copyText(aff.referral_url || "")} className="flex items-center gap-1.5 bg-ink px-3 py-2 text-[10px] uppercase tracking-widest2 text-paper hover:opacity-90"><Copy className="h-3.5 w-3.5" /> Copy</button>
          </div>
        ) : <p className="mt-1 text-[13px] text-mute">{isOwner ? "Set this affiliate's link in Affiliates." : "Your link is being set up. Check back soon."}</p>}
        <div className="mt-4 flex flex-wrap items-center gap-6">
          <div><p className="label-sm text-mute">Discount code</p><p className="mt-1 text-lg text-ink">{aff?.discount_code || "—"}</p></div>
          <div><p className="label-sm text-mute">Level</p><p className="mt-1 text-lg text-ink">{aff?.level || "Mission Starter"}</p></div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Clicks" value="—" /><Stat label="Orders" value="—" /><Stat label="Sales" value="—" /><Stat label="Commission" value="—" />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3 rounded-sm border border-dashed border-line px-4 py-3">
        <Link2 className="h-4 w-4 text-mute" />
        <span className="text-[13px] text-mute">Live stats connect with UpPromote — coming soon.</span>
        <a href={UPPROMOTE_PORTAL} target="_blank" rel="noreferrer" className="ml-auto inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest2 text-ink underline hover:opacity-70">Open UpPromote <ExternalLink className="h-3.5 w-3.5" /></a>
      </div>

      <div className="mt-6">
        <p className="label text-mute">Recommended next actions</p>
        <ul className="mt-3 space-y-2 text-[14px] text-ink/80">
          <li className="flex gap-2"><ArrowRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-sky-500" /> Finish the Start Here track in the Academy.</li>
          <li className="flex gap-2"><ArrowRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-sky-500" /> Post one piece of content and share your link.</li>
          <li className="flex gap-2"><ArrowRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-sky-500" /> Check off today&apos;s Daily Actions to keep your streak.</li>
        </ul>
      </div>
    </section>
  );
}

/* ---------------- Featured ---------------- */
function FeaturedView({ featured, isOwner, onManage }: { featured: Item | null; isOwner: boolean; onManage: () => void }) {
  return (
    <section>
      <p className="label text-mute">This Week</p>
      {!featured ? (
        <EmptyState text={isOwner ? "No featured item yet. Add content, then tap the star to feature it here." : "This week's teaching is being prepared. Check back soon."} />
      ) : (
        <div className="mt-4 border border-line bg-gradient-to-br from-sky-50 to-stone/40 p-6 md:p-8">
          <div className="flex items-center gap-2 text-mute">
            {featured.kind === "audio" ? <Headphones className="h-4 w-4" /> : featured.kind === "video" ? <Play className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
            <span className="label-sm">{allLabel(featured.category)}{featured.meta ? ` · ${featured.meta}` : ""}</span>
          </div>
          <h2 className="mt-3 text-2xl md:text-3xl">{featured.title}</h2>
          {featured.author && <p className="mt-1 text-[13px] text-mute">{featured.author}</p>}
          {featured.summary && <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink/80">{featured.summary}</p>}
          <Media item={featured} />
        </div>
      )}
      {isOwner && <button onClick={onManage} className="mt-4 text-[12px] uppercase tracking-widest2 text-mute underline hover:text-ink">Manage content →</button>}
    </section>
  );
}

/* ---------------- Generic list (Development + Academy) ---------------- */
function ItemCard({ it, isOwner, onFeature, onDelete, onEdit }: { it: Item; isOwner: boolean; onFeature?: (id: string) => void; onDelete: (id: string) => void; onEdit: (it: Item) => void }) {
  return (
    <article className="border border-line bg-paper p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-mute">
            {it.kind === "audio" ? <Headphones className="h-3.5 w-3.5" /> : it.kind === "video" ? <Play className="h-3.5 w-3.5" /> : it.kind === "image" ? <ImageIcon className="h-3.5 w-3.5" /> : it.kind === "copy" ? <Copy className="h-3.5 w-3.5" /> : <FileText className="h-3.5 w-3.5" />}
            <span className="label-sm">{allLabel(it.category)}{it.meta ? ` · ${it.meta}` : ""}</span>
            {it.featured && <span className="rounded-sm bg-sky-500 px-1.5 py-0.5 text-[9px] uppercase tracking-widest2 text-white">This week</span>}
          </div>
          <h3 className="mt-2 text-lg leading-snug text-ink">{it.title}</h3>
          {it.author && <p className="text-[12px] text-mute">{it.author}</p>}
          {it.summary && <p className="mt-2 text-[14px] leading-relaxed text-ink/75">{it.summary}</p>}
        </div>
        {isOwner && (
          <div className="flex flex-shrink-0 items-center gap-2 text-mute">
            {onFeature && <button title="Feature this week" onClick={() => onFeature(it.id)} className="hover:text-ink"><Star className={`h-4 w-4 ${it.featured ? "fill-sky-500 text-sky-500" : ""}`} /></button>}
            <button title="Edit" onClick={() => onEdit(it)} className="hover:text-ink"><Pencil className="h-4 w-4" /></button>
            <button title="Delete" onClick={() => onDelete(it.id)} className="hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
          </div>
        )}
      </div>
      <Media item={it} />
    </article>
  );
}
function ListView({ title, items, cats, cat, setCat, loading, isOwner, onFeature, onDelete, onEdit, emptyOwner, emptyMember }: {
  title: string; items: Item[]; cats: { key: string; label: string }[]; cat: string; setCat: (c: string) => void;
  loading: boolean; isOwner: boolean; onFeature?: (id: string) => void; onDelete: (id: string) => void; onEdit: (it: Item) => void;
  emptyOwner: string; emptyMember: string;
}) {
  const shown = cat === "all" ? items : items.filter((i) => i.category === cat);
  return (
    <section>
      <p className="label text-mute">{title}</p>
      {cats.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {[{ key: "all", label: "All" }, ...cats].map((c) => (
            <button key={c.key} onClick={() => setCat(c.key)} className={`border px-3.5 py-2 text-[11px] uppercase tracking-wider2 transition-colors ${cat === c.key ? "border-ink bg-ink text-paper" : "border-line text-mute hover:border-ink hover:text-ink"}`}>{c.label}</button>
          ))}
        </div>
      )}
      {loading ? <div className="mt-10 flex justify-center"><Loader2 className="h-5 w-5 animate-spin text-mute" /></div>
        : shown.length === 0 ? <EmptyState text={isOwner ? emptyOwner : emptyMember} />
          : <div className="mt-6 space-y-4">{shown.map((it) => <ItemCard key={it.id} it={it} isOwner={isOwner} onFeature={onFeature} onDelete={onDelete} onEdit={onEdit} />)}</div>}
    </section>
  );
}

/* ---------------- Resources ---------------- */
function ResourcesView({ items, loading, isOwner, onDelete, onEdit }: { items: Item[]; loading: boolean; isOwner: boolean; onDelete: (id: string) => void; onEdit: (it: Item) => void }) {
  const [kind, setKind] = useState<string>("all");
  const kinds = useMemo(() => Array.from(new Set(items.map((i) => i.kind))), [items]);
  const shown = kind === "all" ? items : items.filter((i) => i.kind === kind);
  return (
    <section>
      <p className="label text-mute">Resource Library</p>
      <p className="mt-1 text-[13px] text-mute">Photos, videos, captions, and scripts to share the mission.</p>
      {kinds.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {["all", ...kinds].map((k) => (
            <button key={k} onClick={() => setKind(k)} className={`border px-3.5 py-2 text-[11px] uppercase tracking-wider2 ${kind === k ? "border-ink bg-ink text-paper" : "border-line text-mute hover:border-ink"}`}>{k === "all" ? "All" : (KINDS.find((x) => x.key === k)?.label ?? k)}</button>
          ))}
        </div>
      )}
      {loading ? <div className="mt-10 flex justify-center"><Loader2 className="h-5 w-5 animate-spin text-mute" /></div>
        : shown.length === 0 ? <EmptyState text={isOwner ? "No resources yet. Add content with audience “Affiliate” and category “Resources” — images, captions, or scripts." : "Marketing resources are on the way."} />
          : <div className="mt-6 space-y-4">{shown.map((it) => <ItemCard key={it.id} it={it} isOwner={isOwner} onDelete={onDelete} onEdit={onEdit} />)}</div>}
    </section>
  );
}

/* ---------------- Daily Actions ---------------- */
function DailyActions({ email }: { email: string | null }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [streak, setStreak] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sb = getSupabase();
    if (!sb || !email) return;
    let active = true;
    (async () => {
      const since = new Date(Date.now() - 35 * 864e5).toISOString().slice(0, 10);
      const { data } = await sb.from("omc_daily_actions").select("*").gte("day", since).order("day", { ascending: false });
      if (!active) return;
      const rows = (data as { day: string; items: Record<string, boolean> }[]) ?? [];
      const today = rows.find((r) => r.day === todayKey());
      setChecked(today?.items ?? {});
      // streak: consecutive complete days ending today or yesterday
      const complete = (it: Record<string, boolean>) => DAILY_ITEMS.every(([k]) => it?.[k]);
      const done = new Set(rows.filter((r) => complete(r.items)).map((r) => r.day));
      let s = 0; const d = new Date();
      if (!done.has(todayKey())) d.setDate(d.getDate() - 1);
      for (;;) { const key = d.toISOString().slice(0, 10); if (done.has(key)) { s++; d.setDate(d.getDate() - 1); } else break; }
      setStreak(s); setReady(true);
    })();
    return () => { active = false; };
  }, [email]);

  async function toggle(k: string) {
    const next = { ...checked, [k]: !checked[k] };
    setChecked(next);
    const sb = getSupabase();
    if (sb && email) await sb.from("omc_daily_actions").upsert({ email, day: todayKey(), items: next, updated_at: new Date().toISOString() });
  }
  const doneCount = DAILY_ITEMS.filter(([k]) => checked[k]).length;

  return (
    <section>
      <div className="flex items-center justify-between">
        <p className="label text-mute">Daily Actions</p>
        <span className="inline-flex items-center gap-1.5 text-[13px] text-ink"><Flame className={`h-4 w-4 ${streak > 0 ? "text-orange-500" : "text-mute"}`} /> {streak} day streak</span>
      </div>
      <p className="mt-1 text-[13px] text-mute">{doneCount}/{DAILY_ITEMS.length} done today. Consistency compounds.</p>
      <div className="mt-4 space-y-2">
        {!ready ? <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-mute" /></div> : DAILY_ITEMS.map(([k, label]) => (
          <button key={k} onClick={() => toggle(k)} className={`flex w-full items-center gap-3 border px-4 py-3 text-left text-[14px] transition-colors ${checked[k] ? "border-sky-300 bg-sky-50 text-ink" : "border-line text-ink/80 hover:border-ink"}`}>
            {checked[k] ? <CheckSquare className="h-5 w-5 flex-shrink-0 text-sky-500" /> : <Square className="h-5 w-5 flex-shrink-0 text-mute" />}
            <span className={checked[k] ? "line-through opacity-70" : ""}>{label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Experiences ---------------- */
function ExperiencesView() {
  return (
    <section>
      <p className="label text-mute">Experiences</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {EXPERIENCES.map((e) => (
          <div key={e.title} className="border border-line bg-gradient-to-br from-sky-50 to-stone/30 p-6">
            <span className="inline-flex items-center gap-1.5 rounded-sm bg-ink px-2 py-1 text-[9px] uppercase tracking-widest2 text-paper"><Calendar className="h-3 w-3" /> Announcing soon</span>
            <h3 className="mt-3 text-xl text-ink">{e.title}</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-mute">{e.blurb}</p>
          </div>
        ))}
      </div>
      <p className="mt-6 text-[13px] text-mute">Dates and locations are being finalized. Members will be the first to know.</p>
    </section>
  );
}

/* ---------------- Owner: content form ---------------- */
function ContentForm({ existing, onClose, onSaved }: { existing: Item | null; onClose: () => void; onSaved: () => void }) {
  const [audience, setAudience] = useState<Audience>(existing?.audience ?? "customer");
  const [category, setCategory] = useState<string>(existing?.category ?? "identity");
  const [kind, setKind] = useState<Kind>(existing?.kind ?? "audio");
  const [title, setTitle] = useState(existing?.title ?? "");
  const [author, setAuthor] = useState(existing?.author ?? "");
  const [meta, setMeta] = useState(existing?.meta ?? "");
  const [summary, setSummary] = useState(existing?.summary ?? "");
  const [body, setBody] = useState(existing?.body ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const cats = audience === "customer" ? CUSTOMER_CATS : AFFILIATE_CATS;
  useEffect(() => { if (!cats.find(([k]) => k === category)) setCategory(cats[0][0]); }, [audience]); // eslint-disable-line
  const accept = KINDS.find((k) => k.key === kind)?.accept ?? "*/*";
  const needsFile = kind !== "copy";

  async function save() {
    setErr(null);
    if (!title.trim()) { setErr("Give it a title."); return; }
    if (kind === "copy" && !body.trim()) { setErr("Add the copy/script text."); return; }
    if (needsFile && !existing && !file) { setErr("Choose a file to upload."); return; }
    const sb = getSupabase();
    if (!sb) { setErr("Not connected."); return; }
    setBusy(true);
    try {
      let file_url = existing?.file_url ?? null;
      if (file) {
        const clean = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `${audience}/${category}/${Date.now()}-${clean}`;
        const up = await sb.storage.from("inner-circle").upload(path, file, { upsert: false });
        if (up.error) throw up.error;
        file_url = sb.storage.from("inner-circle").getPublicUrl(path).data.publicUrl;
      }
      const row = {
        audience, category, kind, title: title.trim(),
        author: author.trim() || null, meta: meta.trim() || null,
        summary: summary.trim() || null, body: kind === "copy" ? body.trim() : (body.trim() || null),
        file_url,
      };
      const res = existing
        ? await sb.from("omc_inner_circle_content").update(row).eq("id", existing.id)
        : await sb.from("omc_inner_circle_content").insert(row);
      if (res.error) throw res.error;
      onSaved();
    } catch (e: unknown) { setErr(e instanceof Error ? e.message : "Something went wrong."); setBusy(false); }
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-ink/40 sm:items-center sm:p-4" onClick={onClose}>
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto bg-paper p-6 shadow-2xl sm:border sm:border-line" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg">{existing ? "Edit item" : "Add content"}</h2>
          <button onClick={onClose} className="text-mute hover:text-ink"><X className="h-5 w-5" /></button>
        </div>

        <label className="mt-5 block label-sm text-mute">Audience</label>
        <div className="mt-2 flex gap-2">
          {(["customer", "affiliate"] as Audience[]).map((a) => (
            <button key={a} onClick={() => setAudience(a)} className={`flex-1 border px-3 py-2 text-[11px] uppercase tracking-wider2 ${audience === a ? "border-ink bg-ink text-paper" : "border-line text-mute hover:border-ink"}`}>{a === "customer" ? "Customer" : "Affiliate"}</button>
          ))}
        </div>

        <label className="mt-4 block label-sm text-mute">Type</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {KINDS.map((k) => { const Icon = k.icon; return (
            <button key={k.key} onClick={() => setKind(k.key)} className={`flex items-center gap-1.5 border px-3 py-1.5 text-[11px] uppercase tracking-wider2 ${kind === k.key ? "border-ink bg-ink text-paper" : "border-line text-mute hover:border-ink"}`}><Icon className="h-3.5 w-3.5" /> {k.label}</button>
          ); })}
        </div>

        <label className="mt-4 block label-sm text-mute">Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="omc-input mt-2">
          {cats.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
        </select>

        <Field label="Title"><input value={title} onChange={(e) => setTitle(e.target.value)} className="omc-input" placeholder="e.g. Discipline Is Self-Respect" /></Field>
        <Field label="Speaker / Author (optional)"><input value={author} onChange={(e) => setAuthor(e.target.value)} className="omc-input" placeholder="One Mission" /></Field>
        <Field label="Length / label (optional)"><input value={meta} onChange={(e) => setMeta(e.target.value)} className="omc-input" placeholder={kind === "pdf" ? "12 pages" : kind === "copy" ? "Caption" : "14 min"} /></Field>
        <Field label="Summary (optional)"><textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={2} className="omc-input resize-none" placeholder="A sentence or two about it." /></Field>

        {kind === "copy" ? (
          <Field label="Copy / script text"><textarea value={body} onChange={(e) => setBody(e.target.value)} rows={5} className="omc-input resize-none" placeholder="Paste the caption, DM script, or template here." /></Field>
        ) : (
          <>
            <label className="mt-4 block label-sm text-mute">File {existing && "(leave empty to keep current)"}</label>
            <button onClick={() => fileRef.current?.click()} className="mt-2 flex w-full items-center justify-center gap-2 border border-dashed border-line py-6 text-[12px] uppercase tracking-widest2 text-mute hover:border-ink hover:text-ink"><UploadCloud className="h-5 w-5" /> {file ? file.name : `Choose ${kind} file`}</button>
            <input ref={fileRef} type="file" accept={accept} className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </>
        )}

        {err && <p className="mt-3 text-[12px] text-red-600">{err}</p>}
        <button onClick={save} disabled={busy} className="mt-5 flex w-full items-center justify-center gap-2 bg-ink px-6 py-3.5 text-xs uppercase tracking-widest2 text-paper hover:opacity-90 disabled:opacity-50">
          {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : (existing ? "Save changes" : "Publish")}
        </button>
      </div>
      <style jsx>{`
        :global(.omc-input){width:100%;border:1px solid #e5e2dd;background:#fff;padding:.6rem .75rem;font-size:14px;color:#17140f;margin-top:.4rem}
        :global(.omc-input:focus){outline:none;border-color:#17140f}
      `}</style>
    </div>
  );
}

/* ---------------- Owner: manage affiliates ---------------- */
function ManageAffiliates({ onClose }: { onClose: () => void }) {
  const [list, setList] = useState<Affiliate[]>([]);
  const [email, setEmail] = useState("");
  const [referral, setReferral] = useState("");
  const [code, setCode] = useState("");
  const [level, setLevel] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    const sb = getSupabase(); if (!sb) return;
    const { data } = await sb.from("omc_affiliates").select("*").order("created_at", { ascending: false });
    setList((data as Affiliate[]) ?? []);
  }, []);
  useEffect(() => { load(); }, [load]);

  async function add() {
    setErr(null);
    if (!email.trim()) { setErr("Enter an email."); return; }
    const sb = getSupabase(); if (!sb) return;
    setBusy(true);
    const { error } = await sb.from("omc_affiliates").upsert({
      email: email.trim().toLowerCase(), referral_url: referral.trim() || null,
      discount_code: code.trim() || null, level: level.trim() || null,
    });
    setBusy(false);
    if (error) { setErr(error.message); return; }
    setEmail(""); setReferral(""); setCode(""); setLevel("");
    await load();
  }
  async function remove(e: string) {
    const sb = getSupabase(); if (!sb) return;
    if (!confirm(`Remove affiliate access for ${e}?`)) return;
    await sb.from("omc_affiliates").delete().eq("email", e);
    await load();
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-ink/40 sm:items-center sm:p-4" onClick={onClose}>
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto bg-paper p-6 shadow-2xl sm:border sm:border-line" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg">Affiliates</h2>
          <button onClick={onClose} className="text-mute hover:text-ink"><X className="h-5 w-5" /></button>
        </div>
        <p className="mt-1 text-[13px] text-mute">Grant affiliate access and set each person&apos;s referral link + code. (UpPromote auto-sync connects later.)</p>

        <div className="mt-4 border border-line p-4">
          <Field label="Email"><input value={email} onChange={(e) => setEmail(e.target.value)} className="omc-input" placeholder="name@email.com" /></Field>
          <Field label="Referral link (optional)"><input value={referral} onChange={(e) => setReferral(e.target.value)} className="omc-input" placeholder="https://onemissioncollection.com/?ref=..." /></Field>
          <div className="flex gap-3">
            <div className="flex-1"><Field label="Discount code"><input value={code} onChange={(e) => setCode(e.target.value)} className="omc-input" placeholder="NAME15" /></Field></div>
            <div className="flex-1"><Field label="Level"><input value={level} onChange={(e) => setLevel(e.target.value)} className="omc-input" placeholder="Mission Starter" /></Field></div>
          </div>
          {err && <p className="mt-3 text-[12px] text-red-600">{err}</p>}
          <button onClick={add} disabled={busy} className="mt-4 flex w-full items-center justify-center gap-2 bg-ink px-6 py-3 text-xs uppercase tracking-widest2 text-paper hover:opacity-90 disabled:opacity-50">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Grant / update affiliate"}</button>
        </div>

        <div className="mt-5 space-y-2">
          {list.length === 0 ? <p className="text-[13px] text-mute">No affiliates yet.</p> : list.map((a) => (
            <div key={a.email} className="flex items-center justify-between border border-line px-3 py-2">
              <div className="min-w-0">
                <p className="truncate text-[13px] text-ink">{a.email}</p>
                <p className="truncate text-[11px] text-mute">{a.level || "Mission Starter"}{a.discount_code ? ` · ${a.discount_code}` : ""}</p>
              </div>
              <button onClick={() => remove(a.email)} className="text-mute hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        :global(.omc-input){width:100%;border:1px solid #e5e2dd;background:#fff;padding:.6rem .75rem;font-size:14px;color:#17140f;margin-top:.4rem}
        :global(.omc-input:focus){outline:none;border-color:#17140f}
      `}</style>
    </div>
  );
}

/* ---------------- Shell + helpers ---------------- */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="mt-4"><label className="block label-sm text-mute">{label}</label>{children}</div>;
}
function Shell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-[70vh] bg-paper text-ink">{children}</div>;
}
function Centered({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-6 text-center">{children}</div>;
}
function EmptyState({ text }: { text: string }) {
  return (
    <div className="mt-6 border border-dashed border-line px-6 py-12 text-center">
      <Sparkles className="mx-auto h-5 w-5 text-mute" />
      <p className="mx-auto mt-3 max-w-sm text-[14px] text-mute">{text}</p>
    </div>
  );
}
