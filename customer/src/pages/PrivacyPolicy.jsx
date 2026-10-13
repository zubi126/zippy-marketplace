
import "./InfoPage.css";

function PrivacyPolicy() {
  const lastUpdated = "13 October 2026";

  return (
    <main className="info-page">
      <div className="info-page-header">
        <span className="info-eyebrow">MYKASHO POLICIES</span>
        <h1>Privacy Policy</h1>
        <p>
          Your privacy matters to us. This policy explains
          how MyKasho collects, uses, stores and shares
          information when you use our marketplace.
        </p>
        <p>
          <strong>Last updated:</strong> {lastUpdated}
        </p>
      </div>

      <section className="info-card">
        <h2>1. About This Policy</h2>
        <p>
          MyKasho is a marketplace designed to connect
          customers with local shops and other sellers.
          This policy applies to information collected
          through our website, customer account and
          related services.
        </p>
        <p>
          Before launch, MyKasho will publish its
          applicable legal entity and contact details
          here.
        </p>

        <h2>2. Information We Collect</h2>
        <p>Depending on how you use MyKasho, we may collect:</p>
        <ul>
          <li>
            <strong>Account information:</strong> name,
            phone number, email address and authentication
            information.
          </li>
          <li>
            <strong>Delivery information:</strong> delivery
            address, locality, PIN code and delivery
            instructions you provide.
          </li>
          <li>
            <strong>Order information:</strong> products
            ordered, quantities, order status, delivery
            details and order history.
          </li>
          <li>
            <strong>Payment information:</strong> payment
            status, transaction references and related
            records needed to process orders. Online
            payment details may be handled by the payment
            provider.
          </li>
          <li>
            <strong>Support communications:</strong>
            information you send when requesting help or
            reporting a problem.
          </li>
          <li>
            <strong>Technical information:</strong> limited
            device, browser, usage and diagnostic
            information where collected by our services.
          </li>
        </ul>

        <h2>3. How We Use Your Information</h2>
        <p>We may use your information to:</p>
        <ul>
          <li>Create and manage your customer account.</li>
          <li>Verify your phone number and secure access.</li>
          <li>Process orders, payments and refunds.</li>
          <li>Coordinate order preparation and delivery.</li>
          <li>Provide customer support and resolve disputes.</li>
          <li>Prevent fraud, abuse and unauthorized access.</li>
          <li>Maintain, troubleshoot and improve MyKasho.</li>
          <li>Meet applicable legal and regulatory obligations.</li>
        </ul>

        <h2>4. When Information May Be Shared</h2>
        <p>
          We may share relevant information with parties
          that need it to provide the service, including:
        </p>
        <ul>
          <li>
            <strong>Sellers and local shops:</strong> order
            items and necessary fulfillment details.
          </li>
          <li>
            <strong>Delivery personnel:</strong> recipient
            details, delivery address and information
            needed to complete a delivery.
          </li>
          <li>
            <strong>Service providers:</strong> hosting,
            database, OTP, payment and technical support
            providers, as applicable.
          </li>
          <li>
            <strong>Authorities:</strong> when disclosure
            is required by applicable law or valid legal
            process.
          </li>
        </ul>
        <p>
          We do not describe customer information as
          being shared with every seller or rider by
          default. Access should be limited to what is
          needed for the relevant order or task.
        </p>

        <h2>5. OTPs and Account Security</h2>
        <p>
          MyKasho may use one-time passwords (OTPs) to
          verify phone numbers or support account
          operations. Never share an OTP or password with
          anyone claiming to be customer support.
        </p>
        <p>
          We use security measures intended to protect
          accounts and information. No internet service
          can guarantee absolute security.
        </p>

        <h2>6. Payments</h2>
        <p>
          Payment processing may be provided by an
          external payment service. Your payment may
          therefore be subject to that provider's terms
          and privacy policy. MyKasho should only retain
          payment records needed for order management,
          refunds, reconciliation and legal requirements.
        </p>

        <h2>7. Data Retention</h2>
        <p>
          We retain information for as long as reasonably
          necessary to provide our services, maintain
          records, resolve disputes, prevent fraud and
          comply with applicable legal obligations.
          Retention periods depend on the type of
          information and its purpose.
        </p>

        <h2>8. Your Choices and Requests</h2>
        <p>
          You may contact MyKasho to request access to,
          correction of or deletion of personal
          information, subject to applicable law and
          legitimate record-retention requirements.
        </p>
        <p>
          Some information may need to be retained for
          completed orders, financial records, security
          or legal compliance. We will explain any
          applicable limitations when responding.
        </p>

        <h2>9. Cookies and Similar Technologies</h2>
        <p>
          MyKasho may use cookies or similar technologies
          where needed for website functionality,
          preferences, security or analytics. Any
          analytics or advertising technologies actually
          enabled should be disclosed here, together
          with relevant choices available to users.
        </p>

        <h2>10. Children's Privacy</h2>
        <p>
          MyKasho is intended for people who can legally
          use the service. If we learn that personal
          information has been collected in a way that
          violates applicable children's privacy
          requirements, we will take appropriate steps
          as required by law.
        </p>

        <h2>11. Changes to This Policy</h2>
        <p>
          We may update this policy when our services,
          practices or legal obligations change. The
          updated version will be published on this page
          with a revised update date.
        </p>

        <h2>12. Contact and Privacy Requests</h2>
        <p>
          For privacy questions, data correction requests
          or deletion requests, please use the MyKasho
          Contact Us page. Our official support and
          privacy contact details will be published
          before public launch.
        </p>
      </section>
    </main>
  );
}

export default PrivacyPolicy;
