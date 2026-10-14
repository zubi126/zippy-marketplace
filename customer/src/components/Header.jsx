


import {  useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "./Header.css";

/* Small inline icon set (no extra package needed) */
const PATHS = {
  pin: <><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></>,
  chevron: <path d="m6 9 6 6 6-6" />,
  truck: <><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" /><path d="M15 18H9" /><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" /><circle cx="17" cy="18" r="2" /><circle cx="7" cy="18" r="2" /></>,
  shield: <><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="m9 12 2 2 4-4" /></>,
  tag: <><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" /><circle cx="7.5" cy="7.5" r=".5" fill="currentColor" /></>,
  phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0 1 22 16.92z" />,
  store: <><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" /><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" /><path d="M2 7h20" /></>,
  package: <><path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" /><path d="M12 22V12" /><path d="m3.3 7 8.7 5 8.7-5" /></>,
  search: <><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  receipt: <><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 13h4" /><path d="M10 17h4" /></>,
  cart: <><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></>,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></>,
  basket: <><path d="m15 11-1 9" /><path d="m19 11-4-7" /><path d="M2 11h20" /><path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4" /><path d="m5 11 4-7" /><path d="m9 11 1 9" /></>,
  pill: <><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" /><path d="m8.5 8.5 7 7" /></>,
  mobile: <><rect width="14" height="20" x="5" y="2" rx="2" /><path d="M12 18h.01" /></>,
  shirt: <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />,
  flame: <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z" />,
};

function Icon({ name, size = 20 }) {
  return (
    <svg
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}

function Header() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const { isLoggedIn, user } = useAuth();
const [cartCount, setCartCount] = useState(0);
  
const [searchCategory, setSearchCategory] = useState("all");

const [showCategories, setShowCategories] = useState(false);


useEffect(() => {
  const fetchCartCount = async () => {
    if (!isLoggedIn) {
      setCartCount(0);
      return;
    }

    try {
      const response = await api.get("/cart");

      const items = response.data?.cart?.items || [];

      const totalQuantity = items.reduce(
        (total, item) => total + item.quantity,
        0
      );

      setCartCount(totalQuantity);
    } catch (error) {
      console.error("Failed to load cart count:", error);
      setCartCount(0);
    }
  };

  // Fetch when Header loads / login state changes
  fetchCartCount();

  // Fetch again whenever Cart tells us it changed
  window.addEventListener("cartUpdated", fetchCartCount);

  return () => {
    window.removeEventListener("cartUpdated", fetchCartCount);
  };
}, [isLoggedIn]);



  const categories = [
    { name: "Grocery", subtitle: "Fruits, Vegetables & More", path: "/products?category=grocery", icon: "basket", tone: "green" },
    { name: "Pharmacy", subtitle: "Medicines & Wellness", path: "/products?category=pharmacy", icon: "pill", tone: "rose" },
    { name: "Electronics", subtitle: "Mobiles, Appliances", path: "/products?category=electronics", icon: "mobile", tone: "blue" },
    { name: "Fashion", subtitle: "Men, Women & Kids", path: "/products?category=fashion", icon: "shirt", tone: "violet" },
    { name: "Local Shops", subtitle: "Your Nearby Stores", path: "/shops", icon: "store", tone: "amber" },
  ];

  return (
    <header className="site-header">
      {/* Top information bar */}
      <div className="top-bar">
        <div className="top-location">
          <Icon name="pin" size={20} />
          <div>
            <span>Deliver to</span>
            <strong>Anantnag, Jammu & Kashmir</strong>
          </div>
          <Icon name="chevron" size={16} />
        </div>

        <div className="top-features">
          <div>
            <span className="feature-icon"><Icon name="truck" size={18} /></span>
            <div>
              <strong>Fast Delivery</strong>
              <small>Local Shops & Stores</small>
            </div>
          </div>
          <div>
            <span className="feature-icon"><Icon name="shield" size={18} /></span>
            <div>
              <strong>Genuine Products</strong>
              <small>Trusted Sellers</small>
            </div>
          </div>
          <div>
            <span className="feature-icon"><Icon name="tag" size={18} /></span>
            <div>
              <strong>Best Prices</strong>
              <small>Everyday Deals</small>
            </div>
          </div>
        </div>

        <div className="top-actions">
         <button type="button" onClick={() => navigate("/help")}>
    <Icon name="phone" size={15} /> Need Help?
  </button>
          <button type="button"><Icon name="store" size={15} /> Become a Seller</button>
          <button type="button" onClick={() => navigate("/orders")}>
            <Icon name="package" size={15} /> Track Order
          </button>
        </div>
      </div>

      {/* Main header */}
      <div className="main-header">
        <div className="brand" onClick={() => navigate("/")} role="button" tabIndex={0}>
          <div className="brand-icon">M</div>
          <div>
            <h1>My<span>Kasho</span></h1>
            <p>Everything. Delivered.</p>
          </div>
        </div>

        {/* Location */}
        <button
          className="location-selector"
          type="button"
          onClick={() => navigate(isLoggedIn ? "/addresses" : "/login")}
        >
          <span className="location-icon"><Icon name="pin" size={20} /></span>
          <div>
            <small>Deliver to</small>
            <strong>{isLoggedIn ? "My Address" : "Anantnag"}</strong>
          </div>
          <Icon name="chevron" size={16} />
        </button>




        {/* Search */}
       <div className="search-box">
  <div className="select-wrap">
    <select
  value={searchCategory}
  onChange={(event) => setSearchCategory(event.target.value)}
  aria-label="Category"
>
      <option value="all">All Categories</option>
      <option value="grocery">Grocery</option>
      <option value="pharmacy">Pharmacy</option>
      <option value="electronics">Electronics</option>
      <option value="fashion">Fashion</option>
      <option value="shops">Local Shops</option>
    </select>
  </div>

  <input
    type="text"
    value={searchQuery}
    onChange={(event) => setSearchQuery(event.target.value)}
    onKeyDown={(event) => {
      if (event.key === "Enter") {
        const query = searchQuery.trim();

     if (query) {
  if (searchCategory === "shops") {
    navigate(`/shops/search?q=${encodeURIComponent(query)}`);
    return;
  }

  const categoryParam =
    searchCategory !== "all"
      ? `&category=${encodeURIComponent(searchCategory)}`
      : "";

  navigate(
    `/products?search=${encodeURIComponent(query)}${categoryParam}`
  );
}
      }
    }}
    placeholder="Search for products, brands or shops..."
  />




  <button
    type="button"
    aria-label="Search"
    onClick={() => {
      const query = searchQuery.trim();

   if (query) {
  if (searchCategory === "shops") {
    navigate(`/shops/search?q=${encodeURIComponent(query)}`);
    return;
  }

  const categoryParam =
    searchCategory !== "all"
      ? `&category=${encodeURIComponent(searchCategory)}`
      : "";

  navigate(
    `/products?search=${encodeURIComponent(query)}${categoryParam}`
  );
}
    }}
  >
    <Icon name="search" size={22} />
  </button>
</div>






        {/* Account */}
        <button
          className="header-action account-button"
          type="button"
          onClick={() => navigate(isLoggedIn ? "/profile" : "/login")}
        >
          <span className="action-icon"><Icon name="user" size={20} /></span>
          <div>
            <small>Hello</small>
            <strong>{isLoggedIn ? user?.name || "Profile" : "Login"}</strong>
          </div>
        </button>

        {/* Orders */}
        <button
          className="header-action orders-button"
          type="button"
          onClick={() => navigate("/orders")}
        >
          <span className="action-icon"><Icon name="receipt" size={20} /></span>
          <div>
            <strong>Orders</strong>
            <small>Track & Manage</small>
          </div>
        </button>

        {/* Cart */}
        <button className="cart-button" type="button" onClick={() => navigate("/cart")}>
          <Icon name="cart" size={22} />
          <strong>Cart</strong>
          <span className="cart-count">{cartCount}</span>
        </button>
      </div>

      {/* Category navigation */}
      <nav className="category-nav">
       <button
  className="all-category-button"
  type="button"
  onClick={() => setShowCategories((prev) => !prev)}
>
  <Icon name="grid" size={18} />
  <strong>All Categories</strong>
  <Icon name="chevron" size={16} />
</button>





{showCategories && (
  <div className="all-categories-dropdown">
    {categories.map((category) => (
      <button
        key={category.name}
        type="button"
        onClick={() => {
          navigate(category.path);
          setShowCategories(false);
        }}
      >
        <span className={`category-icon tone-${category.tone}`}>
          <Icon name={category.icon} size={20} />
        </span>

        <div>
          <strong>{category.name}</strong>
          <small>{category.subtitle}</small>
        </div>
      </button>
    ))}
  </div>
)}







        {categories.map((category) => (
          <button
            key={category.name}
            className="category-item"
            type="button"
            onClick={() => navigate(category.path)}
          >
            <span className={`category-icon tone-${category.tone}`}>
              <Icon name={category.icon} size={20} />
            </span>
            <div>
              <strong>{category.name}</strong>
              <small>{category.subtitle}</small>
            </div>
          </button>
        ))}

        <button
          className="category-item deals-item"
          type="button"
          onClick={() => navigate("/products?sort=deals")}
        >
          <span className="category-icon tone-fire">
            <Icon name="flame" size={20} />
          </span>
          <div>
            <strong>Deals</strong>
            <small>Best Offers</small>
          </div>
        </button>

        <button className="category-item" type="button" onClick={() => navigate("/orders")}>
          <span className="category-icon tone-green">
            <Icon name="tag" size={20} />
          </span>
          <div>
            <strong>Orders</strong>
            <small>Track Your Orders</small>
          </div>
        </button>
      </nav>
    </header>
  );
}

export default Header;