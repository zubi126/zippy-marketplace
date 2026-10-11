import { useEffect, useState } from "react";
import api from "../services/api";
import "./Products.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [status, setStatus] = useState("ALL");

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const fetchProducts = async (page = 1, selectedStatus = status) => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/products", {
        params: {
          status: selectedStatus,
          page,
          limit: 10,
        },
      });

      const data = response.data;

      setProducts(data.products || []);

      setPagination(
        data.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        }
      );
    } catch (err) {
      console.error("Failed to fetch products:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load products. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1, status);
  }, [status]);

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handlePrevious = () => {
    if (pagination.hasPreviousPage) {
      fetchProducts(pagination.page - 1, status);
    }
  };

  const handleNext = () => {
    if (pagination.hasNextPage) {
      fetchProducts(pagination.page + 1, status);
    }
  };

  const formatAmount = (amount) => {
    if (amount === null || amount === undefined) {
      return "₹0";
    }

    return `₹${Number(amount).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getAvailabilityClass = (isAvailable) => {
    return isAvailable
      ? "product-status available"
      : "product-status unavailable";
  };

  const getStockClass = (inventory) => {
    if (!inventory) {
      return "stock-status out";
    }

    const availableQuantity =
      Number(inventory.quantity || 0) -
      Number(inventory.reservedQuantity || 0);

    if (availableQuantity <= 0) {
      return "stock-status out";
    }

    if (
      inventory.lowStockThreshold !== undefined &&
      availableQuantity <= Number(inventory.lowStockThreshold)
    ) {
      return "stock-status low";
    }

    return "stock-status good";
  };

  const getStockText = (inventory) => {
    if (!inventory) {
      return "No Inventory";
    }

    const availableQuantity =
      Number(inventory.quantity || 0) -
      Number(inventory.reservedQuantity || 0);

    if (availableQuantity <= 0) {
      return "Out of Stock";
    }

    return `${availableQuantity} in stock`;
  };

  return (
    <div className="admin-products-page">
      <div className="products-header">
        <div>
          <h1>Products</h1>
          <p>Manage all products listed across the marketplace.</p>
        </div>

        <div className="products-header-count">
          <span>{pagination.total}</span>
          <small>Total Products</small>
        </div>
      </div>

      <div className="products-toolbar">
        <div className="products-filter">
          <label htmlFor="product-status">Status</label>

          <select
            id="product-status"
            value={status}
            onChange={handleStatusChange}
          >
            <option value="ALL">All Products</option>
            <option value="AVAILABLE">Available</option>
            <option value="UNAVAILABLE">Unavailable</option>
            <option value="FEATURED">Featured</option>
            <option value="NOT_FEATURED">Not Featured</option>
          </select>
        </div>

        <button
          type="button"
          className="products-refresh-button"
          onClick={() => fetchProducts(pagination.page, status)}
          disabled={loading}
        >
          ↻ Refresh
        </button>
      </div>

      {loading ? (
        <div className="products-state-card">
          <div className="products-spinner"></div>
          <p>Loading products...</p>
        </div>
      ) : error ? (
        <div className="products-state-card products-error-card">
          <div className="products-state-icon">!</div>

          <h3>Unable to load products</h3>

          <p>{error}</p>

          <button
            type="button"
            className="products-retry-button"
            onClick={() => fetchProducts(pagination.page, status)}
          >
            Try Again
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="products-state-card">
          <div className="products-state-icon">📦</div>

          <h3>No products found</h3>

          <p>There are no products for the selected filter.</p>
        </div>
      ) : (
        <>
          <div className="products-table-card">
            <div className="products-table-wrapper">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Shop</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Availability</th>
                    <th>Featured</th>
                    <th>Created</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <div className="product-info">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="product-image"
                            />
                          ) : (
                            <div className="product-image-placeholder">
                              📦
                            </div>
                          )}

                          <div className="product-details">
                            <strong>{product.name}</strong>

                            <span>
                              {product.slug || "No slug"}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="shop-info">
                          <strong>
                            {product.shop?.name || "Unknown Shop"}
                          </strong>

                          <span>
                            {product.shop?.phone || "No phone"}
                          </span>
                        </div>
                      </td>

                      <td>
                        <div className="category-info">
                          <strong>
                            {product.category?.name || "Uncategorized"}
                          </strong>

                          <span>
                            {product.category?.isActive
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </div>
                      </td>

                      <td>
                        <strong className="product-price">
                          {formatAmount(product.price)}
                        </strong>
                      </td>

                      <td>
                        <span
                          className={getStockClass(product.inventory)}
                        >
                          {getStockText(product.inventory)}
                        </span>
                      </td>

                      <td>
                        <span
                          className={getAvailabilityClass(
                            product.isAvailable
                          )}
                        >
                          {product.isAvailable
                            ? "Available"
                            : "Unavailable"}
                        </span>
                      </td>

                      <td>
                        {product.isFeatured ? (
                          <span className="featured-badge">
                            ★ Featured
                          </span>
                        ) : (
                          <span className="not-featured-badge">
                            Not Featured
                          </span>
                        )}
                      </td>

                      <td>
                        <div className="date-info">
                          {formatDate(product.createdAt)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="products-pagination">
            <div className="pagination-info">
              Showing page <strong>{pagination.page}</strong> of{" "}
              <strong>{pagination.totalPages}</strong>

              <span>
                ({pagination.total} product
                {pagination.total === 1 ? "" : "s"})
              </span>
            </div>

            <div className="pagination-buttons">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={
                  !pagination.hasPreviousPage || loading
                }
              >
                ← Previous
              </button>

              <div className="pagination-current">
                {pagination.page}
              </div>

              <button
                type="button"
                onClick={handleNext}
                disabled={!pagination.hasNextPage || loading}
              >
                Next →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Products;