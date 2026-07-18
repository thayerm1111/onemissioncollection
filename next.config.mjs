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
  // Branded affiliate link: onemissioncollection.com/affiliates forwards into
  // the UpPromote sign-up page. Lets us share an on-brand link for free
  // (address bar flips to af.uppromote.com only after the redirect lands).
  async redirects() {
    return [
      {
        source: "/affiliates",
        destination: "https://af.uppromote.com/k3vbq8-x0/register",
        permanent: false,
      },
    ];
  },
  // Placeholder images are served locally from /public. When you add remote
  // image hosts (e.g. a CDN or Supabase storage), whitelist them here:
  // images: { remotePatterns: [{ protocol: 'https', hostname: 'your-cdn.com' }] },
};

export default nextConfig;
