import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./AddProduct.css";

function AddProduct() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    categoryId: "",
    subcategory: "",
    price: "",
    quantity: "",
    description: "",
    status: "active",
    weightKg: "1",
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [loadingCategories, setLoadingCategories] =
    useState(true);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);





  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);

      const response = await api.get("/categories");

      setCategories(response.data.categories || []);
    } catch (error) {
      console.error(
        "Failed to fetch categories:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load categories."
      );
    } finally {
      setLoadingCategories(false);
    }
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



  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

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

  const createSlug = (value) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
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




  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!image) {
      setError("Product image is required.");
      return;
    }

    if (!form.categoryId) {
      setError("Please select a category.");
      return;
    }

    if (!form.name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!form.price) {
      setError("Product price is required.");
      return;
    }


   const parsedWeightKg = Number(form.weightKg);

if (!Number.isFinite(parsedWeightKg) || parsedWeightKg <= 0) {
  setError("Product weight must be greater than 0 kg.");
  return;
}



    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("image", image);
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


   formData.append("weightKg", String(parsedWeightKg));


      formData.append(
        "quantity",
        form.quantity || "0"
      );

      const response = await api.post(
        "/products",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccess(
        response.data.message ||
          "Product created successfully."
      );

      setTimeout(() => {
        navigate("/products");
      }, 800);
    } catch (error) {
      console.error(
        "Failed to create product:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to create product."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="seller-content add-product-page">

      {/* Page Header */}
      <div className="add-product-page-header">
        <div>
          <p className="add-product-eyebrow">
            PRODUCT MANAGEMENT
          </p>

          <h1>Add Product</h1>

          <p>
            Add a new product to your shop.
          </p>
        </div>

        <button
          type="button"
          className="back-products-button"
          onClick={() => navigate("/products")}
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

      {/* Form */}
      <form
        className="add-product-card"
        onSubmit={handleSubmit}
      >
        <div className="add-product-card-header">
          <div>
            <h2>Product Information</h2>

            <p>
              Enter the details of the product you want to sell.
            </p>
          </div>
        </div>

        <div className="add-product-form">

          {/* Product Image */}
          <div className="product-image-section">
            <label>
              Product Image <span>*</span>
            </label>

            <div className="product-image-upload">

              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Product preview"
                  className="product-image-preview"
                />
              ) : (
                <div className="product-upload-icon">
                  ↑
                </div>
              )}

              <strong>
                {image
                  ? image.name
                  : "Upload product image"}
              </strong>

              <span>
                PNG, JPG or WEBP · Max 5MB
              </span>

              <label className="product-upload-button">
                Choose Image

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleImageChange}
                  hidden
                />
              </label>
            </div>
          </div>

          {/* Product Name */}
          <div className="add-product-field add-product-field-full">
            <label>
              Product Name <span>*</span>
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleNameChange}
              placeholder="e.g. Fresh Kashmiri Apples"
              required
            />
          </div>

          {/* Slug */}
          <div className="add-product-field add-product-field-full">
            <label>
              Product Slug <span>*</span>
            </label>

            <input
              type="text"
              name="slug"
              value={form.slug}
              onChange={handleChange}
              placeholder="fresh-kashmiri-apples"
              required
            />
          </div>

          {/* Category */}
          <div className="add-product-field">
            <label>
              Category <span>*</span>
            </label>

            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              disabled={loadingCategories}
              required
            >
              <option value="" disabled>
                {loadingCategories
                  ? "Loading categories..."
                  : "Select category"}
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
          <div className="add-product-field">
            <label>Subcategory</label>

            <input
              type="text"
              name="subcategory"
              value={form.subcategory}
              onChange={handleChange}
              placeholder="e.g. Fruits"
            />
          </div>

          {/* Price */}
          <div className="add-product-field">
            <label>
              Price <span>*</span>
            </label>

            <div className="price-input">
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








{/* Product Weight */}
<div className="add-product-field">
  <label>
    Product Weight (kg) <span>*</span>
  </label>

  <input
    type="number"
    name="weightKg"
    value={form.weightKg}
    onChange={handleChange}
    placeholder="Enter weight in kg"
    min="0.01"
    step="0.01"
    required
  />
</div>









          {/* Stock */}
          <div className="add-product-field">
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
              required
            />
          </div>

          {/* Description */}
          <div className="add-product-field add-product-field-full">
            <label>Description</label>

            <textarea
              rows="5"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe your product..."
            />
          </div>

          {/* Status */}
          <div className="add-product-field">
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
        <div className="add-product-footer">
          <button
            type="button"
            className="cancel-product-button"
            onClick={() => navigate("/products")}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="save-product-button"
            disabled={saving}
          >
            {saving
              ? "Adding Product..."
              : "Add Product"}
          </button>
        </div>
      </form>
    </main>
  );
}

export default AddProduct;