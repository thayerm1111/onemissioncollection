/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Expose the Supabase anon/publishable key to the browser (needed by the
  // client-side auth + saved-cart code). It reuses the existing server-side
  // SUPABASE_ANON_KEY value at build time, so no separate NEXT_PUBLIC_ var is
  // required. The anon key is safe to ship to the client — row-level security
  // enforces per-user access.
  env: {
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "",
  },
  // Placeholder images are served locally from /public. When you add remote
  // image hosts (e.g. a CDN or Supabase storage), whitelist them here:
  // images: { remotePatterns: [{ protocol: 'https', hostname: 'your-cdn.com' }] },
};

export default nextConfig;
