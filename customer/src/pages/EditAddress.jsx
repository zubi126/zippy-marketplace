import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "./Addresses.css";

function EditAddress() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    label: "",
    fullAddress: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/addresses");

        const addresses =
          response.data.addresses ||
          response.data.data ||
          response.data ||
          [];

        const address = addresses.find(
          (item) => item.id === id
        );

        if (!address) {
          setError("Address not found.");
          return;
        }

        setForm({
          label: address.label || "",
          fullAddress: address.fullAddress || "",
          city: address.city || "",
          state: address.state || "",
          pincode: address.pincode || "",
          isDefault: address.isDefault || false,
        });
      } catch (error) {
        console.error("Fetch address error:", error);

        setError(
          error.response?.data?.message ||
            "Unable to load address."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAddress();
  }, [id]);

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

      await api.patch(`/addresses/${id}`, form);

      navigate("/addresses");
    } catch (error) {
      console.error("Update address error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to update address."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="addresses-page">
        <div className="addresses-loading">
          Loading address...
        </div>
      </main>
    );
  }

  return (
    <main className="addresses-page">
      <div className="addresses-container">

        <div className="addresses-header">
          <div>
            <span>MY ACCOUNT</span>
            <h1>Edit Address</h1>
            <p>Update your delivery address.</p>
          </div>
        </div>

        {error && (
          <div className="addresses-error">
            {error}
          </div>
        )}

        {!error && (
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
                <label>Full Address *</label>

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
                  {saving ? "Saving..." : "Save Changes"}
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
        )}

      </div>
    </main>
  );
}

export default EditAddress;