import type { Metadata } from "next";
import { LegalPage, Section } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Shipping & Returns — One Mission Collection",
  description:
    "Shipping timelines, our 30-day return window, exchanges, and how refunds work.",
};

export default function ReturnsPage() {
  return (
    <LegalPage
      eyebrow="Client Services"
      title="Shipping & Returns"
      updated="July 20, 2026"
      intro="Every piece is made for you after you order, so timelines run a little longer than stocked retail. Here's exactly what to expect, and what to do if something isn't right."
    >
      <Section n="01" title="Production time">
        <p>
          Orders are typically produced in 2&ndash;7 business days before they
          ship. During a drop, volume can push this toward the longer end. You
          will get a tracking email the moment your order leaves the facility.
        </p>
      </Section>

      <Section n="02" title="Shipping time and cost">
        <p>
          Once shipped, domestic U.S. orders usually arrive in 3&ndash;7 business
          days. Shipping cost is calculated at checkout based on your address and
          the option you choose.
        </p>
        <p>
          Delivery estimates are not guarantees. Carrier delays, weather, and
          holiday volume are outside our control.
        </p>
      </Section>

      <Section n="03" title="International orders">
        <p>
          Where we ship internationally, delivery typically takes 7&ndash;21
          business days. Any customs duties, import taxes, or brokerage fees are
          the customer&rsquo;s responsibility and are not included in what you pay
          us. We cannot mark shipments as gifts or declare a lower value.
        </p>
      </Section>

      <Section n="04" title="Returns — 30 days">
        <p>
          You can return most items within <strong>30 days of delivery</strong>.
          To be accepted, items must be unworn, unwashed, free of odor and pet
          hair, and in original condition with any tags still attached.
        </p>
        <p>
          <strong>Return shipping is paid by the customer.</strong> We recommend a
          tracked service — you are responsible for the item until it reaches us,
          and we cannot refund a return we never receive.
        </p>
        <p>
          Start a return by emailing support@onemissioncollection.com with your
          order number and what you&rsquo;re sending back. We will reply with the
          return address and instructions. Please don&rsquo;t ship anything back
          before you hear from us — unannounced returns are difficult to match to
          an order.
        </p>
      </Section>

      <Section n="05" title="Refunds">
        <p>
          Once your return arrives and passes inspection, we issue a refund to
          your original payment method within 5&ndash;10 business days. Your bank
          may take a few additional days to post it.
        </p>
        <p>
          Refunds cover the price of the item. Original shipping is
          non-refundable, and the return postage you paid is not reimbursed,
          except where the return is our fault — see below.
        </p>
      </Section>

      <Section n="06" title="Damaged, defective, or wrong items">
        <p>
          If something arrives flawed, damaged in transit, or simply isn&rsquo;t
          what you ordered, that&rsquo;s on us. Email us within 30 days of
          delivery with your order number and a photo of the issue, and we will
          send a replacement or refund you in full — including shipping. You will
          not pay return postage in these cases, and often we won&rsquo;t need the
          item back at all.
        </p>
        <p>
          Please note that the intentional distressing, fading, and wash variation
          in some of our pieces is a design feature rather than a defect.
        </p>
      </Section>

      <Section n="07" title="Exchanges">
        <p>
          Because each piece is made individually, we do not run a direct exchange
          process. If you need a different size or color, return the original for
          a refund and place a new order. That gets the right piece into
          production immediately rather than waiting on your return to arrive.
        </p>
        <p>
          Check the size guide on the product page before ordering — it is the
          single best way to avoid this.
        </p>
      </Section>

      <Section n="08" title="Items we can't accept">
        <p>
          We cannot accept returns of gift cards, digital downloads such as
          wallpapers, or items marked final sale at the time of purchase. Items
          returned worn, washed, altered, or outside the 30-day window may be
          declined or refunded in part.
        </p>
      </Section>

      <Section n="09" title="Order changes and cancellations">
        <p>
          Contact us as soon as possible if you need to change or cancel an order.
          If production has not started we can usually help. Once a piece is in
          production we generally cannot stop it, and the 30-day return policy
          becomes your route instead.
        </p>
      </Section>

      <Section n="10" title="Lost or stolen packages">
        <p>
          If tracking shows delivered but the package isn&rsquo;t there, check
          with neighbors and your building first, then contact the carrier to open
          a claim. Email us as well and we will help you chase it. We are not able
          to automatically replace packages the carrier has marked delivered, but
          we will not leave you to handle it alone.
        </p>
      </Section>

      <Section n="11" title="Wrong address">
        <p>
          Please double-check your shipping address at checkout. Orders sent to an
          address entered incorrectly and returned to sender can be reshipped once
          you cover the reshipping cost. If the package is not returned to us, we
          are not able to replace it free of charge.
        </p>
      </Section>
    </LegalPage>
  );
}
