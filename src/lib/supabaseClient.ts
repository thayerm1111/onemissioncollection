"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// The project URL is public; the anon key is a public, RLS-protected key that
// is safe to ship in the browser. Set NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel.
const SUPABASE_URL = "https://pguzevnkmpwfuzcjbcbx.supabase.co";
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!ANON_KEY) return null;
  if (_client) return _client;
  _client = createClient(SUPABASE_URL, ANON_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });
  return _client;
}

export const isAuthConfigured = () => Boolean(ANON_KEY);
