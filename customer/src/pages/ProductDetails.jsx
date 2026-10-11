import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [ratingData, setRatingData] = useState({
    totalReviews: 0,
    averageRating: 0,
  });

  const [loading, setLoading] = useState(true);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const response = await api.get(`/products/${id}`);

        setProduct(
          response.data.product ||
            response.data.data ||
            response.data
        );
      } catch (error) {
        console.error("Product details error:", error);
        setError("Unable to load this product.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewLoading(true);

        const response = await api.get(
          `/reviews/product/${id}`
        );

        setReviews(response.data.reviews || []);

        setRatingData({
          totalReviews: response.data.totalReviews || 0,
          averageRating: response.data.averageRating || 0,
        });
      } catch (error) {
        console.error("Reviews error:", error);
      } finally {
        setReviewLoading(false);
      }
    };

    fetchReviews();
  }, [id]);




  // const handleAddToCart = async () => {
  //   try {
  //     setAddingToCart(true);

  //     await api.post("/cart/items", {
  //       productId: product.id,
  //       quantity: 1,
  //     });

  //     navigate("/cart");
  //   } catch (error) {
  //     console.error("Add to cart error:", error);

  //     alert(
  //       error.response?.data?.message ||
  //         "Unable to add product to cart"
  //     );
  //   } finally {
  //     setAddingToCart(false);
  //   }
  // };

  // if (loading) {
  //   return (
  //     <main className="product-details-message">
  //       Loading product...
  //     </main>
  //   );
  // }

  // if (error || !product) {
  //   return (
  //     <main className="product-details-message">
  //       <h2>Product not found</h2>

  //       <button onClick={() => navigate("/products")}>
  //         Back to Products
  //       </button>
  //     </main>
  //   );
  // }















const handleAddToCart = async () => {
  // Prevent duplicate requests
  if (addingToCart) return;

  // Check whether customer has an authentication token
  const tokenKeys = ["token", "authToken", "accessToken"];
  const token = tokenKeys
    .map((key) => localStorage.getItem(key))
    .find(Boolean);

  if (!token) {
    navigate("/login", {
      state: {
        from: {
          pathname: `/products/${id}`,
        },
        pendingAction: "addToCart",
        productId: id,
      },
    });
    return;
  }

  try {
    setAddingToCart(true);

    await api.post("/cart/items", {
      productId: product.id,
      quantity: 1,
    });

    navigate("/cart");
  } catch (error) {
    console.error("Add to cart error:", error);

    const status = error.response?.status;

    if (status === 401 || status === 403) {
      navigate("/login", {
        state: {
          from: {
            pathname: `/products/${id}`,
          },
          pendingAction: "addToCart",
          productId: id,
        },
        replace: true,
      });
      return;
    }

    alert(
      error.response?.data?.message ||
        "Unable to add product to cart"
    );
  } finally {
    setAddingToCart(false);
  }
};










// Show loading state while product is being fetched
if (loading) {
  return (
    <main className="product-details-message">
      Loading product...
    </main>
  );
}

// Show error if product could not be loaded
if (error || !product) {
  return (
    <main className="product-details-message">
      <h2>Product not found</h2>

      <button onClick={() => navigate("/products")}>
        Back to Products
      </button>
    </main>
  );
}














  return (
    <main className="product-details-page">

      {/* Breadcrumb */}
      <div className="product-breadcrumb">
        Home / Products / {product.name}
      </div>

      {/* Product */}
      <section className="product-details">

        <div className="product-details-image">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
            />
          ) : (
            <span>📦</span>
          )}
        </div>

        <div className="product-details-info">

          {product.category?.name && (
            <span className="product-category">
              {product.category.name}
            </span>
          )}

          <h1>{product.name}</h1>

        <div className="product-rating-summary">
  {ratingData.totalReviews > 0 ? (
    <>
      <span className="stars">
        {"★".repeat(Math.round(ratingData.averageRating))}
        {"☆".repeat(
          5 - Math.round(ratingData.averageRating)
        )}
      </span>

      <strong>
        {Number(ratingData.averageRating).toFixed(1)}
      </strong>

      <span>
        ({ratingData.totalReviews} reviews)
      </span>
    </>
  ) : (
    <span className="no-rating">
      No reviews yet
    </span>
  )}
</div>

          <div className="product-price">
            ₹{product.price}
          </div>

          {product.shop?.name && (
            <div className="product-shop">
              Sold by <strong>{product.shop.name}</strong>
            </div>
          )}

          {product.description && (
            <p className="product-description">
              {product.description}
            </p>
          )}

          <div className="product-actions">

            <button
              className="add-cart-button"
              onClick={handleAddToCart}
              disabled={addingToCart}
            >
              {addingToCart
                ? "Adding..."
                : "Add to Cart"}
            </button>

            <button
              className="buy-button"
              onClick={handleAddToCart}
              disabled={addingToCart}
            >
              {addingToCart
                ? "Adding..."
                : "Buy Now"}
            </button>

          </div>

        </div>
      </section>

      {/* Reviews */}
      <section className="reviews-section">

        <div className="reviews-header">

          <div>
            <span>CUSTOMER FEEDBACK</span>

            <h2>Ratings & Reviews</h2>
          </div>

         <div className="rating-big">
  <strong>
    {ratingData.totalReviews > 0
      ? Number(ratingData.averageRating).toFixed(1)
      : "0.0"}
  </strong>

  <span>
    {ratingData.totalReviews > 0
      ? `${"★".repeat(Math.round(ratingData.averageRating))}${"☆".repeat(
          5 - Math.round(ratingData.averageRating)
        )}`
      : "☆☆☆☆☆"}
  </span>

  <small>
    {ratingData.totalReviews} reviews
  </small>
</div>

        </div>

        {reviewLoading ? (
          <div className="reviews-message">
            Loading reviews...
          </div>
        ) : reviews.length === 0 ? (
          <div className="reviews-message">

            <h3>No reviews yet</h3>

            <p>
              Be the first customer to review this product.
            </p>

          </div>
        ) : (
          <div className="reviews-list">

            {reviews.map((review) => (
              <article
                className="review-card"
                key={review.id}
              >

                <div className="review-top">

                  <div className="review-customer">

                    <div className="customer-avatar">
                      {review.customer?.name
                        ?.charAt(0)
                        ?.toUpperCase() || "U"}
                    </div>

                    <div>

                      <strong>
                        {review.customer?.name ||
                          "Customer"}
                      </strong>

                      <small>
                        {new Date(
                          review.createdAt
                        ).toLocaleDateString()}
                      </small>

                    </div>

                  </div>

                  <div className="review-rating">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </div>

                </div>

                {review.comment && (
                  <p>{review.comment}</p>
                )}

              </article>
            ))}

          </div>
        )}

      </section>

    </main>
  );
}

export default ProductDetails;