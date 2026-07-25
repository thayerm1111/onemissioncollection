import type { Metadata } from "next";
import { LegalPage, Section } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Contact — One Mission Collection",
  description:
    "Get in touch with One Mission Collection support. Email support@onemissioncollection.com and a real person will help with orders, sizing, returns, and anything else.",
};

const SUPPORT_EMAIL = "support@onemissioncollection.com";

export default function ContactPage() {
  return (
    <LegalPage
      eyebrow="Client Services"
      title="Contact Us"
      updated="July 25, 2026"
      intro="Questions about an order, sizing, a return, or anything else? A real person on our team is here to help."
    >
      <Section n="01" title="Email our support team">
        <p>
          The fastest way to reach us is by email. Send a note to the address
          below and a support rep will get back to you &mdash; usually within one
          business day.
        </p>

        {/* Prominent, always-visible address: click to open your mail app, or
            just copy the text if your device doesn't have one set up. */}
        <div className="mt-6 rounded-lg border border-line p-6 text-center">
          <div className="label text-mute">Support</div>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="mt-3 inline-block text-lg text-ink underline underline-offset-4 sm:text-xl"
          >
            {SUPPORT_EMAIL}
          </a>
          <p className="mt-4 m-0 text-[13px] text-mute">
            Tap the address to open your email app, or copy it into whichever
            email you use.
          </p>
        </div>

        <p className="mt-6">
          When you write in about an existing order, include your{" "}
          <strong>order number</strong> (it&rsquo;s in your confirmation email)
          so we can pull it up right away.
        </p>
      </Section>

      <Section n="02" title="Before you write — a few quick answers">
        <p>
          Many questions are answered instantly on our help pages. You may find
          what you need on the{" "}
          <a href="/faq" className="text-ink underline">FAQ</a>,{" "}
          <a href="/order-tracking" className="text-ink underline">Order Tracking</a>, or{" "}
          <a href="/returns" className="text-ink underline">Shipping &amp; Returns</a>{" "}
          pages.
        </p>
      </Section>

      <Section n="03" title="Where we are">
        <p>
          One Mission Collection<br />
          1301 Mount Curve Ave, Minneapolis, MN 55403, United States
        </p>
      </Section>
    </LegalPage>
  );
}
