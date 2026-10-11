import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "./EditProduct.css";

function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState(null);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    categoryId: "",
    subcategory: "",
    price: "",
    quantity: "",
    description: "",
    status: "active",
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchProduct();
    fetchCategories();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError("");

      /*
       * /products/my returns all products belonging
       * to the logged-in seller.
       */
      const response = await api.get("/products/my");

      const products = response.data.products || [];

      const foundProduct = products.find(
        (item) => item.id === id
      );

      if (!foundProduct) {
        setError("Product not found.");
        return;
      }

      setProduct(foundProduct);

      setForm({
        name: foundProduct.name || "",
        slug: foundProduct.slug || "",
        categoryId: foundProduct.category?.id || "",
        subcategory: "",
        price:
          foundProduct.price !== undefined
            ? String(foundProduct.price)
            : "",
        quantity:
          foundProduct.inventory?.quantity !== undefined
            ? String(foundProduct.inventory.quantity)
            : "",
        description: foundProduct.description || "",
        status:
          foundProduct.isAvailable === false
            ? "inactive"
            : "active",
      });

      if (foundProduct.imageUrl) {
        setImagePreview(foundProduct.imageUrl);
      }
    } catch (error) {
      console.error(
        "Failed to fetch product:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load product."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");

      setCategories(
        response.data.categories || []
      );
    } catch (error) {
      console.error(
        "Failed to fetch categories:",
        error
      );
    }
  };

  const createSlug = (value) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleNameChange = (e) => {
    const value = e.target.value;

    setForm((prev) => ({
      ...prev,
      name: value,
      slug: createSlug(value),
    }));

    setError("");
    setSuccess("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB.");
      return;
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!form.slug.trim()) {
      setError("Product slug is required.");
      return;
    }

    if (!form.categoryId) {
      setError("Please select a category.");
      return;
    }

    if (
      form.price === "" ||
      Number(form.price) < 0
    ) {
      setError("Please enter a valid price.");
      return;
    }

    if (
      form.quantity === "" ||
      !Number.isInteger(Number(form.quantity)) ||
      Number(form.quantity) < 0
    ) {
      setError(
        "Stock quantity must be a non-negative integer."
      );
      return;
    }

    try {
      setSaving(true);

      /*
       * ----------------------------------------
       * 1. UPDATE PRODUCT INFORMATION
       * ----------------------------------------
       */

      const formData = new FormData();

      formData.append(
        "categoryId",
        form.categoryId
      );

      formData.append(
        "name",
        form.name.trim()
      );

      formData.append(
        "slug",
        form.slug.trim()
      );

      formData.append(
        "description",
        form.description.trim()
      );

      formData.append(
        "price",
        form.price
      );

      formData.append(
        "isAvailable",
        form.status === "active"
          ? "true"
          : "false"
      );

      if (image) {
        formData.append("image", image);
      }

      await api.patch(
        `/products/${id}`,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      /*
       * ----------------------------------------
       * 2. UPDATE INVENTORY
       * ----------------------------------------
       */

      await api.patch(
        `/products/${id}/inventory`,
        {
          quantity: Number(form.quantity),
        }
      );

      setSuccess(
        "Product updated successfully."
      );

      setTimeout(() => {
        navigate("/products");
      }, 800);
    } catch (error) {
      console.error(
        "Failed to update product:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to update product."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSaving(true);

      await api.delete(
        `/products/${id}`
      );

      navigate("/products");
    } catch (error) {
      console.error(
        "Failed to delete product:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to delete product."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="seller-content edit-product-page">
        <div className="edit-product-card">
          <div
            style={{
              padding: "40px",
              textAlign: "center",
            }}
          >
            Loading product...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="seller-content edit-product-page">
      {/* Page Header */}
      <div className="edit-product-page-header">
        <div>
          <p className="edit-product-eyebrow">
            PRODUCT MANAGEMENT
          </p>

          <h1>Edit Product</h1>

          <p>
            Update the information of your product.
          </p>
        </div>

        <button
          type="button"
          className="back-products-button"
          onClick={() =>
            navigate("/products")
          }
          disabled={saving}
        >
          ← Back to Products
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="add-product-error">
          {error}
        </div>
      )}

      {success && (
        <div className="add-product-success">
          {success}
        </div>
      )}

      {/* Product Form */}
      <form
        className="edit-product-card"
        onSubmit={handleSubmit}
      >
        <div className="edit-product-card-header">
          <div>
            <h2>Product Information</h2>

            <p>
              Update your product details, pricing and stock.
            </p>
          </div>

          <span className="product-id-label">
            Product ID: {id}
          </span>
        </div>

        <div className="edit-product-form">
          {/* Product Image */}
          <div className="edit-image-section">
            <label>Product Image</label>

            <div className="edit-image-area">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt={form.name}
                  className="edit-product-image"
                />
              ) : (
                <div className="edit-product-preview">
                  📦
                </div>
              )}

              <div className="edit-image-info">
                <strong>
                  {image
                    ? image.name
                    : "Product Image"}
                </strong>

                <span>
                  Upload a new image or keep the existing one.
                </span>

                <label className="edit-change-image-button">
                  Change Image

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageChange}
                    hidden
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Product Name */}
          <div className="edit-product-field edit-product-field-full">
            <label>
              Product Name <span>*</span>
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleNameChange}
              placeholder="Product name"
              required
            />
          </div>

          {/* Slug */}
          <div className="edit-product-field edit-product-field-full">
            <label>
              Product Slug <span>*</span>
            </label>

            <input
              type="text"
              name="slug"
              value={form.slug}
              onChange={handleChange}
              placeholder="product-slug"
              required
            />
          </div>

          {/* Category */}
          <div className="edit-product-field">
            <label>
              Category <span>*</span>
            </label>

            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select category
              </option>

              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory */}
          <div className="edit-product-field">
            <label>Subcategory</label>

            <input
              type="text"
              name="subcategory"
              value={form.subcategory}
              onChange={handleChange}
              placeholder="Subcategory"
            />
          </div>

          {/* Price */}
          <div className="edit-product-field">
            <label>
              Price <span>*</span>
            </label>

            <div className="edit-price-input">
              <span>₹</span>

              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          {/* Stock */}
          <div className="edit-product-field">
            <label>
              Stock Quantity <span>*</span>
            </label>

            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              placeholder="Enter quantity"
              min="0"
              step="1"
              required
            />
          </div>

          {/* Description */}
          <div className="edit-product-field edit-product-field-full">
            <label>Description</label>

            <textarea
              rows="5"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Product description..."
            />
          </div>

          {/* Status */}
          <div className="edit-product-field">
            <label>Product Status</label>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="active">
                Active
              </option>

              <option value="inactive">
                Inactive
              </option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="edit-product-footer">
          <button
            type="button"
            className="delete-product-button"
            onClick={handleDelete}
            disabled={saving}
          >
            {saving
              ? "Processing..."
              : "Delete Product"}
          </button>

          <div className="edit-product-footer-actions">
            <button
              type="button"
              className="cancel-edit-button"
              onClick={() =>
                navigate("/products")
              }
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="update-product-button"
              disabled={saving}
            >
              {saving
                ? "Saving Changes..."
                : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}

export default EditProduct;