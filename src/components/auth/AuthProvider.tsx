"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getSupabase, isAuthConfigured } from "@/lib/supabaseClient";

type AuthCtx = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  configured: boolean;
  signUp: (email: string, password: string, name?: string) => Promise<{ error?: string; needsConfirm?: boolean }>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used within AuthProvider");
  return c;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const configured = isAuthConfigured();

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) { setLoading(false); return; }
    sb.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = sb.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthCtx>(() => ({
    user: session?.user ?? null,
    session,
    loading,
    configured,
    async signUp(email, password, name) {
      const sb = getSupabase();
      if (!sb) return { error: "Accounts aren't set up yet." };
      const { data, error } = await sb.auth.signUp({
        email, password,
        options: { data: name ? { full_name: name } : undefined },
      });
      if (error) return { error: error.message };
      return { needsConfirm: !data.session };
    },
    async signIn(email, password) {
      const sb = getSupabase();
      if (!sb) return { error: "Accounts aren't set up yet." };
      const { error } = await sb.auth.signInWithPassword({ email, password });
      return error ? { error: error.message } : {};
    },
    async signOut() {
      const sb = getSupabase();
      await sb?.auth.signOut();
    },
  }), [session, loading, configured]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
