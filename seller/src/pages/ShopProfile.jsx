import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./ShopProfile.css";

function ShopProfile() {
  const { user } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [shop, setShop] = useState(null);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    phone: "",
    address: "",
    latitude: "",
    longitude: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [statusUpdating, setStatusUpdating] = useState(false);

  useEffect(() => {
    fetchShop();
  }, []);

  const fetchShop = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/shops/me");

      const shopData = response.data.shop;

      setShop(shopData);

      setForm({
        name: shopData.name || "",
        slug: shopData.slug || "",
        phone: shopData.phone || "",
        address: shopData.address || "",
        latitude:
          shopData.latitude !== null &&
          shopData.latitude !== undefined
            ? String(shopData.latitude)
            : "",
        longitude:
          shopData.longitude !== null &&
          shopData.longitude !== undefined
            ? String(shopData.longitude)
            : "",
      });
    } catch (error) {
      console.error("Failed to fetch shop:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load shop profile."
      );
    } finally {
      setLoading(false);
    }
  };




  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
    setSuccess("");
  };





  const handleCancel = () => {
    if (!shop) return;

    setForm({
      name: shop.name || "",
      slug: shop.slug || "",
      phone: shop.phone || "",
      address: shop.address || "",
      latitude:
        shop.latitude !== null &&
        shop.latitude !== undefined
          ? String(shop.latitude)
          : "",
      longitude:
        shop.longitude !== null &&
        shop.longitude !== undefined
          ? String(shop.longitude)
          : "",
    });

    setIsEditing(false);
    setError("");
    setSuccess("");
  };





  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await api.patch("/shops/me", {
        name: form.name,
        slug: form.slug,
        phone: form.phone,
        address: form.address,
        latitude:
          form.latitude.trim() === ""
            ? null
            : Number(form.latitude),
        longitude:
          form.longitude.trim() === ""
            ? null
            : Number(form.longitude),
      });

      const updatedShop = response.data.shop;

      setShop(updatedShop);

      setForm({
        name: updatedShop.name || "",
        slug: updatedShop.slug || "",
        phone: updatedShop.phone || "",
        address: updatedShop.address || "",
        latitude:
          updatedShop.latitude !== null &&
          updatedShop.latitude !== undefined
            ? String(updatedShop.latitude)
            : "",
        longitude:
          updatedShop.longitude !== null &&
          updatedShop.longitude !== undefined
            ? String(updatedShop.longitude)
            : "",
      });

      setIsEditing(false);
      setSuccess("Shop profile updated successfully.");
    } catch (error) {
      console.error("Failed to update shop:", error);

      setError(
        error.response?.data?.message ||
          "Unable to update shop profile."
      );
    } finally {
      setSaving(false);
    }
  };






const handleShopStatus = async () => {
  try {
    setStatusUpdating(true);
    setError("");
    setSuccess("");

    const response = await api.patch("/shops/status", {
      isOpen: !shop?.isOpen,
    });

    const updatedShop = response.data.shop;

    setShop(updatedShop);

    setSuccess(
      updatedShop.isOpen
        ? "Shop is now open."
        : "Shop is now closed."
    );
  } catch (error) {
    console.error("Failed to update shop status:", error);

    setError(
      error.response?.data?.message ||
        "Unable to update shop status."
    );
  } finally {
    setStatusUpdating(false);
  }
};






  if (loading) {
    return (
      <main className="seller-content shop-profile-page">
        <div className="shop-profile-card">
          <p>Loading shop profile...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="seller-content shop-profile-page">

      {/* Page Header */}
      <div className="shop-page-header">
        <div>
          <p className="shop-page-eyebrow">
            SHOP MANAGEMENT
          </p>

          <h1>Shop Profile</h1>

          <p>
            Manage your shop information and business details.
          </p>
        </div>

        <button
          type="button"
          className="shop-edit-button"
          onClick={() => {
            if (isEditing) {
              handleCancel();
            } else {
              setIsEditing(true);
              setSuccess("");
            }
          }}
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="shop-error">
          {error}
        </div>
      )}

      {success && (
        <div className="shop-success">
          {success}
        </div>
      )}

      {/* Shop Overview */}
      <section className="shop-profile-card">
        <div className="shop-profile-top">

          <div className="shop-logo">
            {(shop?.name || "S")
              .charAt(0)
              .toUpperCase()}
          </div>

          <div className="shop-basic-info">
            <h2>
              {shop?.name || "Your Shop"}
            </h2>

            <p>
              @{shop?.slug || "your-shop"}
            </p>

            <span className="shop-active-badge">
              <span></span>
              {shop?.isOpen ? "Open" : "Closed"}
            </span>





         <button
  type="button"
  className="shop-status-button"
  onClick={handleShopStatus}
  disabled={statusUpdating}
>
  {statusUpdating
    ? "Updating..."
    : shop?.isOpen
      ? "Close Shop"
      : "Open Shop"}
</button>



          </div>

        </div>
      </section>

      {/* Business Information */}
      <section className="shop-profile-card">
        <div className="shop-card-header">
          <div>
            <h2>Business Information</h2>

            <p>
              Your basic shop information
            </p>
          </div>
        </div>

        <div className="shop-form-grid">

          <div className="shop-field">
            <label>Shop Name</label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Enter shop name"
            />
          </div>

          <div className="shop-field">
            <label>Shop Slug</label>

            <input
              type="text"
              name="slug"
              value={form.slug}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="your-shop"
            />
          </div>

          <div className="shop-field">
            <label>Shop Phone</label>

            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Enter shop phone"
            />
          </div>

          <div className="shop-field">
            <label>Owner Name</label>

            <input
              type="text"
              value={user?.name || ""}
              disabled
            />
          </div>

        </div>
      </section>

      {/* Address */}
      <section className="shop-profile-card">

        <div className="shop-card-header">
          <div>
            <h2>Shop Address</h2>

            <p>
              Where customers can find your shop
            </p>
          </div>
        </div>

        <div className="shop-form-grid">

          <div className="shop-field shop-field-full">
            <label>Address</label>

            <textarea
              rows="4"
              name="address"
              value={form.address}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Enter complete shop address"
            />
          </div>

          <div className="shop-field">
            <label>Latitude</label>

            <input
              type="text"
              name="latitude"
              value={form.latitude}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Latitude"
            />
          </div>

          <div className="shop-field">
            <label>Longitude</label>

            <input
              type="text"
              name="longitude"
              value={form.longitude}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Longitude"
            />
          </div>

        </div>
      </section>

      {/* Save */}
      {isEditing && (
        <div className="shop-save-area">
          <button
            type="button"
            className="shop-save-button"
            onClick={handleSave}
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>
        </div>
      )}

    </main>
  );
}

export default ShopProfile;