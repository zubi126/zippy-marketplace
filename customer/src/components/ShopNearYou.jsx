import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./ShopNearYou.css";

const ShopNearYou = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchNearbyShops = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/shops/nearby");

        if (response.data?.success) {
          setShops(response.data.shops || []);
        } else {
          setShops([]);
        }
      } catch (err) {
        console.error("Failed to load nearby shops:", err);
        setError("Unable to load nearby shops.");
      } finally {
        setLoading(false);
      }
    };

    fetchNearbyShops();
  }, []);

  if (loading) {
    return (
      <section className="products-section category-products-section shop-near-you">
        <div className="shop-near-you-header">
          <h2>Shop Near You</h2>
        </div>

        <div className="shop-near-you-loading">
          Loading shops...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="products-section category-products-section shop-near-you">
        <div className="shop-near-you-header">
          <h2>Shop Near You</h2>
        </div>

        <div className="shop-near-you-error">
          {error}
        </div>
      </section>
    );
  }

  if (shops.length === 0) {
    return null;
  }

  return (
    <section className="products-section category-products-section shop-near-you">
      <div className="shop-near-you-header">
        <div>
          <h2>Shop Near You</h2>
          <p>Discover local shops around you</p>
        </div>

        <button
          className="shop-near-you-view-all"
          onClick={() => navigate("/shops")}
        >
          View All
        </button>
      </div>

      <div className="shop-near-you-grid">
        {shops.map((shop) => (
          <div
            key={shop.id}
            className="shop-near-you-card"
            onClick={() => navigate(`/shops/${shop.slug}`)}
          >
            <div className="shop-near-you-icon">
              🏪
            </div>

            <div className="shop-near-you-info">
              <h3>{shop.name}</h3>

              <p className="shop-near-you-address">
                {shop.address}
              </p>

              <span
                className={`shop-status ${
                  shop.isOpen ? "open" : "closed"
                }`}
              >
                {shop.isOpen ? "Open" : "Closed"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ShopNearYou;