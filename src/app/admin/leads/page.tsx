"use client";

/**
 * /admin/leads — the waitlist, in one place.
 *
 * Gated by the owner's normal site login (see the API route). Nobody else can
 * load the data even if they find this URL: the check happens on the server.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getSupabase, isAuthConfigured } from "@/lib/supabaseClient";
import { RefreshCw, Download, Search } from "lucide-react";

type Lead = {
  id?: string | number;
  created_at?: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  consent?: boolean | null;
  sms_consent?: boolean | null;
  source?: string | null;
};

type State =
  | { k: "loading" }
  | { k: "signedout" }
  | { k: "denied" }
  | { k: "error"; msg: string }
  | { k: "ready"; rows: Lead[]; serviceKey: boolean };

function when(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
  });
}

function Stat({ n, label }: { n: number | string; label: string }) {
  return (
    <div className="border border-line bg-paper px-5 py-4">
      <div className="text-2xl text-ink">{n}</div>
      <div className="mt-1 text-[10px] uppercase tracking-widest2 text-mute">{label}</div>
    </div>
  );
}

export default function AdminLeadsPage() {
  const [state, setState] = useState<State>({ k: "loading" });
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!isAuthConfigured()) {
      setState({ k: "error", msg: "Auth is not configured on this deploy." });
      return;
    }
    const sb = getSupabase();
    if (!sb) return setState({ k: "error", msg: "Auth unavailable." });

    setBusy(true);
    const { data } = await sb.auth.getSession();
    const token = data.session?.access_token;
    if (!token) {
      setBusy(false);
      return setState({ k: "signedout" });
    }

    try {
      const res = await fetch("/api/admin/leads", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (res.status === 401) { setBusy(false); return setState({ k: "signedout" }); }
      if (res.status === 403) { setBusy(false); return setState({ k: "denied" }); }
      const j = await res.json();
      setBusy(false);
      if (!j.ok) return setState({ k: "error", msg: j.error || "Could not load." });
      setState({
        k: "ready",
        rows: Array.isArray(j.rows) ? j.rows : [],
        serviceKey: Boolean(j.usingServiceKey),
      });
    } catch (e) {
      setBusy(false);
      setState({ k: "error", msg: String(e) });
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const rows = state.k === "ready" ? state.rows : [];

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter((r) =>
      [r.name, r.email, r.phone, r.source].some((v) =>
        (v || "").toString().toLowerCase().includes(s),
      ),
    );
  }, [rows, q]);

  const stats = useMemo(() => {
    const waitlist = rows.filter((r) => (r.source || "").includes("founders")).length;
    const sms = rows.filter((r) => r.sms_consent).length;
    const today = rows.filter((r) => {
      if (!r.created_at) return false;
      const d = new Date(r.created_at);
      return Date.now() - d.getTime() < 86400000;
    }).length;
    return { total: rows.length, waitlist, sms, today };
  }, [rows]);

  function exportCsv() {
    const head = ["Joined", "Name", "Email", "Phone", "SMS opt-in", "Source"];
    const lines = filtered.map((r) =>
      [
        r.created_at || "",
        r.name || "",
        r.email || "",
        r.phone || "",
        r.sms_consent ? "yes" : "no",
        r.source || "",
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(","),
    );
    const blob = new Blob([[head.join(","), ...lines].join("\n")], {
      type: "text/csv;charset=utf-8",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `one-mission-waitlist-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div className="mx-auto max-w-site px-5 pb-28 pt-28 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-8">
        <div>
          <div className="label text-mute">Owners only</div>
          <h1 className="mt-3 text-3xl uppercase tracking-widest2 text-ink">The Waitlist</h1>
        </div>
        {state.k === "ready" && (
          <div className="flex gap-3">
            <button
              onClick={load}
              disabled={busy}
              className="flex items-center gap-2 border border-line px-4 py-2.5 text-[11px] uppercase tracking-widest2 text-ink hover:bg-stone disabled:opacity-40"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${busy ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <button
              onClick={exportCsv}
              className="flex items-center gap-2 bg-ink px-4 py-2.5 text-[11px] uppercase tracking-widest2 text-paper hover:opacity-90"
            >
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </button>
          </div>
        )}
      </div>

      {state.k === "loading" && (
        <p className="mt-12 text-[15px] text-mute">Loading…</p>
      )}

      {state.k === "signedout" && (
        <div className="mt-12">
          <p className="text-[15px] text-ink/80">You need to sign in to view this.</p>
          <Link
            href="/account"
            className="mt-6 inline-block bg-ink px-7 py-3.5 text-[11px] uppercase tracking-widest2 text-paper hover:opacity-90"
          >
            Sign in
          </Link>
        </div>
      )}

      {state.k === "denied" && (
        <p className="mt-12 max-w-md text-[15px] leading-relaxed text-ink/80">
          That account doesn&apos;t have access to the waitlist. Sign in with an
          owner account, or ask Matthew to add your email to the owner list.
        </p>
      )}

      {state.k === "error" && (
        <p className="mt-12 text-[15px] text-ink/80">Couldn&apos;t load: {state.msg}</p>
      )}

      {state.k === "ready" && (
        <>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Stat n={stats.total} label="Total signups" />
            <Stat n={stats.waitlist} label="From /founders" />
            <Stat n={stats.sms} label="SMS opt-in" />
            <Stat n={stats.today} label="Last 24 hours" />
          </div>

          <div className="mt-10 flex items-center gap-3 border-b border-line pb-4">
            <Search className="h-4 w-4 text-mute" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name, email, phone…"
              className="w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-mute"
            />
            {q && (
              <span className="whitespace-nowrap text-[12px] text-mute">
                {filtered.length} of {rows.length}
              </span>
            )}
          </div>

          {rows.length === 0 ? (
            <div className="mt-12 max-w-xl">
              <p className="text-[15px] leading-relaxed text-mute">
                Nobody has joined yet. Signups from{" "}
                <Link href="/founders" className="text-ink underline">/founders</Link>{" "}
                and the site popup will appear here.
              </p>
              {!state.serviceKey && (
                <p className="mt-5 border border-line bg-stone p-4 text-[13px] leading-relaxed text-ink/70">
                  Note: this deploy is reading with the public key, so database
                  row-level security may be hiding rows that do exist. If you
                  know people have signed up, add{" "}
                  <code className="text-[12px]">SUPABASE_SERVICE_ROLE_KEY</code>{" "}
                  in Vercel and this list will fill in.
                </p>
              )}
            </div>
          ) : (
            <div className="mt-2 overflow-x-auto">
              <table className="w-full min-w-[680px] border-collapse">
                <thead>
                  <tr className="border-b border-line text-left">
                    {["Joined", "Name", "Email", "Phone", "SMS", "Source"].map((h) => (
                      <th
                        key={h}
                        className="py-3 pr-4 text-[10px] uppercase tracking-widest2 text-mute"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, i) => (
                    <tr key={r.id ?? i} className="border-b border-line/70">
                      <td className="py-3.5 pr-4 text-[13px] text-mute">{when(r.created_at)}</td>
                      <td className="py-3.5 pr-4 text-[14px] text-ink">{r.name || "—"}</td>
                      <td className="py-3.5 pr-4 text-[14px] text-ink">
                        <a href={`mailto:${r.email}`} className="hover:underline">{r.email}</a>
                      </td>
                      <td className="py-3.5 pr-4 text-[14px] text-ink/70">{r.phone || "—"}</td>
                      <td className="py-3.5 pr-4 text-[13px]">
                        {r.sms_consent ? (
                          <span className="text-ink">Yes</span>
                        ) : (
                          <span className="text-mute">No</span>
                        )}
                      </td>
                      <td className="py-3.5 pr-4 text-[12px] uppercase tracking-wider2 text-mute">
                        {(r.source || "—").replace("founders-waitlist", "waitlist")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <p className="mt-12 text-[12px] leading-relaxed text-mute">
            This is the full record, including phone numbers and SMS consent.
            Klaviyo holds the same people for sending —{" "}
            <a
              href="https://www.klaviyo.com/list/RQz65X/email-list"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink underline"
            >
              open the list in Klaviyo
            </a>
            .
          </p>
        </>
      )}
    </div>
  );
}
