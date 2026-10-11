import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./ProductSection.css";

function ProductSection() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

useEffect(() => {
  const fetchProducts = async () => {
    try {
      const response = await api.get("/products/featured");

      const data = response.data;

      setProducts(data.products || data.data || []);
      
    } catch (error) {
      console.error("Failed to load featured products:", error);
      setError("Unable to load featured products");
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, []);

  const getRating = (product) => {
    const rating =
      product.averageRating ??
      product.rating ??
      product.reviewSummary?.averageRating;

    const reviewCount =
      product.totalReviews ??
      product.reviewCount ??
      product.reviewSummary?.totalReviews ??
      0;

    return {
      rating: Number(rating) || 0,
      reviewCount: Number(reviewCount) || 0,
    };
  };

const getStockText = (product) => {
  const quantity = Number(product.inventory?.quantity ?? 0);
  const reservedQuantity = Number(
    product.inventory?.reservedQuantity ?? 0
  );

  const availableStock = Math.max(
    quantity - reservedQuantity,
    0
  );

  if (availableStock <= 0) {
    return {
      text: "Out of stock",
      className: "out-of-stock",
    };
  }

  if (availableStock <= 5) {
    return {
      text: `Only ${availableStock} left`,
      className: "low-stock",
    };
  }

  return {
    text: `${availableStock} in stock`,
    className: "in-stock",
  };
};

  if (loading) {
    return (
      <section className="products-section">
        <div className="section-heading">
          <div>
            <span>SHOP NOW</span>
            <h2>Popular Products</h2>
          </div>
        </div>

        <div className="products-loading">
          Loading products...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="products-section">
        <div className="products-error">{error}</div>
      </section>
    );
  }

  return (
    <section className="products-section">
      <div className="section-heading">
        <div>
          <span>SHOP NOW</span>
          <h2>Popular Products</h2>
        </div>

        <button onClick={() => navigate("/products")}>
          View All →
        </button>
      </div>

      {products.length === 0 ? (
        <div className="products-empty">
          No products available right now.
        </div>
      ) : (
        <div className="products-grid">
          {products.slice(0, 10).map((product) => {
            const { rating, reviewCount } = getRating(product);
            const stock = getStockText(product);

            return (
              <article
                className="product-card"
                key={product.id}
                onClick={() => navigate(`/products/${product.id}`)}
              >
                <div className="product-image">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                        loading="lazy"
  decoding="async"
  fetchPriority="low"
                    />
                  ) : (
                    <span>📦</span>
                  )}
                </div>

                <div className="product-info">
                  <h3>{product.name}</h3>

                  {product.category?.name && (
                    <small>{product.category.name}</small>
                  )}

                  {/* Rating */}
                  {reviewCount > 0 && (
                    <div className="product-rating">
                      <span className="rating-stars">
                        {"★".repeat(Math.round(rating))}
                        {"☆".repeat(5 - Math.round(rating))}
                      </span>

                      <span className="rating-value">
                        {rating.toFixed(1)}
                      </span>

                      <span className="review-count">
                        ({reviewCount})
                      </span>
                    </div>
                  )}

                  {/* Stock */}
                  <div className={`product-stock ${stock.className}`}>
                    {stock.text}
                  </div>

                  <div className="product-bottom">
                    <strong>₹{product.price}</strong>

                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        navigate(`/products/${product.id}`);
                      }}
                    >
                      View
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default ProductSection;