import type { Metadata } from "next";
import { LegalPage, Section } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Order Tracking — One Mission Collection",
  description:
    "How to track your One Mission Collection order, when tracking becomes available, and what to do if your package is delayed or lost.",
};

export default function OrderTrackingPage() {
  return (
    <LegalPage
      eyebrow="Client Services"
      title="Order Tracking"
      updated="July 25, 2026"
      intro="Here's how to follow your order from checkout to your door, and what to do if something looks off."
    >
      <Section n="01" title="Your confirmation email">
        <p>
          The moment your order is placed, we email an{" "}
          <strong>order confirmation</strong> with a summary and a link to your
          live order status. Keep that email &mdash; it&rsquo;s the fastest way
          back to your order at any time. If you don&rsquo;t see it, check your
          spam or promotions folder.
        </p>
      </Section>

      <Section n="02" title="When tracking becomes available">
        <p>
          Every piece is made to order, so it&rsquo;s produced in{" "}
          <strong>2&ndash;7 business days</strong> before it ships. As soon as it
          leaves the facility, we send a separate <strong>shipping email with a
          tracking number</strong>. Until then, your order status will show as
          &ldquo;in production&rdquo; &mdash; that&rsquo;s expected.
        </p>
      </Section>

      <Section n="03" title="Orders that ship in more than one package">
        <p>
          Because items are made to order, a single order can occasionally arrive
          in more than one shipment &mdash; each with its own tracking. If part of
          your order arrives before the rest, the remaining pieces are still on
          the way at no extra cost.
        </p>
      </Section>

      <Section n="04" title="Delayed, missing, or wrong-tracking packages">
        <p>
          Delivery estimates aren&rsquo;t guarantees &mdash; carrier delays,
          weather, and holiday volume happen. If tracking hasn&rsquo;t updated in
          several days, or a package is marked delivered but you don&rsquo;t have
          it, email us with your order number and we&rsquo;ll help sort it out.
        </p>
      </Section>

      <Section n="05" title="Still need help?">
        <p>
          Email{" "}
          <a href="mailto:support@onemissioncollection.com" className="text-ink underline">support@onemissioncollection.com</a>{" "}
          with your order number and we&rsquo;ll track it down for you. For return
          and refund questions, see our{" "}
          <a href="/returns" className="text-ink underline">Shipping &amp; Returns</a>{" "}
          page.
        </p>
      </Section>
    </LegalPage>
  );
}
