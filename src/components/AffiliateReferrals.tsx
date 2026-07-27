"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabaseClient";

const INK = "#17140f";
const MUTE = "#8c857a";

type Referral = {
  id: string;
  order_name: string | null;
  customer_first: string | null;
  customer_last: string | null;
  ordered_at: string | null;
  created_at: string;
};

const label: React.CSSProperties = {
  fontSize: 11,
  letterSpacing: ".16em",
  textTransform: "uppercase",
  color: MUTE,
};

/**
 * Affiliate back-office panel shown inside a signed-in affiliate's profile.
 * Lists the people who bought through their link — first and last name only.
 * Row-Level Security guarantees each affiliate only ever sees their own
 * referrals: the query is scoped server-side to rows whose referral code maps
 * to this affiliate's verified login email, so no customer data leaks across
 * affiliates or to non-affiliates.
 */
export function AffiliateReferrals() {
  const [isAffiliate, setIsAffiliate] = useState(false);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) {
      setLoaded(true);
      return;
    }
    let alive = true;
    (async () => {
      const [aff, refs] = await Promise.all([
        sb.from("omc_affiliates").select("email").maybeSingle(),
        sb
          .from("omc_affiliate_referrals")
          .select("id,order_name,customer_first,customer_last,ordered_at,created_at")
          .order("ordered_at", { ascending: false, nullsFirst: false })
          .order("created_at", { ascending: false }),
      ]);
      if (!alive) return;
      setIsAffiliate(Boolean(aff.data));
      setReferrals(Array.isArray(refs.data) ? (refs.data as Referral[]) : []);
      setLoaded(true);
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Only affiliates (or anyone who already has attributed referrals) see this.
  if (!loaded) return null;
  if (!isAffiliate && referrals.length === 0) return null;

  const fullName = (r: Referral) =>
    [r.customer_first, r.customer_last].filter(Boolean).join(" ").trim() || "—";
  const when = (r: Referral) => {
    const d = r.ordered_at || r.created_at;
    try {
      return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return "";
    }
  };

  return (
    <div style={{ border: "1px solid rgba(0,0,0,.12)", padding: "20px 22px", marginBottom: 16 }}>
      <div style={{ ...label, marginBottom: 12, display: "flex", justifyContent: "space-between" }}>
        <span>Your Referrals</span>
        <span>
          {referrals.length} {referrals.length === 1 ? "sale" : "sales"}
        </span>
      </div>

      {referrals.length === 0 ? (
        <p style={{ fontSize: 13, color: MUTE, margin: 0, lineHeight: 1.6 }}>
          No sales yet. When someone buys through your link, they&apos;ll show up here.
        </p>
      ) : (
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {referrals.map((r) => (
            <li
              key={r.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                padding: "11px 0",
                borderBottom: "1px solid rgba(0,0,0,.07)",
              }}
            >
              <span style={{ fontSize: 14, color: INK }}>{fullName(r)}</span>
              <span style={{ fontSize: 12, color: MUTE, whiteSpace: "nowrap", marginLeft: 12 }}>
                {when(r)}
              </span>
            </li>
          ))}
        </ul>
      )}

      <p style={{ fontSize: 11, color: MUTE, margin: "14px 0 0", lineHeight: 1.5 }}>
        The people who purchased through your link — first and last name only. Please keep it private.
      </p>
    </div>
  );
}
