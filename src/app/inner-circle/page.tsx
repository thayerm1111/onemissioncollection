"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Headphones, BookOpen, FileText, Play, MapPin, Lock, ArrowRight, Download,
  Sparkles, Plus, Star, Trash2, Pencil, X, UploadCloud, Loader2, Calendar,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { getSupabase } from "@/lib/supabaseClient";

/* -------------------------------------------------------------------------
   INNER CIRCLE — personal-development back office (Phase 1, customer + owner CMS)
   Owners can upload audio / video / PDF and manage everything live.
------------------------------------------------------------------------- */

const OWNERS = [
  "thayerm1111@gmail.com",
  "wilson55082@gmail.com",
  "wilson55082@yahoo.com",
  "onemissioncollection@yahoo.com",
];

type CatKey =
  | "identity" | "purpose" | "faith" | "mindset" | "confidence" | "discipline"
  | "leadership" | "goals" | "health" | "relationships" | "finance"
  | "adversity" | "habits";
type Kind = "audio" | "video" | "pdf";

const CATEGORIES: { key: CatKey; label: string }[] = [
  { key: "identity", label: "Identity" },
  { key: "purpose", label: "Purpose" },
  { key: "faith", label: "Faith" },
  { key: "mindset", label: "Mindset" },
  { key: "confidence", label: "Confidence" },
  { key: "discipline", label: "Discipline" },
  { key: "leadership", label: "Leadership" },
  { key: "goals", label: "Goal Setting" },
  { key: "health", label: "Health & Performance" },
  { key: "relationships", label: "Relationships" },
  { key: "finance", label: "Financial" },
  { key: "adversity", label: "Overcoming Adversity" },
  { key: "habits", label: "Better Habits" },
];
const catLabel = (c: string) => CATEGORIES.find((x) => x.key === c)?.label ?? c;

const KINDS: { key: Kind; label: string; accept: string; icon: typeof Headphones }[] = [
  { key: "audio", label: "Audio", accept: "audio/*", icon: Headphones },
  { key: "video", label: "Video", accept: "video/*", icon: Play },
  { key: "pdf", label: "PDF", accept: "application/pdf", icon: FileText },
];

type Item = {
  id: string;
  category: CatKey;
  kind: Kind;
  title: string;
  author: string | null;
  meta: string | null;
  summary: string | null;
  file_url: string | null;
  featured: boolean;
  sort: number;
  created_at: string;
};

type Access = { allowed: boolean; reason: "affiliate" | "purchase" | null };
type Tab = "featured" | "development" | "experiences";

const EXPERIENCES = [
  { title: "The Founders Retreat", blurb: "A weekend to reset, refocus, and build with people on the same mission." },
  { title: "One Mission Live", blurb: "An evening of teaching, worship, and real conversation — in person." },
  { title: "Growth Intensive", blurb: "A focused workshop on discipline, purpose, and the habits that carry you." },
];

/* ---------------- Media players ---------------- */
function Media({ item }: { item: Item }) {
  if (!item.file_url) return null;
  if (item.kind === "audio")
    return <audio controls preload="none" src={item.file_url} className="mt-3 w-full">Audio not supported.</audio>;
  if (item.kind === "video")
    return <video controls preload="none" src={item.file_url} className="mt-3 w-full rounded-sm bg-ink" />;
  return (
    <a href={item.file_url} target="_blank" rel="noreferrer"
      className="mt-3 inline-flex items-center gap-2 border border-ink px-4 py-2 text-[11px] uppercase tracking-widest2 hover:bg-ink hover:text-paper">
      <Download className="h-4 w-4" /> Open PDF
    </a>
  );
}

export default function InnerCirclePage() {
  const { user, session, loading } = useAuth();
  const email = user?.email ?? null;
  const isOwner = Boolean(email && OWNERS.includes(email.toLowerCase()));

  const [access, setAccess] = useState<Access | null>(null);
  const [checking, setChecking] = useState(false);
  const [tab, setTab] = useState<Tab>("featured");
  const [cat, setCat] = useState<CatKey | "all">("all");

  const [items, setItems] = useState<Item[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [editing, setEditing] = useState<Item | null>(null);
  const [adding, setAdding] = useState(false);

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

  const loadItems = useCallback(async () => {
    const sb = getSupabase();
    if (!sb) return;
    setLoadingItems(true);
    const { data } = await sb
      .from("omc_inner_circle_content")
      .select("*")
      .order("sort", { ascending: true })
      .order("created_at", { ascending: false });
    setItems((data as Item[]) ?? []);
    setLoadingItems(false);
  }, []);

  useEffect(() => { if (allowed) loadItems(); }, [allowed, loadItems]);

  const featured = useMemo(() => items.find((i) => i.featured) ?? items[0] ?? null, [items]);
  const activeCats = useMemo(() => {
    const set = new Set(items.map((i) => i.category));
    return CATEGORIES.filter((c) => set.has(c.key));
  }, [items]);
  const devItems = useMemo(
    () => (cat === "all" ? items : items.filter((i) => i.category === cat)),
    [items, cat],
  );

  async function makeFeatured(id: string) {
    const sb = getSupabase();
    if (!sb) return;
    await sb.from("omc_inner_circle_content").update({ featured: false }).neq("id", id);
    await sb.from("omc_inner_circle_content").update({ featured: true }).eq("id", id);
    await loadItems();
  }
  async function removeItem(id: string) {
    const sb = getSupabase();
    if (!sb) return;
    if (!confirm("Delete this item? This cannot be undone.")) return;
    await sb.from("omc_inner_circle_content").delete().eq("id", id);
    await loadItems();
  }

  /* ---- gate states ---- */
  if (loading || (session && checking && access === null && !isOwner)) {
    return <Shell><Centered><Loader2 className="h-5 w-5 animate-spin text-mute" /></Centered></Shell>;
  }
  if (!session && !loading) {
    return (
      <Shell><Centered>
        <Lock className="h-6 w-6 text-mute" />
        <h1 className="mt-4 text-2xl">The Inner Circle</h1>
        <p className="mt-2 max-w-sm text-[14px] text-mute">A members-only space for growth — teachings, interviews, and daily motivation. Sign in to enter.</p>
        <Link href="/account" className="mt-6 inline-flex items-center gap-2 bg-ink px-6 py-3 text-xs uppercase tracking-widest2 text-paper hover:opacity-90">Sign in <ArrowRight className="h-4 w-4" /></Link>
      </Centered></Shell>
    );
  }
  if (!allowed) {
    return (
      <Shell><Centered>
        <Lock className="h-6 w-6 text-mute" />
        <h1 className="mt-4 text-2xl">You&apos;re almost in</h1>
        <p className="mt-2 max-w-sm text-[14px] text-mute">The Inner Circle unlocks once you&apos;ve made a purchase or joined as an affiliate. Grab a piece from the collection and it opens automatically.</p>
        <Link href="/featured" className="mt-6 inline-flex items-center gap-2 bg-ink px-6 py-3 text-xs uppercase tracking-widest2 text-paper hover:opacity-90">Shop the collection <ArrowRight className="h-4 w-4" /></Link>
      </Centered></Shell>
    );
  }

  const TABS: { key: Tab; label: string; icon: typeof Headphones }[] = [
    { key: "featured", label: "This Week", icon: Star },
    { key: "development", label: "Development", icon: BookOpen },
    { key: "experiences", label: "Experiences", icon: MapPin },
  ];

  return (
    <Shell>
      <div className="mx-auto max-w-6xl px-5 py-10">
        <header className="mb-8">
          <p className="label text-mute">One Mission</p>
          <h1 className="mt-1 text-3xl md:text-4xl">The Inner Circle</h1>
          <p className="mt-2 text-[14px] text-mute">
            {email ? `Welcome${user?.user_metadata?.name ? `, ${user.user_metadata.name}` : ""}. ` : ""}
            Your back office for personal development.
          </p>
        </header>

        <div className="mb-6 md:hidden">
          <select value={tab} onChange={(e) => setTab(e.target.value as Tab)}
            className="w-full border border-line bg-paper px-4 py-3 text-sm uppercase tracking-wider2 text-ink">
            {TABS.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
          </select>
        </div>

        <div className="flex gap-8">
          <aside className="hidden w-52 flex-shrink-0 md:block">
            <nav className="sticky top-24 space-y-1">
              {TABS.map((t) => {
                const Icon = t.icon; const on = tab === t.key;
                return (
                  <button key={t.key} onClick={() => setTab(t.key)}
                    className={`flex w-full items-center gap-3 border-l-2 px-4 py-3 text-left text-[13px] uppercase tracking-wider2 transition-colors ${on ? "border-sky-500 bg-sky-50 text-ink" : "border-transparent text-mute hover:text-ink"}`}>
                    <Icon className="h-4 w-4" /> {t.label}
                  </button>
                );
              })}
              {isOwner && (
                <button onClick={() => setAdding(true)}
                  className="mt-4 flex w-full items-center justify-center gap-2 bg-ink px-4 py-3 text-[11px] uppercase tracking-widest2 text-paper hover:opacity-90">
                  <Plus className="h-4 w-4" /> Add content
                </button>
              )}
            </nav>
          </aside>

          <main className="min-w-0 flex-1">
            {isOwner && (
              <div className="mb-6 flex items-center justify-between border border-sky-200 bg-sky-50 px-4 py-3">
                <span className="label-sm text-mute">Admin — upload &amp; manage everything here.</span>
                <button onClick={() => setAdding(true)} className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest2 text-ink hover:opacity-70 md:hidden"><Plus className="h-4 w-4" /> Add</button>
              </div>
            )}

            {tab === "featured" && <FeaturedView featured={featured} isOwner={isOwner} onManage={() => setTab("development")} />}

            {tab === "development" && (
              <DevelopmentView items={devItems} cats={activeCats} cat={cat} setCat={setCat}
                loading={loadingItems} isOwner={isOwner}
                onFeature={makeFeatured} onDelete={removeItem} onEdit={setEditing} onAdd={() => setAdding(true)} />
            )}

            {tab === "experiences" && <ExperiencesView />}
          </main>
        </div>
      </div>

      {(adding || editing) && (
        <ContentForm existing={editing}
          onClose={() => { setAdding(false); setEditing(null); }}
          onSaved={async () => { setAdding(false); setEditing(null); await loadItems(); }} />
      )}
    </Shell>
  );
}

/* ---------------- Views ---------------- */
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
            <span className="label-sm">{catLabel(featured.category)}{featured.meta ? ` · ${featured.meta}` : ""}</span>
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

function DevelopmentView({
  items, cats, cat, setCat, loading, isOwner, onFeature, onDelete, onEdit, onAdd,
}: {
  items: Item[]; cats: { key: CatKey; label: string }[]; cat: CatKey | "all"; setCat: (c: CatKey | "all") => void;
  loading: boolean; isOwner: boolean;
  onFeature: (id: string) => void; onDelete: (id: string) => void; onEdit: (it: Item) => void; onAdd: () => void;
}) {
  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="label text-mute">Development</p>
        {isOwner && <button onClick={onAdd} className="hidden items-center gap-1.5 text-[11px] uppercase tracking-widest2 text-ink hover:opacity-70 md:flex"><Plus className="h-4 w-4" /> Add item</button>}
      </div>

      {cats.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {[{ key: "all" as const, label: "All" }, ...cats].map((c) => (
            <button key={c.key} onClick={() => setCat(c.key as CatKey | "all")}
              className={`border px-3.5 py-2 text-[11px] uppercase tracking-wider2 transition-colors ${cat === c.key ? "border-ink bg-ink text-paper" : "border-line text-mute hover:border-ink hover:text-ink"}`}>
              {c.label}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="mt-10 flex justify-center"><Loader2 className="h-5 w-5 animate-spin text-mute" /></div>
      ) : items.length === 0 ? (
        <EmptyState text={isOwner ? "Nothing here yet. Use “Add content” to upload your first audio, video, or PDF." : "New teachings are on the way. Check back soon."} />
      ) : (
        <div className="mt-6 space-y-4">
          {items.map((it) => (
            <article key={it.id} className="border border-line bg-paper p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-mute">
                    {it.kind === "audio" ? <Headphones className="h-3.5 w-3.5" /> : it.kind === "video" ? <Play className="h-3.5 w-3.5" /> : <FileText className="h-3.5 w-3.5" />}
                    <span className="label-sm">{catLabel(it.category)}{it.meta ? ` · ${it.meta}` : ""}</span>
                    {it.featured && <span className="rounded-sm bg-sky-500 px-1.5 py-0.5 text-[9px] uppercase tracking-widest2 text-white">This week</span>}
                  </div>
                  <h3 className="mt-2 text-lg leading-snug text-ink">{it.title}</h3>
                  {it.author && <p className="text-[12px] text-mute">{it.author}</p>}
                  {it.summary && <p className="mt-2 text-[14px] leading-relaxed text-ink/75">{it.summary}</p>}
                </div>
                {isOwner && (
                  <div className="flex flex-shrink-0 items-center gap-2 text-mute">
                    <button title="Feature this week" onClick={() => onFeature(it.id)} className="hover:text-ink"><Star className={`h-4 w-4 ${it.featured ? "fill-sky-500 text-sky-500" : ""}`} /></button>
                    <button title="Edit" onClick={() => onEdit(it)} className="hover:text-ink"><Pencil className="h-4 w-4" /></button>
                    <button title="Delete" onClick={() => onDelete(it.id)} className="hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                  </div>
                )}
              </div>
              <Media item={it} />
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

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

/* ---------------- Owner form ---------------- */
function ContentForm({ existing, onClose, onSaved }: { existing: Item | null; onClose: () => void; onSaved: () => void }) {
  const [category, setCategory] = useState<CatKey>(existing?.category ?? "identity");
  const [kind, setKind] = useState<Kind>(existing?.kind ?? "audio");
  const [title, setTitle] = useState(existing?.title ?? "");
  const [author, setAuthor] = useState(existing?.author ?? "");
  const [meta, setMeta] = useState(existing?.meta ?? "");
  const [summary, setSummary] = useState(existing?.summary ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const accept = KINDS.find((k) => k.key === kind)?.accept ?? "*/*";

  async function save() {
    setErr(null);
    if (!title.trim()) { setErr("Give it a title."); return; }
    if (!existing && !file) { setErr("Choose a file to upload."); return; }
    const sb = getSupabase();
    if (!sb) { setErr("Not connected."); return; }
    setBusy(true);
    try {
      let file_url = existing?.file_url ?? null;
      if (file) {
        const clean = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `${category}/${Date.now()}-${clean}`;
        const up = await sb.storage.from("inner-circle").upload(path, file, { upsert: false });
        if (up.error) throw up.error;
        file_url = sb.storage.from("inner-circle").getPublicUrl(path).data.publicUrl;
      }
      const row = {
        category, kind, title: title.trim(),
        author: author.trim() || null, meta: meta.trim() || null,
        summary: summary.trim() || null, file_url,
      };
      const res = existing
        ? await sb.from("omc_inner_circle_content").update(row).eq("id", existing.id)
        : await sb.from("omc_inner_circle_content").insert(row);
      if (res.error) throw res.error;
      onSaved();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Something went wrong.");
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-ink/40 sm:items-center sm:p-4" onClick={onClose}>
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto bg-paper p-6 shadow-2xl sm:border sm:border-line" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg">{existing ? "Edit item" : "Add content"}</h2>
          <button onClick={onClose} className="text-mute hover:text-ink"><X className="h-5 w-5" /></button>
        </div>

        <label className="mt-5 block label-sm text-mute">Type</label>
        <div className="mt-2 flex gap-2">
          {KINDS.map((k) => {
            const Icon = k.icon;
            return (
              <button key={k.key} onClick={() => setKind(k.key)}
                className={`flex items-center gap-1.5 border px-3 py-1.5 text-[11px] uppercase tracking-wider2 ${kind === k.key ? "border-ink bg-ink text-paper" : "border-line text-mute hover:border-ink"}`}>
                <Icon className="h-3.5 w-3.5" /> {k.label}
              </button>
            );
          })}
        </div>

        <label className="mt-4 block label-sm text-mute">Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value as CatKey)} className="omc-input mt-2">
          {CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
        </select>

        <Field label="Title"><input value={title} onChange={(e) => setTitle(e.target.value)} className="omc-input" placeholder="e.g. Discipline Is Self-Respect" /></Field>
        <Field label="Speaker / Author (optional)"><input value={author} onChange={(e) => setAuthor(e.target.value)} className="omc-input" placeholder="One Mission" /></Field>
        <Field label="Length (optional)"><input value={meta} onChange={(e) => setMeta(e.target.value)} className="omc-input" placeholder={kind === "pdf" ? "12 pages" : "14 min"} /></Field>
        <Field label="Summary (optional)"><textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={3} className="omc-input resize-none" placeholder="A sentence or two about it." /></Field>

        <label className="mt-4 block label-sm text-mute">File {existing && "(leave empty to keep current)"}</label>
        <button onClick={() => fileRef.current?.click()} className="mt-2 flex w-full items-center justify-center gap-2 border border-dashed border-line py-6 text-[12px] uppercase tracking-widest2 text-mute hover:border-ink hover:text-ink">
          <UploadCloud className="h-5 w-5" /> {file ? file.name : `Choose ${kind} file`}
        </button>
        <input ref={fileRef} type="file" accept={accept} className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />

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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="mt-4"><label className="block label-sm text-mute">{label}</label>{children}</div>;
}

/* ---------------- Shell + helpers ---------------- */
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
