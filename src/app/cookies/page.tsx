import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, Section } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Cookie Policy — One Mission Collection",
  description: "What cookies we use, what they do, and how to turn them off.",
};

export default function CookiesPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Cookie Policy"
      updated="July 20, 2026"
      intro="Cookies are small files a site stores on your device. Here's plainly what ours do and how to switch them off."
    >
      <Section n="01" title="Strictly necessary">
        <p>
          These make the store function and cannot be turned off. They remember
          what&rsquo;s in your cart, keep you signed in as you move between pages,
          secure checkout, and protect against fraud. Turning them off would break
          the ability to buy anything.
        </p>
        <p>Set by us and by Shopify.</p>
      </Section>

      <Section n="02" title="Analytics">
        <p>
          These tell us which pages people visit, which products get attention,
          and where visitors drop off — in aggregate. We use this to decide what
          to build and what to fix. It is not used to identify you personally.
        </p>
      </Section>

      <Section n="03" title="Marketing and attribution">
        <p>
          These record that you arrived through a particular link so the right
          affiliate gets credited for a sale, and so we can tell which campaigns
          actually work. Our affiliate partner sets a cookie for this purpose when
          you arrive through a referral link.
        </p>
      </Section>

      <Section n="04" title="How to control cookies">
        <p>
          Every major browser lets you block or delete cookies in its settings,
          usually under Privacy. You can also browse in a private or incognito
          window, which clears them when you close it.
        </p>
        <p>
          Blocking strictly necessary cookies will prevent checkout from working.
          Blocking analytics and marketing cookies will not affect your ability to
          shop.
        </p>
      </Section>

      <Section n="05" title="Do Not Track">
        <p>
          Browsers can send a Do Not Track signal, but there is still no shared
          industry standard for responding to it, so our site does not currently
          change its behavior in response. You can control cookies directly using
          the methods above.
        </p>
      </Section>

      <Section n="06" title="More detail">
        <p>
          For the full picture of what we collect and who receives it, see our{" "}
          <Link href="/privacy" className="text-ink underline">
            Privacy Policy
          </Link>
          .
        </p>
      </Section>
    </LegalPage>
  );
}
