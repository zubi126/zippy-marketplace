
import { Link } from "react-router-dom";
import "./Footer.css";

const categories = [
  { label: "Grocery", path: "/products?category=grocery" },
  { label: "Home & Kitchen", path: "/products?category=home-kitchen" },
  { label: "Electronics", path: "/products?category=electronics" },
  { label: "Pharmacy", path: "/products?category=pharmacy" },
  { label: "Fashion", path: "/products?category=fashion" },
  { label: "Local Shops", path: "/shops" },
];

const supportLinks = [
  { label: "Contact Us", path: "/contact" },
  { label: "Help & Support", path: "/help" },
  { label: "Track Your Order", path: "/orders" },
  { label: "Shipping & Delivery", path: "/shipping-policy" },
  { label: "Refund Policy", path: "/refund-policy" },
  { label: "Cancellation Policy", path: "/cancellation-policy" },
];

const policyLinks = [
  { label: "Terms & Conditions", path: "/terms-and-conditions" },
  { label: "Privacy Policy", path: "/privacy-policy" },
];

function FooterLinks({ title, links }) {
  return (
    <div className="footer-column">
      <h3>{title}</h3>
      <ul>
        {links.map((item) => (
          <li key={item.path}>
            <Link to={item.path}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            MyKasho<span>.</span>
          </Link>

          <p>
            Everything you need, delivered locally.
            Discover everyday essentials and support
            local businesses around you.
          </p>

          <p className="footer-location">
            Supporting local businesses in Kashmir
          </p>
        </div>

        <FooterLinks
          title="Shop by Category"
          links={categories}
        />

        <FooterLinks
          title="Customer Support"
          links={supportLinks}
        />

        <FooterLinks
          title="Policies"
          links={policyLinks}
        />

        <div className="footer-column">
          <h3>Your Account</h3>
          <ul>
            <li><Link to="/profile">My Account</Link></li>
            <li><Link to="/orders">My Orders</Link></li>
            <li><Link to="/addresses">My Addresses</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} MyKasho.
          All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
