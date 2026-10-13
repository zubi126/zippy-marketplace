
import "./InfoPage.css";

function TermsAndConditions() {
  const lastUpdated = "13 October 2026";

  return (
    <main className="info-page">
      <div className="info-page-header">
        <span className="info-eyebrow">MYKASHO POLICIES</span>
        <h1>Terms & Conditions</h1>
        <p>
          Please read these terms before using MyKasho
          to browse products, place orders or access
          our marketplace services.
        </p>
        <p>
          <strong>Last updated:</strong> {lastUpdated}
        </p>
      </div>

      <section className="info-card">
        <h2>1. About MyKasho</h2>
        <p>
          MyKasho is a marketplace intended to help
          customers discover products and shop from
          participating local stores and sellers.
          Available categories and services may vary
          by location.
        </p>
        <p>
          The legal name and contact details of the
          business operating MyKasho will be published
          before public launch.
        </p>

        <h2>2. Acceptance of These Terms</h2>
        <p>
          By accessing or using MyKasho, you agree to
          these Terms & Conditions and the applicable
          policies published on our website. If you do
          not agree, please do not use the service.
        </p>

        <h2>3. Customer Accounts</h2>
        <ul>
          <li>
            Provide accurate and up-to-date account
            and contact information.
          </li>
          <li>
            Keep your password and verification codes
            confidential.
          </li>
          <li>
            You are responsible for activity carried
            out through your account, subject to
            applicable law.
          </li>
          <li>
            Notify MyKasho if you suspect unauthorized
            access to your account.
          </li>
          <li>
            Do not create accounts or use the platform
            for fraudulent, unlawful or abusive purposes.
          </li>
        </ul>

        <h2>4. Products and Sellers</h2>
        <p>
          Products may be listed by participating
          sellers and local shops. Product descriptions,
          availability, prices and images should be
          reviewed before placing an order.
        </p>
        <p>
          Availability can change, and an item may
          become unavailable after it has been displayed.
          If an order cannot be fulfilled, MyKasho or
          the relevant seller will communicate the
          applicable next steps.
        </p>

        <h2>5. Prices, Charges and Offers</h2>
        <p>
          Prices and applicable delivery charges will
          be shown during the ordering process. The
          amount presented in the final order summary
          before confirmation is the amount applicable
          to that order, subject to disclosed terms
          and corrections required by law.
        </p>
        <p>
          Offers and discounts may have separate
          eligibility conditions, validity periods
          or usage limits.
        </p>

        <h2>6. Placing and Accepting Orders</h2>
        <p>
          Submitting an order is a request to purchase
          the selected items. Order confirmation,
          seller acceptance and availability may depend
          on the workflow shown on MyKasho.
        </p>
        <p>
          MyKasho or a seller may need to decline or
          cancel an order if an item is unavailable,
          a listing contains a material error, delivery
          cannot be arranged, or another legitimate
          reason applies. Customers will be informed
          of relevant changes and any applicable refund.
        </p>

        <h2>7. Payments</h2>
        <p>
          Available payment methods may include cash
          on delivery and online payment, depending
          on the order and location.
        </p>
        <p>
          Online payments may be processed by a
          third-party payment provider. Customers must
          follow the provider's applicable payment
          instructions. Payment confirmation, refunds
          and transaction records are handled according
          to the applicable payment and refund process.
        </p>

        <h2>8. Delivery</h2>
        <p>
          Delivery availability, charges and estimated
          times depend on the delivery location,
          seller readiness and rider availability.
          Any delivery estimate provided is an estimate
          unless explicitly stated otherwise.
        </p>
        <p>
          Customers should provide an accurate address
          and reachable contact details and cooperate
          with reasonable delivery arrangements.
        </p>

        <h2>9. Cancellations, Returns and Refunds</h2>
        <p>
          Order cancellation, return and refund
          eligibility is governed by the applicable
          Refund Policy and Cancellation Policy.
          Certain products may have specific restrictions
          where permitted by applicable law.
        </p>
        <p>
          Nothing in these terms removes any rights
          that customers have under applicable law.
        </p>

        <h2>10. Acceptable Use</h2>
        <p>You must not:</p>
        <ul>
          <li>Use MyKasho for unlawful activities or fraud.</li>
          <li>
            Attempt unauthorized access to accounts,
            systems, APIs or other users' information.
          </li>
          <li>
            Interfere with the security or normal
            operation of the platform.
          </li>
          <li>
            Submit false orders, misleading information
            or abusive support requests.
          </li>
          <li>
            Copy, scrape or misuse platform content
            in violation of applicable law or rights.
          </li>
        </ul>

        <h2>11. Intellectual Property</h2>
        <p>
          MyKasho branding, website design and original
          platform content may be protected by
          intellectual property laws. Product names,
          trademarks and content supplied by sellers
          may belong to their respective owners.
        </p>
          <p>
          You may not use MyKasho's branding or
          protected content without appropriate
          authorization.
        </p>

        <h2>12. Platform Availability</h2>
        <p>
          We aim to keep MyKasho available and
          functioning properly but cannot guarantee
          uninterrupted access. Maintenance, technical
          failures, network issues or events outside
          our reasonable control may affect service.
        </p>

        <h2>13. Suspension and Account Restrictions</h2>
        <p>
          MyKasho may restrict or suspend access where
          reasonably necessary to protect customers,
          sellers, the platform or comply with law.
          Where appropriate and legally permitted,
          we will provide information about the
          restriction and any available resolution process.
        </p>

        <h2>14. Liability and Consumer Rights</h2>
        <p>
          MyKasho will handle its responsibilities
          according to applicable law. Nothing in
          these terms excludes liability or limits
          consumer rights where such exclusion or
          limitation is prohibited by law.
        </p>

        <h2>15. Changes to These Terms</h2>
        <p>
          We may update these terms when our services,
          business processes or legal requirements
          change. The updated version will be published
          on this page with a revised update date.
        </p>

        <h2>16. Governing Law and Disputes</h2>
        <p>
          These terms are subject to applicable laws
          of India. Any dispute will be addressed
          through the procedures and forums available
          under applicable law. Nothing in this section
          removes a customer's statutory rights.
        </p>

        <h2>17. Contact Us</h2>
        <p>
          For questions about these terms, use the
          Contact Us page on MyKasho. Official business
          and support contact details will be published
          before public launch.
        </p>
      </section>
    </main>
  );
}

export default TermsAndConditions;
