import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Cart.css";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError("");

    const response = await api.get("/cart");

const cartData =
  response.data.cart || response.data.data || null;

setCart(cartData);

// Notify Header that cart has changed
window.dispatchEvent(new Event("cartUpdated"));

    } catch (error) {
      console.error("Cart error:", error);
      setError("Unable to load your cart.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;

    try {
      await api.patch(`/cart/items/${itemId}`, {
        quantity,
      });

      await fetchCart();
    } catch (error) {
      console.error("Update cart error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to update quantity"
      );
    }
  };

  const removeItem = async (itemId) => {
    try {
      await api.delete(`/cart/items/${itemId}`);

      await fetchCart();
    } catch (error) {
      console.error("Remove cart item error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to remove item"
      );
    }
  };

  if (loading) {
    return (
      <main className="cart-message">
        Loading your cart...
      </main>
    );
  }

  if (error) {
    return (
      <main className="cart-message">
        <h2>{error}</h2>

        <button onClick={fetchCart}>
          Try Again
        </button>
      </main>
    );
  }

  const items = cart?.items || [];

  const subtotal = items.reduce(
    (total, item) =>
      total +
      Number(item.price || item.product?.price || 0) *
        item.quantity,
    0
  );

  return (
    <main className="cart-page">

      <div className="cart-heading">
        <div>
          <span>MYKASHO</span>
          <h1>Your Cart</h1>
        </div>

        <button onClick={() => navigate("/products")}>
          ← Continue Shopping
        </button>
      </div>

      {items.length === 0 ? (
        <section className="empty-cart">
          <div className="empty-cart-icon">
            🛒
          </div>

          <h2>Your cart is empty</h2>

          <p>
            Discover products from your favorite local
            shops.
          </p>

          <button
            onClick={() => navigate("/products")}
          >
            Start Shopping
          </button>
        </section>
      ) : (
        <div className="cart-layout">

          {/* Cart items */}

          <section className="cart-items">

            {cart?.shop?.name && (
              <div className="cart-shop">
                <span>🏪</span>

                <div>
                  <small>SHOP</small>
                  <strong>{cart.shop.name}</strong>
                </div>
              </div>
            )}

            {items.map((item) => {
              const product = item.product || {};

              const price = Number(
                item.price || product.price || 0
              );

              return (
                <article
                  className="cart-item"
                  key={item.id}
                >
                 
<div className="cart-item-image">
  {(() => {
    const image =
      product.imageUrl ||
      product.image ||
      product.images?.[0]?.url ||
      product.images?.[0] ||
      item.imageUrl ||
      item.image;

    return image && typeof image === "string" ? (
      <img
        src={image}
        alt={product.name || "Product"}
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />
    ) : (
      <span>Image unavailable</span>
    );
  })()}
</div>


                  <div className="cart-item-info">
                    <h2>{product.name}</h2>

                    {product.category?.name && (
                      <small>
                        {product.category.name}
                      </small>
                    )}

                    <strong>
                      ₹{price}
                    </strong>

                    <button
                      className="remove-button"
                      onClick={() =>
                        removeItem(item.id)
                      }
                    >
                      Remove
                    </button>
                  </div>

                  <div className="cart-item-right">

                    <div className="quantity-control">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity - 1
                          )
                        }
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity + 1
                          )
                        }
                      >
                        +
                      </button>
                    </div>

                    <strong className="item-total">
                      ₹{(price * item.quantity).toFixed(2)}
                    </strong>

                  </div>
                </article>
              );
            })}
          </section>

          {/* Summary */}

          <aside className="cart-summary">

            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Subtotal</span>
              <strong>
                ₹{subtotal.toFixed(2)}
              </strong>
            </div>

            <div className="summary-row">
              <span>Delivery</span>
              <span>Calculated at checkout</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-total">
              <span>Total</span>

              <strong>
                ₹{subtotal.toFixed(2)}
              </strong>
            </div>

            <button
              className="checkout-button"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout →
            </button>

            <div className="secure-checkout">
              🔒 Secure checkout
            </div>

          </aside>
        </div>
      )}
    </main>
  );
}

export default Cart;