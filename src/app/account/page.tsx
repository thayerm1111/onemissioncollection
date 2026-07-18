"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { useCart } from "@/components/cart/CartProvider";

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

export default function AccountPage() {
  const { user, loading, configured, signIn, signUp, signOut } = useAuth();
  const cart = useCart();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setMsg(null);
    const res = mode === "login"
      ? await signIn(email, password)
      : await signUp(email, password, name);
    setBusy(false);
    if (res.error) setMsg(res.error);
    else if ("needsConfirm" in res && res.needsConfirm)
      setMsg("Check your email to confirm your account, then log in.");
  }

  const wrap: React.CSSProperties = {
    maxWidth: 460, margin: "0 auto", padding: "12vh 24px 16vh", color: INK,
  };

  if (loading) {
    return <div style={wrap}><p style={{ color: MUTE, textAlign: "center" }}>Loading…</p></div>;
  }

  if (!configured) {
    return (
      <div style={wrap}>
        <h1 style={{ fontSize: "clamp(24px,3vw,34px)", letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 400, textAlign: "center" }}>Account</h1>
        <p style={{ marginTop: 16, color: MUTE, textAlign: "center", fontSize: 14, lineHeight: 1.7 }}>
          Accounts are almost ready — the sign-in key just needs to be added. Check back shortly.
        </p>
      </div>
    );
  }

  if (user) {
    return (
      <div style={wrap}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 11, letterSpacing: ".3em", textTransform: "uppercase", color: MUTE }}>Your Account</div>
          <h1 style={{ marginTop: 12, fontSize: "clamp(24px,3vw,34px)", letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 400 }}>
            {(user.user_metadata?.full_name as string) || "Member"}
          </h1>
          <p style={{ marginTop: 8, color: MUTE, fontSize: 13 }}>{user.email}</p>
        </div>

        <div style={{ border: "1px solid rgba(0,0,0,.12)", padding: "20px 22px", marginBottom: 16 }}>
          <div style={{ ...label, marginBottom: 10 }}>Your Bag</div>
          <p style={{ fontSize: 14, color: INK }}>
            {cart.count > 0
              ? `${cart.count} item${cart.count > 1 ? "s" : ""} saved · ${"$" + cart.subtotal.toFixed(2)}`
              : "Your saved bag is empty."}
          </p>
          {cart.count > 0 && (
            <button onClick={cart.open} style={{ ...btn, marginTop: 14 }}>View Bag</button>
          )}
        </div>

        <div style={{ border: "1px solid rgba(0,0,0,.12)", padding: "20px 22px", marginBottom: 16 }}>
          <div style={{ ...label, marginBottom: 10 }}>Orders</div>
          <a href="https://1-mission-2.myshopify.com/account" target="_blank" rel="noopener noreferrer"
             style={{ fontSize: 13, color: INK, borderBottom: "1px solid " + INK, paddingBottom: 3, textDecoration: "none" }}>
            View order history
          </a>
        </div>

        <Link href="/inner-circle" style={{ ...btn, display: "block", textAlign: "center", textDecoration: "none", marginBottom: 12 }}>
          Enter the Inner Circle
        </Link>

        <button onClick={() => signOut()} style={{ width: "100%", padding: "12px", background: "transparent", color: MUTE, fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", border: "1px solid rgba(0,0,0,.2)", cursor: "pointer" }}>
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div style={wrap}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 11, letterSpacing: ".3em", textTransform: "uppercase", color: MUTE }}>One Mission Collection</div>
        <h1 style={{ marginTop: 12, fontSize: "clamp(24px,3vw,34px)", letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 400 }}>
          {mode === "login" ? "Sign In" : "Create Account"}
        </h1>
      </div>

      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {mode === "signup" && (
          <div>
            <label style={label}>Name</label>
            <input style={field} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
          </div>
        )}
        <div>
          <label style={label}>Email</label>
          <input style={field} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        </div>
        <div>
          <label style={label}>Password</label>
          <input style={field} type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === "login" ? "current-password" : "new-password"} />
        </div>
        {msg && <p style={{ fontSize: 13, color: INK, background: "#efece4", padding: "10px 12px" }}>{msg}</p>}
        <button type="submit" disabled={busy} style={{ ...btn, opacity: busy ? 0.6 : 1 }}>
          {busy ? "…" : mode === "login" ? "Sign In" : "Create Account"}
        </button>
      </form>

      <p style={{ marginTop: 22, textAlign: "center", fontSize: 13, color: MUTE }}>
        {mode === "login" ? "New here?" : "Already a member?"}{" "}
        <button
          onClick={() => { setMode(mode === "login" ? "signup" : "login"); setMsg(null); }}
          style={{ color: INK, borderBottom: "1px solid " + INK, background: "none", border: "none", borderBottomWidth: 1, cursor: "pointer", padding: 0 }}
        >
          {mode === "login" ? "Create an account" : "Sign in"}
        </button>
      </p>
    </div>
  );
}
