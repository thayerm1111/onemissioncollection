import Link from "next/link";

export function Footer() {
  const year = 2026;
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto flex max-w-site flex-col gap-8 px-5 py-14 sm:flex-row sm:items-start sm:justify-between sm:px-8">
        <div>
          <p className="text-sm uppercase tracking-widest2 text-ink">One Mission Collection</p>
          <p className="mt-3 max-w-xs text-sm text-mute">
            Official apparel. Built for more.
          </p>
        </div>
        <nav className="flex flex-col gap-2.5">
          <span className="label text-mute">Shop</span>
          <Link href="/featured" className="text-sm text-ink hover:opacity-60">Featured</Link>
          <Link href="/men" className="text-sm text-ink hover:opacity-60">Men</Link>
          <Link href="/women" className="text-sm text-ink hover:opacity-60">Women</Link>
        </nav>
        <nav className="flex flex-col gap-2.5">
          <span className="label text-mute">More</span>
          <a href="https://weare1mission.com" className="text-sm text-ink hover:opacity-60">1 Mission Community</a>
          <a href="https://weare1mission.com/experiences" className="text-sm text-ink hover:opacity-60">1M Experiences</a>
        </nav>
        <nav className="flex flex-col gap-2.5">
          <span className="label text-mute">Partner</span>
          <Link href="/affiliate" className="text-sm text-ink hover:opacity-60">Become an Affiliate</Link>
          <a href="https://af.uppromote.com/k3vbq8-x0" target="_blank" rel="noopener noreferrer" className="text-sm text-ink hover:opacity-60">Affiliate Login</a>
        </nav>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto max-w-site px-5 py-6 sm:px-8">
          <p className="label-sm text-mute">© {year} One Mission Collection</p>
        </div>
      </div>
    </footer>
  );
}
