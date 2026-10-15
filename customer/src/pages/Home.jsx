// import { useNavigate } from "react-router-dom";
// import "./Home.css";

// import ProductSection from "../components/ProductSection";


// const categories = [
//   {
//     title: "Grocery",
//     subtitle: "Fresh & Healthy",
//     description: "Daily essentials delivered to you",
//     button: "Shop Grocery",
//     path: "/products?category=grocery",
//     className: "grocery-card",
//     emoji: "🥬",
//   },
//   {
//     title: "Pharmacy",
//     subtitle: "Health & Wellness",
//     description: "Medicines, healthcare & personal care",
//     button: "Shop Pharmacy",
//     path: "/products?category=pharmacy",
//     className: "pharmacy-card",
//     emoji: "💊",
//   },
//   {
//     title: "Electronics",
//     subtitle: "Latest Gadgets",
//     description: "Mobiles, laptops, appliances & more",
//     button: "Shop Electronics",
//     path: "/products?category=electronics",
//     className: "electronics-card",
//     emoji: "📱",
//   },
//   {
//     title: "Fashion",
//     subtitle: "Style for Everyone",
//     description: "Men, Women & Kids collections",
//     button: "Shop Fashion",
//     path: "/products?category=fashion",
//     className: "fashion-card",
//     emoji: "👕",
//   },
//   {
//     title: "Local Shops",
//     subtitle: "Support Local",
//     description: "Your nearby stores on MyKasho",
//     button: "Explore Shops",
//     path: "/shops",
//     className: "shops-card",
//     emoji: "🏪",
//   },
// ];

// function Home() {
//   const navigate = useNavigate();

//   return (
//     <main className="home">
//       <section className="promo-section">
//   <div className="promo-main">
//     <div className="promo-content">
//       <span className="promo-label">MYKASHO PICKS</span>

//       <h2>
//         Everything you need,
//         <br />
//         <span>delivered locally.</span>
//       </h2>

//       <p>
//         Discover groceries, home essentials, electronics,
//         fashion and more from stores around you.
//       </p>

//       <button
//         onClick={() => navigate("/products")}
//       >
//         Shop Now →
//       </button>
//     </div>

//     <div className="promo-visual">
//       <div className="promo-product promo-product-one">🥬</div>
//       <div className="promo-product promo-product-two">🍳</div>
//       <div className="promo-product promo-product-three">📱</div>
//       <div className="promo-product promo-product-four">👕</div>
//     </div>
//   </div>

//   <div className="promo-side-grid">

//     <article
//       className="promo-card grocery-promo"
//       onClick={() =>
//         navigate("/products?category=grocery")
//       }
//     >
//       <span>FRESH EVERY DAY</span>
//       <h3>Grocery</h3>
//       <p>Daily essentials delivered</p>
//       <strong>Shop Now →</strong>
//       <div>🥬</div>
//     </article>

//     <article
//       className="promo-card kitchen-promo"
//       onClick={() =>
//         navigate("/products?category=home-kitchen")
//       }
//     >
//       <span>HOME & KITCHEN</span>
//       <h3>Kitchen Essentials</h3>
//       <p>Make your home better</p>
//       <strong>Explore →</strong>
//       <div>🍳</div>
//     </article>

//     <article
//       className="promo-card electronics-promo"
//       onClick={() =>
//         navigate("/products?category=electronics")
//       }
//     >
//       <span>SMART CHOICES</span>
//       <h3>Electronics</h3>
//       <p>Gadgets & appliances</p>
//       <strong>Shop Deals →</strong>
//       <div>📱</div>
//     </article>

//     <article
//       className="promo-card fashion-promo"
//       onClick={() =>
//         navigate("/products?category=fashion")
//       }
//     >
//       <span>STYLE PICKS</span>
//       <h3>Fashion</h3>
//       <p>Style for everyone</p>
//       <strong>Explore →</strong>
//       <div>👕</div>
//     </article>

//   </div>
// </section>

// <ProductSection />



//     </main>
//   );
// }

// export default Home;












import { useNavigate } from "react-router-dom";
import "./Home.css";

import ProductSection from "../components/ProductSection";
import CategoryProductSection from "../components/CategoryProductSection";
import ShopNearYou from "../components/ShopNearYou";

const categories = [
  {
    title: "Grocery",
    subtitle: "Fresh & Healthy",
    description: "Daily essentials delivered to you",
    button: "Shop Grocery",
    path: "/products?category=grocery",
    className: "grocery-card",
    emoji: "🥬",
  },
 {
  title: "Personal Care",
  subtitle: "Beauty & Daily Essentials",
  description: "Skincare, beauty & personal care products",
  button: "Shop Personal Care",
  path: "/products?category=pharmacy",
  className: "pharmacy-card",
  emoji: "🧴",
},
  {
    title: "Electronics",
    subtitle: "Latest Gadgets",
    description: "Mobiles, laptops, appliances & more",
    button: "Shop Electronics",
    path: "/products?category=electronics",
    className: "electronics-card",
    emoji: "📱",
  },


  {
    title: "Fashion",
    subtitle: "Style for Everyone",
    description: "Men, Women & Kids collections",
    button: "Shop Fashion",
    path: "/products?category=fashion",
    className: "fashion-card",
    emoji: "👕",
  },
  {
    title: "Local Shops",
    subtitle: "Support Local",
    description: "Your nearby stores on MyKasho",
    button: "Explore Shops",
    path: "/shops",
    className: "shops-card",
    emoji: "🏪",
  },
];

function Home() {
  const navigate = useNavigate();

  return (
    <main className="home">
      {/* PROMOTIONAL SECTION */}
      <section className="promo-section">

        {/* MAIN PROMO */}
        <div
          className="promo-main"
          onClick={() => navigate("/products")}
        >
          <img
            className="promo-main-image"
            src="https://images.pexels.com/photos/9321466/pexels-photo-9321466.jpeg"
            alt="Fresh grocery shopping"
            loading="eager"
fetchPriority="high"
decoding="async"
          />

          <div className="promo-main-overlay"></div>

          <div className="promo-content">
            <span className="promo-label">MYKASHO PICKS</span>

            <h2>
              Everything you need,
              <br />
              <span>delivered locally.</span>
            </h2>

            <p>
              Discover groceries, home essentials, electronics,
              fashion and more from stores around you.
            </p>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/products");
              }}
            >
              Shop Now →
            </button>
          </div>
        </div>

        {/* PROMO CARDS */}
        <div className="promo-side-grid">

          {/* GROCERY */}
          <article
            className="promo-card grocery-promo"
            onClick={() =>
              navigate("/products?category=grocery")
            }
          >
            <img
              src="https://images.pexels.com/photos/9321466/pexels-photo-9321466.jpeg"
              alt="Grocery"

              loading="lazy"
decoding="async"
            />

            <div className="promo-card-overlay"></div>

            <div className="promo-card-content">
              <span>FRESH EVERY DAY</span>
              <h3>Grocery</h3>
              <p>Daily essentials delivered</p>
              <strong>Shop Now →</strong>
            </div>
          </article>

          {/* KITCHEN */}
          <article
            className="promo-card kitchen-promo"
            onClick={() =>
              navigate("/products?category=home-kitchen")
            }
          >
            <img
              src="https://images.pexels.com/photos/6996085/pexels-photo-6996085.jpeg"
              alt="Kitchen essentials"
              loading="lazy"
decoding="async"
            />

            <div className="promo-card-overlay"></div>

            <div className="promo-card-content">
              <span>HOME & KITCHEN</span>
              <h3>Kitchen Essentials</h3>
              <p>Make your home better</p>
              <strong>Explore →</strong>
            </div>
          </article>

          {/* ELECTRONICS */}
          <article
            className="promo-card electronics-promo"
            onClick={() =>
              navigate("/products?category=electronics")
            }
          >
            <img
              src="https://images.pexels.com/photos/2015876/pexels-photo-2015876.jpeg"
              alt="Electronics"
              loading="lazy"
              decoding="async"
            />

            <div className="promo-card-overlay"></div>

            <div className="promo-card-content">
              <span>SMART CHOICES</span>
              <h3>Electronics</h3>
              <p>Gadgets & appliances</p>
              <strong>Shop Deals →</strong>
            </div>
          </article>

          {/* PHARMACY */}
          <article
  className="promo-card pharmacy-promo"
  onClick={() =>
    navigate("/products?category=pharmacy")
  }
>
            <img
              src="https://images.pexels.com/photos/14797864/pexels-photo-14797864.jpeg"
              alt="Pharmacy"
              loading="lazy"
              decoding="async"
            />

           <div className="promo-card-overlay"></div>

  <div className="promo-card-content">
    <span>BEAUTY & DAILY ESSENTIALS</span>
    <h3>Personal Care</h3>
    <p>Skincare, beauty & personal care</p>
    <strong>Explore →</strong>
  </div>
          </article>

          {/* FASHION */}
          <article
            className="promo-card fashion-promo"
            onClick={() =>
              navigate("/products?category=fashion")
            }
          >
            <img
              src="https://images.pexels.com/photos/7081100/pexels-photo-7081100.jpeg"
              alt="Fashion"
              loading="lazy"
              decoding="async"
            />

            <div className="promo-card-overlay"></div>

            <div className="promo-card-content">
              <span>STYLE PICKS</span>
              <h3>Fashion</h3>
              <p>Style for everyone</p>
              <strong>Explore →</strong>
            </div>
          </article>

        </div>
      </section>

      {/* PRODUCTS */}
      <ProductSection />


      <CategoryProductSection
  title="Grocery"
  category="grocery"
/>



<CategoryProductSection
  title="Electronics"
  category="electronics"
/>







{/* FASHION */}
<CategoryProductSection
  title="Fashion"
  category="fashion"
/>




{/* PERSONAL CARE */}
<CategoryProductSection
  title="Personal Care"
  category="pharmacy"
/>




<ShopNearYou />




    </main>
  );
}

export default Home;