
import { Link } from "react-router-dom";
import "./InfoPage.css";

const helpTopics = [
  {
    title: "Orders & Tracking",
    description:
      "Find your order status and understand order updates.",
    link: "/orders",
    linkText: "View My Orders",
  },
  {
    title: "Shipping & Delivery",
    description:
      "Learn about delivery coverage, charges and delays.",
    link: "/shipping-policy",
    linkText: "Read Delivery Policy",
  },
  {
    title: "Refunds",
    description:
      "Understand refund eligibility and how to request assistance.",
    link: "/refund-policy",
    linkText: "Read Refund Policy",
  },
  {
    title: "Cancellations",
    description:
      "Check the rules that apply when you want to cancel an order.",
    link: "/cancellation-policy",
    linkText: "Cancellation Policy",
  },
  {
    title: "Payments",
    description:
      "Get help with payment status, duplicate charges or payment issues.",
    link: "/contact",
    linkText: "Contact Support",
  },
  {
    title: "Account & Addresses",
    description:
      "Manage your account information and saved delivery addresses.",
    link: "/profile",
    linkText: "My Account",
  },
];

function HelpSupport() {
  return (
    <main className="info-page">
      <div className="info-page-header">
        <span className="info-eyebrow">WE ARE HERE TO HELP</span>
        <h1>Help & Support</h1>
        <p>
          Have a question about MyKasho? Choose a topic
          below to find the relevant information.
        </p>
      </div>

      <section className="info-card">
        <h2>How can we help you?</h2>
        <p>
          Select the topic that best matches your question.
          For order-related issues, keep your order number
          ready when contacting support.
        </p>

        <div className="help-topics">
          {helpTopics.map((topic) => (
            <article className="help-topic" key={topic.title}>
              <h3>{topic.title}</h3>
              <p>{topic.description}</p>
              <Link to={topic.link}>{topic.linkText} →</Link>
            </article>
          ))}
        </div>

        <div className="contact-item">
          <h3>Still need help?</h3>
          <p>
            If you cannot find an answer, contact the
            MyKasho support team with a description of
            your issue and your order number, if applicable.
          </p>
          <Link to="/contact">Contact Us →</Link>
        </div>
      </section>
    </main>
  );
}

export default HelpSupport;
