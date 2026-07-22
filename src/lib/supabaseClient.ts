"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// One Mission Collection's OWN Supabase project — fully separate from
// weare1mission (its own auth user pool + emails). Both the URL and the
// publishable key are public, RLS-protected, and safe to ship in the browser,
// so they're pinned here (not read from env) to guarantee the store never
// falls back to the old shared project.
const SUPABASE_URL = "https://lqhagjirnjzlivdaiwwl.supabase.co";
const ANON_KEY = "sb_publishable_Y4kFZfS8AkpthfvSQgYx-Q_B0_zj4mO";

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
