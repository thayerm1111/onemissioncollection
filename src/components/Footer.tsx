import Link from "next/link";

const CLIENT_SERVICES = [
  { label: "Shipping & Returns", href: "/returns" },
  { label: "Wallpapers", href: "/wallpapers" },
  { label: "Your Account", href: "/account" },
  { label: "Contact", href: "mailto:support@onemissioncollection.com", external: true },
];

const COMPANY = [
  { label: "The Mission", href: "/about" },
  { label: "The Founders Collection", href: "/featured" },
  { label: "Become an Affiliate", href: "/affiliate" },
  {
    label: "1 Mission Community",
    href: "https://weare1mission.com",
    external: true,
  },
];

const LEGAL = [
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Shipping & Returns Policy", href: "/returns" },
  { label: "Cookie Policy", href: "/cookies" },
  { label: "Accessibility Statement", href: "/accessibility" },
];

function Col({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string; external?: boolean }[];
}) {
  return (
    <nav className="flex flex-col gap-2.5">
      <span className="label text-mute">{title}</span>
      {links.map((l) =>
        l.external ? (
          <a
            key={l.href}
            href={l.href}
            target={l.href.startsWith("http") ? "_blank" : undefined}
            rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="text-sm text-ink hover:opacity-60"
          >
            {l.label}
          </a>
        ) : (
          <Link key={l.href} href={l.href} className="text-sm text-ink hover:opacity-60">
            {l.label}
          </Link>
        ),
      )}
    </nav>
  );
}

export function Footer() {
  const year = 2026;
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto grid max-w-site gap-10 px-5 py-14 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
        <div>
          <p className="text-sm uppercase tracking-widest2 text-ink">
            One Mission Collection
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-mute">
            For the ones who felt lost. Searching for the one.
          </p>
          <p className="mt-5 text-[11px] uppercase tracking-wider2 text-mute">
            Matthew 18:13
          </p>
        </div>

        <Col title="Client Services" links={CLIENT_SERVICES} />
        <Col title="Company" links={COMPANY} />

        <nav className="flex flex-col gap-2.5">
          <span className="label text-mute">Shop</span>
          <Link href="/featured" className="text-sm text-ink hover:opacity-60">Featured</Link>
          <Link href="/men" className="text-sm text-ink hover:opacity-60">Men</Link>
          <Link href="/women" className="text-sm text-ink hover:opacity-60">Women</Link>
          <Link href="/accessories" className="text-sm text-ink hover:opacity-60">Accessories</Link>
        </nav>
      </div>

      {/* Legal row */}
      <div className="border-t border-line">
        <div className="mx-auto max-w-site px-5 py-8 sm:px-8">
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {LEGAL.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-[12px] text-mute hover:text-ink"
              >
                {l.label}
              </Link>
            ))}
          </div>

          <p className="mt-7 text-[11px] leading-relaxed text-mute">
            © {year} One Mission Collection
            <br />
            1301 Mount Curve Ave, Minneapolis, MN 55403, United States
          </p>
        </div>
      </div>
    </footer>
  );
}
