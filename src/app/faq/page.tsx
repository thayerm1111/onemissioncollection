import type { Metadata } from "next";
import { LegalPage, Section } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "FAQ — One Mission Collection",
  description:
    "Answers to common questions about the Founders Collection drop, the free Founding Wallet, sizing, production and shipping times, returns, order tracking, and affiliates.",
};

export default function FaqPage() {
  return (
    <LegalPage
      eyebrow="Help Center"
      title="Frequently Asked Questions"
      updated="July 25, 2026"
      intro="Everything you need to know about the drop, your order, and getting the right fit. Still stuck? Email support@onemissioncollection.com and we'll take care of you."
    >
      <Section n="01" title="When does the Founders Collection drop?">
        <p>
          Monday, July 27, 2026 at <strong>8:00 AM Central</strong>. The store
          opens itself the moment the countdown hits zero &mdash; no need to
          refresh early. Sizes and the free gift are limited, so setting an alarm
          is a good idea.
        </p>
      </Section>

      <Section n="02" title="How does the free Founding Wallet work?">
        <p>
          The <strong>first 100 orders</strong> that include any Founders piece
          receive a free Founding Wallet, added automatically at checkout &mdash;
          no code needed. One per order. Once the 100 are claimed, the offer ends.
        </p>
      </Section>

      <Section n="03" title="How do I find my size?">
        <p>
          Every product page has a <strong>Size &amp; Fit</strong> section with a
          full body-measurement chart &mdash; measure yourself and match to the
          size, rather than guessing off a garment. Each piece also lists its fit
          (relaxed, oversized, true-to-size, etc.). Between sizes? Size up for a
          roomier drape, down for a cleaner fit.
        </p>
      </Section>

      <Section n="04" title="How long until my order ships?">
        <p>
          Every piece is made for you after you order, so production typically
          takes <strong>2&ndash;7 business days</strong> before shipping. During a
          drop, volume can push toward the longer end. Once shipped, U.S. orders
          usually arrive in 3&ndash;7 business days. You&rsquo;ll get a tracking
          email the moment your order leaves the facility.
        </p>
        <p>
          Because items are made to order, a single order can occasionally ship in
          more than one package &mdash; that&rsquo;s normal and there&rsquo;s no
          extra charge.
        </p>
      </Section>

      <Section n="05" title="How do I track my order?">
        <p>
          When your order ships, we email you a tracking link. You can also see
          live status any time from the order-confirmation email &mdash; see our{" "}
          <a href="/order-tracking" className="text-ink underline">order tracking</a>{" "}
          page for details.
        </p>
      </Section>

      <Section n="06" title="What's your return policy?">
        <p>
          Most items can be returned within <strong>30 days of delivery</strong>,
          unworn and in original condition. Full details, including how refunds
          and exchanges work, are on our{" "}
          <a href="/returns" className="text-ink underline">Shipping &amp; Returns</a>{" "}
          page.
        </p>
      </Section>

      <Section n="07" title="What payment methods do you accept?">
        <p>
          Checkout is handled securely by Shopify and accepts major credit and
          debit cards, plus Shop Pay, Apple Pay, and Google Pay where available.
        </p>
      </Section>

      <Section n="08" title="Can I become an affiliate?">
        <p>
          Yes. Approved affiliates earn commission on referred sales and get their
          own personal discount code to share. Apply on our{" "}
          <a href="/affiliate" className="text-ink underline">Affiliates</a> page.
        </p>
      </Section>

      <Section n="09" title="How do I contact you?">
        <p>
          Email <a href="mailto:support@onemissioncollection.com" className="text-ink underline">support@onemissioncollection.com</a>{" "}
          and a real person will get back to you. Include your order number if
          your question is about an existing order.
        </p>
      </Section>
    </LegalPage>
  );
}
