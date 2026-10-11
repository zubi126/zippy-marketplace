import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./CategoryProductSection.css";

function CategoryProductSection({ title, category }) {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get(
          `/products/featured?category=${encodeURIComponent(category)}`
        );

        const data = response.data;

        setProducts(data.products || data.data || []);
      } catch (error) {
        console.error(`Failed to load ${category} products:`, error);
        setError(`Unable to load ${title.toLowerCase()} products`);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, title]);

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
      <section className="products-section category-products-section">
        <div className="category-section-heading">
          <div>
            <span>SHOP NOW</span>
            <h2>{title}</h2>
          </div>
        </div>

        <div className="category-products-loading">
          Loading {title.toLowerCase()} products...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="products-section category-products-section">
        <div className="category-products-error">
          {error}
        </div>
      </section>
    );
  }

  // Agar category mein koi featured product nahi hai
  // toh section Home par show nahi hoga.
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="products-section category-products-section">

      <div className="category-section-heading">

        <div>
          <span>FEATURED</span>
          <h2>{title}</h2>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate(`/products?category=${category}`)
          }
        >
          View All →
        </button>

      </div>

      <div className="category-products-grid">

        {products.slice(0, 10).map((product) => {

          const { rating, reviewCount } =
            getRating(product);

          const stock = getStockText(product);

          return (
            <article
              className="category-product-card"
              key={product.id}
              onClick={() =>
                navigate(`/products/${product.id}`)
              }
            >

              {/* Product Image */}
              <div className="category-product-image">

                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                  />
                ) : (
                  <span>📦</span>
                )}

              </div>

              {/* Product Information */}
              <div className="category-product-info">

                <h3>{product.name}</h3>

                {product.category?.name && (
                  <small>
                    {product.category.name}
                  </small>
                )}

                {/* Rating */}
                {reviewCount > 0 && (
                  <div className="category-product-rating">

                    <span className="category-rating-stars">
                      {"★".repeat(
                        Math.round(rating)
                      )}

                      {"☆".repeat(
                        5 - Math.round(rating)
                      )}
                    </span>

                    <span className="category-rating-value">
                      {rating.toFixed(1)}
                    </span>

                    <span className="category-review-count">
                      ({reviewCount})
                    </span>

                  </div>
                )}

                {/* Stock */}
                <div
                  className={`category-product-stock ${stock.className}`}
                >
                  {stock.text}
                </div>

                {/* Price + View */}
                <div className="category-product-bottom">

                  <strong>
                    ₹{product.price}
                  </strong>

                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();

                      navigate(
                        `/products/${product.id}`
                      );
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

    </section>
  );
}

export default CategoryProductSection;