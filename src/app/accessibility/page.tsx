import type { Metadata } from "next";
import { LegalPage, Section } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Accessibility Statement — One Mission Collection",
  description:
    "Our commitment to making onemissioncollection.com usable for everyone.",
};

export default function AccessibilityPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Accessibility Statement"
      updated="July 20, 2026"
      intro="This brand exists to go after the one nobody came back for. A store that some people can't use would be a strange way to say that."
    >
      <Section n="01" title="What we're working toward">
        <p>
          We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.1 at
          Level AA. That is the standard most commonly referenced under the
          Americans with Disabilities Act.
        </p>
      </Section>

      <Section n="02" title="What's in place today">
        <p>
          The site is built to be navigated by keyboard alone, uses semantic
          markup so screen readers can announce structure correctly, provides
          alternative text for product and editorial imagery, maintains strong
          contrast between text and background, and reflows cleanly down to small
          phone screens without horizontal scrolling.
        </p>
      </Section>

      <Section n="03" title="Where we know we fall short">
        <p>
          We would rather name the gaps than claim we have none. Some product
          photography still needs richer alternative text than it currently has.
          Portions of checkout are rendered by Shopify and are outside our direct
          control, though we track their accessibility work. We have not yet
          completed a full third-party audit.
        </p>
        <p>
          These are on our list, not forgotten.
        </p>
      </Section>

      <Section n="04" title="Tell us if something blocks you">
        <p>
          If any part of this site is difficult or impossible for you to use, we
          want to hear about it — that is genuinely more useful to us than a
          perfect-sounding statement.
        </p>
        <p>
          Email support@onemissioncollection.com with the page and what went
          wrong. We aim to respond within three business days, and if something
          prevents you from completing an order we will help you place it
          directly.
        </p>
      </Section>
    </LegalPage>
  );
}
