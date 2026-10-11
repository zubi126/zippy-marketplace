import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Addresses.css";

function AddAddress() {
  const navigate = useNavigate();

const [form, setForm] = useState({
  label: "",
  fullAddress: "",
  city: "",
  state: "",
  pincode: "",
  isDefault: false,
});

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      await api.post("/addresses", form);

      navigate("/addresses");
    } catch (error) {
      console.error("Add address error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to add address."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="addresses-page">
      <div className="addresses-container">

        <div className="addresses-header">
          <div>
            <span>MY ACCOUNT</span>
            <h1>Add New Address</h1>
            <p>Add a delivery address for your orders.</p>
          </div>
        </div>

        <div className="profile-card">

          <form
            onSubmit={handleSubmit}
            className="profile-form"
          >

            <div className="profile-field">
              <label>Address Label</label>

              <input
                type="text"
                name="label"
                value={form.label}
                onChange={handleChange}
                placeholder="Home, Work, etc."
              />
            </div>

            <div className="profile-field">
              <label>full Address*</label>

              <textarea
  name="fullAddress"
  value={form.fullAddress}
  onChange={handleChange}
  placeholder="House / Flat / Street / Landmark / Locality"
  required
/>
            </div>

          

            <div className="profile-field">
              <label>City *</label>

              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="City"
                required
              />
            </div>

            <div className="profile-field">
              <label>State *</label>

              <input
                type="text"
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="State"
                required
              />
            </div>

            <div className="profile-field">
              <label>Pincode *</label>

              <input
                type="text"
                name="pincode"
                value={form.pincode}
                onChange={handleChange}
                placeholder="6-digit pincode"
                maxLength="6"
                required
              />
            </div>

            <div className="profile-field">
              <label>Phone</label>

              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Delivery contact number"
              />
            </div>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                name="isDefault"
                checked={form.isDefault}
                onChange={handleChange}
              />

              <span>Set as default address</span>
            </label>

            {error && (
              <div className="profile-error">
                {error}
              </div>
            )}

            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <button
                type="submit"
                className="profile-save-button"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Address"}
              </button>

              <button
                type="button"
                className="keep-order-button"
                onClick={() => navigate("/addresses")}
              >
                Cancel
              </button>
            </div>

          </form>
        </div>

      </div>
    </main>
  );
}

export default AddAddress;