import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";
import "./Shops.css";

const Shops = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
const search = searchParams.get("q");

  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoading(true);
        setError("");

       const response = search
  ? await api.get("/shops/search", {
      params: {
        q: search,
      },
    })
  : await api.get("/shops/nearby");

        if (response.data?.success) {
          setShops(response.data.shops || []);
        } else {
          setShops([]);
        }
      } catch (err) {
        console.error("Failed to load shops:", err);
        setError("Unable to load shops.");
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, []);

  if (loading) {
    return (
      <main className="shops-page">
        <div className="shops-page-container">
          <h1>Local Shops</h1>
          <p className="shops-page-subtitle">
            Discover local shops and stores
          </p>

          <div className="shops-loading">
            Loading shops...
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="shops-page">
        <div className="shops-page-container">
          <h1>Local Shops</h1>
          <p className="shops-page-subtitle">
            Discover local shops and stores
          </p>

          <div className="shops-error">
            {error}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="shops-page">
      <div className="shops-page-container">
        <div className="shops-page-header">
          <div>
            <h1>Local Shops</h1>
            <p>
              Discover local shops and stores near you
            </p>
          </div>
        </div>

        {shops.length === 0 ? (
          <div className="shops-empty">
            <h2>No shops available</h2>
            <p>
              There are no local shops available right now.
            </p>
          </div>
        ) : (
          <div className="shops-grid">
            {shops.map((shop) => (
              <div
                key={shop.id}
                className="shop-page-card"
                onClick={() =>
                  navigate(`/shops/${shop.slug}`)
                }
              >
                <div className="shop-page-icon">
                  🏪
                </div>

                <div className="shop-page-info">
                  <h2>{shop.name}</h2>

                  <p>{shop.address}</p>

                  <span
                    className={`shop-page-status ${
                      shop.isOpen ? "open" : "closed"
                    }`}
                  >
                    {shop.isOpen ? "Open" : "Closed"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Shops;