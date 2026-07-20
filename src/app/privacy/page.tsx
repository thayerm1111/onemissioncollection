import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, Section } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy — One Mission Collection",
  description:
    "What we collect, who we share it with, and how to get your data removed.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      updated="July 20, 2026"
      intro="This explains what we collect, why, who we hand it to, and how to make us delete it. We don't sell your personal information."
    >
      <Section n="01" title="What we collect">
        <p>
          <strong>You give us:</strong> your name, email address, shipping and
          billing address, and phone number if you provide one. If you create an
          account, your login credentials. If you contact us, whatever is in that
          message.
        </p>
        <p>
          <strong>Automatically:</strong> IP address, browser and device type,
          pages viewed, and how you arrived at the site. This comes from cookies
          and similar technologies — see our{" "}
          <Link href="/cookies" className="text-ink underline">
            Cookie Policy
          </Link>
          .
        </p>
        <p>
          <strong>We never see your full card number.</strong> Payments run
          through Shopify and its payment processors. We receive only a
          confirmation and the last four digits.
        </p>
      </Section>

      <Section n="02" title="Why we use it">
        <p>
          To process and ship orders, handle returns, answer support requests,
          maintain your account and saved cart, prevent fraud, send marketing you
          asked for, credit affiliate referrals, and understand which pages and
          products people respond to.
        </p>
      </Section>

      <Section n="03" title="Who we share it with">
        <p>
          We share only what each provider needs to do its job:
        </p>
        <p>
          <strong>Shopify</strong> — store, checkout, and payments.
          <br />
          <strong>Tapstitch</strong> — production and fulfillment; receives your
          name and shipping address.
          <br />
          <strong>Klaviyo</strong> — email and text marketing; receives your name,
          email, and phone if you opted in.
          <br />
          <strong>Supabase</strong> — account and saved-cart storage.
          <br />
          <strong>Vercel</strong> — website hosting.
          <br />
          <strong>UpPromote</strong> — affiliate tracking and commissions.
        </p>
        <p>
          We may also disclose information if legally required, or in connection
          with a sale or merger of the business. Beyond that, we do not sell or
          rent your personal information, and we do not share it with third
          parties for their own marketing.
        </p>
      </Section>

      <Section n="04" title="Text messages">
        <p>
          Mobile numbers collected for text marketing get specific protection:{" "}
          <strong>
            we do not sell them, and we do not share them with third parties or
            affiliates for their marketing purposes.
          </strong>{" "}
          They are used to send you the messages you opted in to, and shared only
          with the messaging provider that delivers them.
        </p>
        <p>
          Reply STOP to any message to stop receiving them, or HELP for help.
        </p>
      </Section>

      <Section n="05" title="Marketing choices">
        <p>
          Unsubscribe from email using the link at the bottom of any message. Stop
          texts by replying STOP. You can also email
          support@onemissioncollection.com and ask us to remove you from
          everything.
        </p>
        <p>
          Opting out of marketing does not stop transactional messages about
          orders you have placed.
        </p>
      </Section>

      <Section n="06" title="Your rights">
        <p>
          Wherever you live, you can ask us to show you the personal information
          we hold about you, correct it if it is wrong, or delete it. Email
          support@onemissioncollection.com and we will respond within 30 days. We
          may need to verify your identity first.
        </p>
        <p>
          <strong>California residents</strong> have rights under the CCPA/CPRA to
          know, delete, correct, and opt out of sale or sharing — we do not sell
          or share personal information as those terms are defined — and not to be
          discriminated against for exercising those rights.
        </p>
        <p>
          <strong>EU/UK residents</strong> additionally have rights to data
          portability, to restrict or object to processing, and to lodge a
          complaint with your local supervisory authority.
        </p>
        <p>
          Note that we may need to keep certain records, such as completed order
          history, to meet tax and accounting obligations even after a deletion
          request.
        </p>
      </Section>

      <Section n="07" title="How long we keep it">
        <p>
          Order records are kept as long as tax and accounting rules require,
          generally seven years. Marketing contacts are kept until you unsubscribe
          or ask for deletion. Account data is kept until you close your account.
        </p>
      </Section>

      <Section n="08" title="Security">
        <p>
          The site runs over encrypted connections, payment data is handled by PCI
          compliant processors, and access to customer information is limited to
          people who need it. No system is perfectly secure, and we cannot
          guarantee absolute security, but we will notify affected customers
          promptly if a breach involving personal information occurs.
        </p>
      </Section>

      <Section n="09" title="Children">
        <p>
          This site is not directed to children under 13, and we do not knowingly
          collect their personal information. If you believe a child has given us
          information, email us and we will delete it.
        </p>
      </Section>

      <Section n="10" title="International transfers">
        <p>
          We operate in the United States and our providers may process data here
          and elsewhere. If you order from outside the U.S., you understand your
          information will be transferred to and processed in the United States.
        </p>
      </Section>

      <Section n="11" title="Changes">
        <p>
          We will update this policy as the business changes and revise the date
          at the top. Material changes will be communicated by email or a notice
          on the site.
        </p>
      </Section>
    </LegalPage>
  );
}
