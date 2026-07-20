import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, Section } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms & Conditions — One Mission Collection",
  description:
    "The terms that govern purchases from and use of onemissioncollection.com.",
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms & Conditions"
      updated="July 20, 2026"
      intro="These terms govern your use of onemissioncollection.com and any purchase you make from us. By using the site or placing an order, you agree to them. Please read the sections on limited releases, returns, and text messaging carefully — they affect your rights."
    >
      <Section n="01" title="Who we are">
        <p>
          One Mission Collection (&ldquo;One Mission,&rdquo; &ldquo;we,&rdquo;
          &ldquo;us&rdquo;) operates this site and sells apparel and related
          goods. Our mailing address is 1301 Mount Curve Ave, Minneapolis, MN
          55403, United States. You can reach us at
          support@onemissioncollection.com.
        </p>
      </Section>

      <Section n="02" title="Eligibility and accounts">
        <p>
          You must be at least 18, or have permission from a parent or guardian
          who agrees to these terms on your behalf, to place an order.
        </p>
        <p>
          If you create an account, you are responsible for keeping your
          password secure and for activity that happens under your account. Tell
          us promptly if you believe your account has been used without your
          permission. We may suspend or close accounts used for fraud, abuse, or
          reselling in violation of these terms.
        </p>
      </Section>

      <Section n="03" title="Products are made to order">
        <p>
          Our garments are produced individually after you order them. This has
          two practical consequences worth understanding before you buy.
        </p>
        <p>
          First, small variations are normal. Print placement can shift slightly,
          washed and distressed finishes differ from piece to piece by design, and
          colors on your screen may not match the finished garment exactly. These
          variations are characteristics of the product, not defects.
        </p>
        <p>
          Second, production usually begins soon after checkout. Once a piece
          enters production we generally cannot cancel or change the order.
          Contact us immediately if you need to correct something and we will do
          what we can.
        </p>
      </Section>

      <Section n="04" title="Limited releases">
        <p>
          Some collections are produced in a fixed quantity and are not restocked.
          When a size or piece sells out, it may be gone permanently. We do not
          guarantee that any item will return, and we may end a release early or
          extend it at our discretion.
        </p>
        <p>
          Adding an item to your cart does not reserve it. Inventory is committed
          only when your order is completed at checkout.
        </p>
      </Section>

      <Section n="05" title="Pricing, payment, and errors">
        <p>
          Prices are in U.S. dollars and may change at any time before you place
          an order. Applicable sales tax and shipping are calculated at checkout.
        </p>
        <p>
          Payments are processed by Shopify and its payment partners. We do not
          receive or store your full card number.
        </p>
        <p>
          Occasionally a product may be listed at an incorrect price or with an
          incorrect description. If that happens, we may cancel any affected order
          even after it is confirmed, and we will refund you in full. We are not
          obligated to honor an obvious pricing error.
        </p>
      </Section>

      <Section n="06" title="Order acceptance">
        <p>
          Your order is an offer to buy. A confirmation email acknowledges we
          received it, not that we accepted it. We may decline or limit any order,
          including orders that appear to be for resale, that fail address or
          payment verification, or that exceed reasonable quantities during a
          limited release.
        </p>
      </Section>

      <Section n="07" title="Shipping, returns, and refunds">
        <p>
          Shipping timelines, our 30-day return window, and how refunds work are
          covered on our{" "}
          <Link href="/returns" className="text-ink underline">
            Shipping &amp; Returns
          </Link>{" "}
          page, which forms part of these terms.
        </p>
      </Section>

      <Section n="08" title="Email marketing">
        <p>
          If you join our list, you consent to receive marketing emails from us.
          You can unsubscribe at any time using the link at the bottom of any
          email. Order confirmations and shipping updates are transactional and
          will still be sent.
        </p>
      </Section>

      <Section n="09" title="Text messaging (SMS)">
        <p>
          If you provide your mobile number and separately opt in, you agree to
          receive recurring automated marketing text messages from One Mission
          Collection at that number, including messages sent by an autodialer.
          Consent is not a condition of any purchase.
        </p>
        <p>
          Message frequency varies. Message and data rates may apply. Reply STOP
          to any message to opt out, or HELP for help. Carriers are not liable for
          delayed or undelivered messages. We do not sell your mobile number, and
          we do not share it with third parties for their own marketing.
        </p>
        <p>
          You can also opt out by emailing support@onemissioncollection.com. How
          we handle your number is described in our{" "}
          <Link href="/privacy" className="text-ink underline">
            Privacy Policy
          </Link>
          .
        </p>
      </Section>

      <Section n="10" title="Affiliate program">
        <p>
          Our affiliate program is operated through a third-party platform and is
          governed by the terms you accept when you enroll. Commissions are paid
          on qualifying completed orders and may be reversed if an order is
          refunded, charged back, or found to be fraudulent. Affiliates may not
          bid on our brand terms in paid search, misrepresent the brand, or use
          spam or unsolicited messaging to promote it.
        </p>
      </Section>

      <Section n="11" title="Intellectual property">
        <p>
          The One Mission name and wordmark, our designs, graphics, photography,
          and site content are owned by us or our licensors and protected by
          intellectual property law. We grant you a personal, non-transferable
          right to view this site and to use any wallpapers or digital goods we
          give away for personal, non-commercial purposes.
        </p>
        <p>
          You may not reproduce our designs on merchandise, resell our digital
          files, or use our marks to suggest a partnership or endorsement without
          written permission.
        </p>
      </Section>

      <Section n="12" title="Your content">
        <p>
          If you send us photos, reviews, or other content, or tag us publicly,
          you give us a non-exclusive, royalty-free license to use, display, and
          reshare that content in connection with the brand, with credit where
          practical. You confirm you have the right to share it and that it does
          not infringe anyone else&rsquo;s rights. You can ask us to stop using
          your content at any time by emailing us.
        </p>
      </Section>

      <Section n="13" title="Acceptable use">
        <p>
          Do not use this site to break the law, infringe others&rsquo; rights,
          scrape or copy the site at scale, interfere with its operation, attempt
          to access accounts or systems you are not authorized to reach, or buy
          products with the intent of unauthorized commercial resale.
        </p>
      </Section>

      <Section n="14" title="Disclaimers">
        <p>
          The site and products are provided &ldquo;as is.&rdquo; To the fullest
          extent permitted by law, we disclaim implied warranties including
          merchantability, fitness for a particular purpose, and
          non-infringement. We do not warrant that the site will be uninterrupted
          or error-free.
        </p>
        <p>
          Nothing in these terms limits any rights you have under consumer
          protection laws that cannot be waived.
        </p>
      </Section>

      <Section n="15" title="Limitation of liability">
        <p>
          To the fullest extent permitted by law, we are not liable for indirect,
          incidental, special, or consequential damages, or lost profits, arising
          from your use of the site or products. Our total liability for any claim
          relating to an order is limited to the amount you paid for that order.
        </p>
      </Section>

      <Section n="16" title="Indemnification">
        <p>
          You agree to indemnify and hold harmless One Mission Collection and its
          owners and staff from claims and costs arising out of your misuse of the
          site, your violation of these terms, or your infringement of
          someone else&rsquo;s rights.
        </p>
      </Section>

      <Section n="17" title="Governing law and disputes">
        <p>
          These terms are governed by the laws of the State of Minnesota, without
          regard to its conflict of laws rules. Any dispute will be brought in the
          state or federal courts located in Hennepin County, Minnesota, and you
          consent to their jurisdiction.
        </p>
        <p>
          Before filing anything, please email us. Most problems are faster to fix
          directly.
        </p>
      </Section>

      <Section n="18" title="Changes to these terms">
        <p>
          We may update these terms as the business changes. The date at the top
          reflects the most recent revision, and changes apply from the moment
          they are posted. The terms in effect when you placed an order govern
          that order.
        </p>
      </Section>
    </LegalPage>
  );
}
