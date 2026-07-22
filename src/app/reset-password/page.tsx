"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";

const INK = "#17140f";
const MUTE = "#8c857a";

const field: React.CSSProperties = {
  width: "100%", padding: "12px 14px", border: "1px solid rgba(0,0,0,.25)",
  background: "#fff", color: INK, fontSize: 14, outline: "none",
};
const label: React.CSSProperties = {
  fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase", color: MUTE,
  marginBottom: 6, display: "block",
};
const btn: React.CSSProperties = {
  width: "100%", padding: "14px", background: INK, color: "#f5f2ec",
  fontSize: 12, letterSpacing: ".2em", textTransform: "uppercase",
  border: "1px solid " + INK, cursor: "pointer",
};
const wrap: React.CSSProperties = {
  maxWidth: 460, margin: "0 auto", padding: "12vh 24px 16vh", color: INK,
};

/**
 * Landing page for the "reset your password" email link. Supabase turns the
 * recovery token in the URL into a short-lived session (handled by the
 * AuthProvider's onAuthStateChange listener). Once we have that session the
 * shopper can set a new password.
 */
export default function ResetPasswordPage() {
  const { session, loading, configured, updatePassword } = useAuth();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  // Give Supabase a moment to establish the recovery session from the URL.
  const [waited, setWaited] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setWaited(true), 1500);
    return () => clearTimeout(t);
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (password.length < 6) { setMsg("Password must be at least 6 characters."); return; }
    if (password !== confirm) { setMsg("Passwords don't match."); return; }
    setBusy(true);
    const res = await updatePassword(password);
    setBusy(false);
    if (res.error) { setMsg(res.error); return; }
    setDone(true);
    setTimeout(() => router.push("/account"), 1800);
  }

  if (!configured) {
    return (
      <div style={wrap}>
        <h1 style={{ fontSize: "clamp(24px,3vw,34px)", letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 400, textAlign: "center" }}>Reset Password</h1>
        <p style={{ marginTop: 16, color: MUTE, textAlign: "center", fontSize: 14 }}>Accounts aren&apos;t set up yet.</p>
      </div>
    );
  }

  if (done) {
    return (
      <div style={wrap}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 11, letterSpacing: ".3em", textTransform: "uppercase", color: MUTE }}>All set</div>
          <h1 style={{ marginTop: 12, fontSize: "clamp(24px,3vw,34px)", letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 400 }}>Password Updated</h1>
          <p style={{ marginTop: 14, color: MUTE, fontSize: 14 }}>Taking you to your account…</p>
        </div>
      </div>
    );
  }

  // If, after waiting, there's still no recovery session, the link was likely
  // expired or already used — send them back to request a fresh one.
  if (!loading && waited && !session) {
    return (
      <div style={wrap}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "clamp(24px,3vw,34px)", letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 400 }}>Link Expired</h1>
          <p style={{ marginTop: 14, color: MUTE, fontSize: 14, lineHeight: 1.7 }}>
            This password reset link is invalid or has expired. Request a new one from the sign-in page.
          </p>
          <Link href="/account" style={{ ...btn, display: "inline-block", width: "auto", padding: "12px 28px", marginTop: 22, textDecoration: "none" }}>
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={wrap}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 11, letterSpacing: ".3em", textTransform: "uppercase", color: MUTE }}>One Mission Collection</div>
        <h1 style={{ marginTop: 12, fontSize: "clamp(24px,3vw,34px)", letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 400 }}>Set a New Password</h1>
      </div>

      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <label style={label}>New Password</label>
          <input style={field} type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
        </div>
        <div>
          <label style={label}>Confirm Password</label>
          <input style={field} type="password" required minLength={6} value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" />
        </div>
        {msg && <p style={{ fontSize: 13, color: INK, background: "#efece4", padding: "10px 12px" }}>{msg}</p>}
        <button type="submit" disabled={busy} style={{ ...btn, opacity: busy ? 0.6 : 1 }}>
          {busy ? "…" : "Update Password"}
        </button>
      </form>
    </div>
  );
}
