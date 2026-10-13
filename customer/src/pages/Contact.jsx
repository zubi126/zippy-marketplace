
import "./InfoPage.css";

function Contact() {
  return (
    <main className="info-page">
      <div className="info-page-header">
        <span className="info-eyebrow">MYKASHO SUPPORT</span>

        <h1>Contact Us</h1>

        <p>
          Need help with an order or shopping on MyKasho?
          We are here to help.
        </p>
      </div>

      <section className="info-card">
        <h2>How can we help?</h2>

        <p>
          For questions about orders, products, delivery,
          cancellations or refunds, contact our customer
          support team using the details below.
        </p>

        <div className="contact-item">
          <h3>Order Support</h3>
          <p>
            Please keep your order number ready when
            contacting us about an existing order.
          </p>
        </div>

        <div className="contact-item">
          <h3>Phone / WhatsApp</h3>
          <p>
            <a href="tel:+919906920712">
              +91 99069 20712
            </a>
          </p>
          <p>
            You can call this number for MyKasho-related
            enquiries.
          </p>
        </div>

        <div className="contact-item">
          <h3>Email Support</h3>
          <p>
            <a href="mailto:zubairahmadbhat920712@gmail.com">
              zubairahmadbhat920712@gmail.com
            </a>
          </p>
          <p>
            Please include your order number if your
            enquiry concerns an order.
          </p>
        </div>

        <div className="contact-item">
          <h3>Business Location</h3>
          <p>
            Anantnag, Jammu and Kashmir, India
          </p>
        </div>
      </section>
    </main>
  );
}

export default Contact;
