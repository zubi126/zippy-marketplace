









import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Products.css";

function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");

  const [productView, setProductView] = useState("active");

useEffect(() => {
  fetchProducts();
}, [productView]);



  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

     const response = await api.get(
  `/products/my?status=${productView}`
);

      setProducts(response.data.products || []);
    } catch (error) {
      console.error("Failed to fetch seller products:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load your products."
      );
    } finally {
      setLoading(false);
    }
  };

  const getAvailableQuantity = (product) => {
    if (product.availableQuantity !== undefined) {
      return product.availableQuantity;
    }

    if (!product.inventory) {
      return 0;
    }

    return (
      product.inventory.quantity -
      product.inventory.reservedQuantity
    );
  };

  const getStockStatus = (product) => {
    const quantity = getAvailableQuantity(product);

    if (quantity <= 0) {
      return "out-of-stock";
    }

    if (product.isLowStock) {
      return "low-stock";
    }

    return "in-stock";
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const search = searchQuery.trim().toLowerCase();

      const matchesSearch =
        !search ||
        product.name?.toLowerCase().includes(search);

      const matchesCategory =
        categoryFilter === "all" ||
        product.category?.slug === categoryFilter;

      const stockStatus = getStockStatus(product);

      const matchesStock =
        stockFilter === "all" ||
        stockStatus === stockFilter;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStock
      );
    });
  }, [
    products,
    searchQuery,
    categoryFilter,
    stockFilter,
  ]);

  const totalProducts = products.length;

  const inStockProducts = products.filter(
    (product) =>
      getStockStatus(product) === "in-stock"
  ).length;

  const lowStockProducts = products.filter(
    (product) =>
      getStockStatus(product) === "low-stock"
  ).length;

  const outOfStockProducts = products.filter(
    (product) =>
      getStockStatus(product) === "out-of-stock"
  ).length;

  const getStatusLabel = (product) => {
    const status = getStockStatus(product);

    if (status === "out-of-stock") {
      return "Out of Stock";
    }

    if (status === "low-stock") {
      return "Low Stock";
    }

    return "In Stock";
  };

  return (
    <main className="seller-content products-page">
      {/* Page Header */}
      <div className="products-page-header">
        <div>
          <p className="products-page-eyebrow">
            PRODUCT MANAGEMENT
          </p>

          <h1>Products</h1>

          <p>
            Manage the products available in your shop.
          </p>
        </div>

        <button
          type="button"
          className="add-product-button"
          onClick={() => navigate("/products/add")}
        >
          <span>＋</span>
          Add Product
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="products-error">
          {error}
        </div>
      )}

      {/* Product Summary */}
      <section className="product-summary-grid">
        <div className="product-summary-card">
          <span className="product-summary-label">
            TOTAL PRODUCTS
          </span>

          <strong>{totalProducts}</strong>

          <p>Products in your shop</p>
        </div>

        <div className="product-summary-card">
          <span className="product-summary-label">
            IN STOCK
          </span>

          <strong>{inStockProducts}</strong>

          <p>Products currently available</p>
        </div>

        <div className="product-summary-card">
          <span className="product-summary-label">
            LOW STOCK
          </span>

          <strong>{lowStockProducts}</strong>

          <p>Products needing attention</p>
        </div>

        <div className="product-summary-card">
          <span className="product-summary-label">
            OUT OF STOCK
          </span>

          <strong>{outOfStockProducts}</strong>

          <p>Products unavailable</p>
        </div>
      </section>

      {/* Products Card */}
      <section className="products-card">








{/* Product View Toggle */}
<div className="product-view-toggle">
  <button
    type="button"
    className={productView === "active" ? "active" : ""}
    onClick={() => setProductView("active")}
  >
    Active Products
  </button>

  <button
    type="button"
    className={productView === "deleted" ? "active" : ""}
    onClick={() => setProductView("deleted")}
  >
    Deleted Products
  </button>
</div>











        {/* Toolbar */}
        <div className="products-toolbar">
          <div className="products-search">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(e.target.value)
            }
          >
            <option value="all">
              All Categories
            </option>

            <option value="grocery">
              Grocery
            </option>

        <option value="beauty-cosmetics">
  Beauty & Cosmetics
</option>

            <option value="electronics">
              Electronics
            </option>

            <option value="fashion">
              Fashion
            </option>
          </select>

          <select
            value={stockFilter}
            onChange={(e) =>
              setStockFilter(e.target.value)
            }
          >
            <option value="all">
              All Stock
            </option>

            <option value="in-stock">
              In Stock
            </option>

            <option value="low-stock">
              Low Stock
            </option>

            <option value="out-of-stock">
              Out of Stock
            </option>
          </select>
        </div>

        {/* Table */}
        <div className="products-table-wrapper">
          <table className="products-table">
            <thead>
              <tr>
                <th>PRODUCT</th>
                <th>CATEGORY</th>
                <th>PRICE</th>
                <th>STOCK</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6">
                    <div className="products-empty-state">
                      <h3>Loading products...</h3>
                      <p>
                        Please wait while we load your products.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6">
                    <div className="products-empty-state">
                      <div className="products-empty-icon">
                        ▤
                      </div>

                      <h3>
                        {products.length === 0
                          ? "No products yet"
                          : "No products found"}
                      </h3>

                      <p>
                        {products.length === 0
                          ? "Add your first product to start selling."
                          : "Try changing your search or filters."}
                      </p>

                      {products.length === 0 && (
                        <button
                          type="button"
                          onClick={() =>
                            navigate("/products/add")
                          }
                        >
                          ＋ Add Your First Product
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const quantity =
                    getAvailableQuantity(product);

                  const status =
                    getStockStatus(product);

                  return (
                    <tr key={product.id}>
                      <td>
                        <div className="product-table-product">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                            />
                          ) : (
                            <div className="product-table-image-placeholder">
                              ▤
                            </div>
                          )}

                          <div>
                            <strong>
                              {product.name}
                            </strong>

                            <small>
                              {product.slug}
                            </small>
                          </div>
                        </div>
                      </td>

                      <td>
                        {product.category?.name ||
                          "—"}
                      </td>

                      <td>
                        ₹{Number(product.price || 0).toFixed(2)}
                      </td>

                      <td>{quantity}</td>

                      <td>
                        <span
                          className={`product-status ${status}`}
                        >
                          {getStatusLabel(product)}
                        </span>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="product-action-button"
                          onClick={() =>
                            navigate(
                              `/products/edit/${product.id}`
                            )
                          }
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export default Products;