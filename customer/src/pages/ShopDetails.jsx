import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./ShopDetails.css";

const ShopDetails = () => {
  const { slug } = useParams();

  const navigate = useNavigate();

  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchShop = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/shops/${slug}`);

        if (response.data?.success) {
          setShop(response.data.shop);
        } else {
          setShop(null);
          setError("Shop not found.");
        }
      } catch (err) {
        console.error("Failed to load shop:", err);

        if (err.response?.status === 404) {
          setError("Shop not found.");
        } else {
          setError("Unable to load shop.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchShop();
  }, [slug]);

  useEffect(() => {
    const fetchShopProducts = async () => {
      if (!shop?.id) return;

      try {
        setProductsLoading(true);

        const response = await api.get(`/products/shop/${shop.id}`);

        if (response.data?.success) {
          setProducts(response.data.products || []);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Failed to load shop products:", err);
        setProducts([]);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchShopProducts();
  }, [shop]);

  if (loading) {
    return (
      <main className="shop-details-page">
        <div className="shop-details-container">
          <div className="shop-details-loading">
            Loading shop...
          </div>
        </div>
      </main>
    );
  }

  if (error || !shop) {
    return (
      <main className="shop-details-page">
        <div className="shop-details-container">
          <div className="shop-details-error">
            {error || "Shop not found."}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="shop-details-page">
      <div className="shop-details-container">

        <section className="shop-details-header">

          <div className="shop-details-icon">
            🏪
          </div>

          <div className="shop-details-info">
            <h1>{shop.name}</h1>

            <p className="shop-details-address">
              {shop.address}
            </p>

            <span
              className={`shop-details-status ${
                shop.isOpen ? "open" : "closed"
              }`}
            >
              {shop.isOpen ? "Open" : "Closed"}
            </span>
          </div>

        </section>

        <section className="shop-details-section">
          <h2>Shop Information</h2>

          <div className="shop-details-information">

            <div className="shop-information-item">
              <span>Address</span>
              <strong>{shop.address}</strong>
            </div>

            {shop.phone && (
              <div className="shop-information-item">
                <span>Phone</span>
                <strong>{shop.phone}</strong>
              </div>
            )}

            <div className="shop-information-item">
              <span>Status</span>
              <strong>
                {shop.isOpen ? "Currently Open" : "Currently Closed"}
              </strong>
            </div>

          </div>
        </section>

        <section className="shop-products-section">
          <div className="shop-products-heading">
            <h2>Products</h2>
            <p>Products available from this shop</p>
          </div>

          {productsLoading ? (
            <div className="shop-details-loading">
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div className="shop-details-error">
              No products available from this shop.
            </div>
          ) : (
            <div className="products-grid">
              {products.map((product) => {
                const quantity = product.inventory?.quantity || 0;
                const reservedQuantity =
                  product.inventory?.reservedQuantity || 0;

                const availableQuantity =
                  Math.max(0, quantity - reservedQuantity);

                return (
                 <div
  key={product.id}
  className="product-card"
  onClick={() => navigate(`/products/${product.id}`)}
>
                    <div className="product-image-wrapper">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="product-image"
                      />
                    </div>

                    <div className="product-info">
                      <p className="product-category">
                        {product.category?.name}
                      </p>

                      <h3 className="product-name">
                        {product.name}
                      </h3>

                      <p className="product-price">
                        ₹{Number(product.price).toLocaleString("en-IN")}
                      </p>

                      <p className="product-stock">
                        {availableQuantity > 0
                          ? `${availableQuantity} available`
                          : "Out of stock"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </section>

      </div>
    </main>
  );
};

export default ShopDetails;