import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Products.css";

function Products() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const category = searchParams.get("category");
  const search = searchParams.get("search");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [sort, setSort] = useState("relevance");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

const response = search
  ? await api.get("/products/search", {
      params: {
        q: search,
        ...(category && category !== "all" && { category }),
      },
    })
  : await api.get("/products", {
      params: {
        ...(category && { category }),
      },
    });

        const data = response.data;

        setProducts(data.products || data.data || []);
      } catch (error) {
        console.error("Products error:", error);
        setError("Unable to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, search]);






const sortedProducts = [...products].sort((a, b) => {
  if (sort === "price-low") {
    return Number(a.price) - Number(b.price);
  }

  if (sort === "price-high") {
    return Number(b.price) - Number(a.price);
  }

  return 0;
});














  
const pageTitle = search
  ? `Search results for "${search}"`
  : category === "personal-care"
    ? "Personal Care"
    : category
      ? category.charAt(0).toUpperCase() + category.slice(1)
      : "All Products";


  return (
    <main className="products-page">
      <div className="products-page-header">
        <div>
          <span>MYKASHO STORE</span>
          <h1>{pageTitle}</h1>

          {!loading && (
            <p>
              {products.length} product
              {products.length !== 1 ? "s" : ""} available
            </p>
          )}
        </div>
      </div>

      {loading && (
        <div className="products-page-message">
          Loading products...
        </div>
      )}

      {error && (
        <div className="products-page-message error">
          {error}
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="products-page-message">
          <h2>No products found</h2>
          <p>Try another category or search.</p>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="products-list-layout">
          {/* Filters */}
          <aside className="products-filters">
            <h3>Filters</h3>

            <div className="filter-group">
              <strong>Category</strong>

              <button
                onClick={() => navigate("/products")}
              >
                All Products
              </button>

              <button
                onClick={() =>
                  navigate("/products?category=grocery")
                }
              >
                Grocery
              </button>

            




<button
  onClick={() =>
    navigate("/products?category=personal-care")
  }
>
  Personal Care
</button>






              <button
                onClick={() =>
                  navigate("/products?category=electronics")
                }
              >
                Electronics
              </button>

              <button
                onClick={() =>
                  navigate("/products?category=fashion")
                }
              >
                Fashion
              </button>
            </div>
          </aside>

          {/* Products */}
          <section className="products-result">
            <div className="products-toolbar">
              <span>
                Showing {products.length} products
              </span>

             <select
  value={sort}
  onChange={(event) => setSort(event.target.value)}
>
                <option value="relevance">Relevance</option>
                <option value="price-low">
                  Price: Low to High
                </option>
                <option value="price-high">
                  Price: High to Low
                </option>
              </select>
            </div>

            <div className="products-list-grid">
              {sortedProducts.map((product) => (
                <article
                  key={product.id}
                  className="listing-product-card"
                  onClick={() =>
                    navigate(`/products/${product.id}`)
                  }
                >
                  <div className="listing-product-image">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                      />
                    ) : (
                      <span>📦</span>
                    )}
                  </div>

                  <div className="listing-product-info">
                    <h2>{product.name}</h2>

                    {product.category?.name && (
                      <small>
                        {product.category.name}
                      </small>
                    )}

                    <div className="product-rating">
  {product.averageRating > 0 ? (
    <>
      <span className="rating-stars">
        {"★".repeat(Math.round(product.averageRating))}
        {"☆".repeat(5 - Math.round(product.averageRating))}
      </span>

      <span className="rating-value">
        {product.averageRating}
      </span>

      <span className="rating-count">
        ({product.totalReviews})
      </span>
    </>
  ) : (
    <span className="no-rating">
      No reviews yet
    </span>
  )}
</div>

                    <div className="listing-price">
                      ₹{product.price}
                    </div>

                    <button
                      onClick={(event) => {
                        event.stopPropagation();

                        navigate(
                          `/products/${product.id}`
                        );
                      }}
                    >
                      View Product
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default Products;