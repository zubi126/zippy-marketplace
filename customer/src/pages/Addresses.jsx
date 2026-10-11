import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Addresses.css";

function Addresses() {
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/addresses");

        setAddresses(
          response.data.addresses ||
            response.data.data ||
            response.data ||
            []
        );
      } catch (error) {
        console.error("Fetch addresses error:", error);

        setError(
          error.response?.data?.message ||
            "Unable to load addresses."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  if (loading) {
    return (
      <main className="addresses-page">
        <div className="addresses-loading">
          Loading addresses...
        </div>
      </main>
    );
  }









const handleSetDefault = async (addressId) => {
  try {
    setError("");

    await api.patch(`/addresses/${addressId}/default`);

    setAddresses((prevAddresses) =>
      prevAddresses.map((address) => ({
        ...address,
        isDefault: address.id === addressId,
      }))
    );
  } catch (error) {
    console.error("Set default address error:", error);

    setError(
      error.response?.data?.message ||
        "Unable to set default address."
    );
  }
};








const handleDeleteAddress = async (addressId) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this address?"
  );

  if (!confirmed) {
    return;
  }

  try {
    setError("");

    await api.delete(`/addresses/${addressId}`);

    setAddresses((prevAddresses) =>
      prevAddresses.filter(
        (address) => address.id !== addressId
      )
    );
  } catch (error) {
    console.error("Delete address error:", error);

    setError(
      error.response?.data?.message ||
        "Unable to delete address."
    );
  }
};










  return (
    <main className="addresses-page">
      <div className="addresses-container">

        <div className="addresses-header">
          <div>
            <span>MY ACCOUNT</span>
            <h1>My Addresses</h1>
            <p>Manage your delivery addresses.</p>
          </div>

          <button
            className="add-address-button"
            onClick={() => navigate("/addresses/new")}
          >
            + Add New Address
          </button>
        </div>

        {error && (
          <div className="addresses-error">
            {error}
          </div>
        )}

        {!error && addresses.length === 0 && (
          <div className="empty-addresses">
            <div className="empty-address-icon">📍</div>

            <h2>No addresses yet</h2>

            <p>
              Add a delivery address to make checkout faster.
            </p>

            <button
              className="add-address-button"
              onClick={() => navigate("/addresses/new")}
            >
              Add Your First Address
            </button>
          </div>
        )}

        {addresses.length > 0 && (
          <div className="addresses-grid">
            {addresses.map((address) => (
              <div
                className="address-card"
                key={address.id}
              >
                <div className="address-card-top">
                  <div className="address-icon">
                    📍
                  </div>

                  {address.isDefault && (
                    <span className="default-address-badge">
                      Default
                    </span>
                  )}
                </div>

                <h3>
                  {address.label ||
                    address.name ||
                    "Delivery Address"}
                </h3>

              <p>
  {address.fullAddress || ""}
</p>

                <p>
                  {address.city && `${address.city}, `}
                  {address.state && `${address.state} `}
                  {address.pincode || address.postalCode || ""}
                </p>

                {address.phone && (
                  <p className="address-phone">
                    📞 {address.phone}
                  </p>
                )}

                <div className="address-actions">
                  <button
                    onClick={() =>
                      navigate(`/addresses/${address.id}/edit`)
                    }
                  >
                    Edit
                  </button>

                {!address.isDefault && (
  <button
    onClick={() => handleSetDefault(address.id)}
  >
    Set Default
  </button>
)}

                  <button
  className="delete-address-button"
  onClick={() => handleDeleteAddress(address.id)}
>
  Delete
</button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}

export default Addresses;