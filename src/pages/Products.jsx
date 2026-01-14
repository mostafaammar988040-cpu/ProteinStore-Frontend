import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import { useCart } from "../context/CartContext";

export default function Products() {
  const { addToCart } = useCart();
  const [searchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [qty, setQty] = useState({});
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sortBy, setSortBy] = useState("default");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const selectedCategory = searchParams.get("category");
  const selectedSub = searchParams.get("sub");
useEffect(() => {
  api.get("/products").then((res) => {
    if (Array.isArray(res.data)) {
      setProducts(res.data);
    } else if (Array.isArray(res.data.products)) {
      setProducts(res.data.products);
    } else {
      console.error("Unexpected products response:", res.data);
      setProducts([]);
    }
  });
}, []);

  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      const matchSearch = p.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchPrice = p.price <= maxPrice;

      const matchCategory =
        !selectedCategory ||
        selectedCategory === "all" ||
        p.category === selectedCategory;

      const matchSub =
        !selectedSub ||
        selectedSub === "all" ||
        p.subCategory === selectedSub;

      return matchSearch && matchPrice && matchCategory && matchSub;
    });

    switch (sortBy) {
      case "price-asc":
        return [...result].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...result].sort((a, b) => b.price - a.price);
      case "name":
        return [...result].sort((a, b) => a.name.localeCompare(b.name));
      case "newest":
        return [...result].sort((a, b) => b.id - a.id);
      default:
        return result;
    }
  }, [products, search, maxPrice, selectedCategory, selectedSub, sortBy]);

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <h1>All Products</h1>
        <p>Everything you need in one place</p>
      </section>

      {/* TOOLBAR */}
      <div className="toolbar">
        <input
          className="search"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="sort"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="default">Sort</option>
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="name">Name A → Z</option>
        </select>
      </div>

      {/* PRODUCTS */}
      <section className="products">
        <div className="grid">
          {filteredProducts.map((p) => (
            <div key={p.id} className="card">
              <div className="image-box">
                <img src={p.imageUrl} alt={p.name} />

                {/* HOVER OVERLAY */}
                <div
                  className="overlay"
                  onClick={() => setSelectedProduct(p)}
                >
                  <span>Details</span>
                </div>
              </div>

              <h3>{p.name}</h3>
              <span className="weight">{p.weight}</span>
              <div className="price">${p.price}</div>

              <div className="actions">
                <div className="qty">
                  <button
                    onClick={() =>
                      setQty((q) => ({
                        ...q,
                        [p.id]: Math.max(1, (q[p.id] || 1) - 1),
                      }))
                    }
                  >
                    −
                  </button>

                  <span>{qty[p.id] || 1}</span>

                  <button
                    onClick={() =>
                      setQty((q) => ({
                        ...q,
                        [p.id]: (q[p.id] || 1) + 1,
                      }))
                    }
                  >
                    +
                  </button>
                </div>

                <button
                  className="add"
                  onClick={() => addToCart(p, qty[p.id] || 1)}
                >
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DETAILS MODAL */}
      {selectedProduct && (
        <div className="modal-bg" onClick={() => setSelectedProduct(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="close"
              onClick={() => setSelectedProduct(null)}
            >
              ✕
            </button>

            <img
              src={selectedProduct.imageUrl}
              alt={selectedProduct.name}
            />

            <h2>{selectedProduct.name}</h2>
            <p className="modal-weight">{selectedProduct.weight}</p>
            <div className="modal-price">${selectedProduct.price}</div>

            <p className="description">
              {selectedProduct.description}
            </p>
          </div>
        </div>
      )}

      {/* CSS */}
      <style>{`
.hero {
  background: radial-gradient(circle at top, #0f172a, #020617);
  min-height: 100vh;
  padding: 120px 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
}
  @media (max-width: 700px) {
  .hero {
    padding: 80px 20px;
    min-height: 100svh; /* better than vh on mobile */
  }

  .hero h1 {
    font-size: 34px;
    line-height: 1.2;
  }

  .hero p {
    font-size: 16px;
    margin-top: 12px;
  }
}
  @media (max-width: 700px) {
  .hero button,
  .hero .btn {
    margin-top: 24px;
    padding: 14px 26px;
    font-size: 16px;
  }
}

.toolbar {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin: 60px 0;
}

.search, .sort {
  padding: 14px 18px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
}

.products {
  background: #f8fafc;
  padding: 60px 80px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* laptop */
  gap: 36px;
}

/* Tablets */
@media (max-width: 1100px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Phones */
@media (max-width: 700px) {
  .grid {
    grid-template-columns: repeat(2, 1fr); /* SAME STYLE, just 2 columns */
    gap: 20px;
  }
}

.card {
  background: white;
  border-radius: 26px;
  padding: 26px;
  text-align: center;
  box-shadow: 0 30px 60px rgba(0,0,0,.12);
}

@media (max-width: 700px) {
  .card {
    padding: 18px;
    border-radius: 20px;
  }

  .price {
    font-size: 20px;
  }
}
  @media (max-width: 700px) {
  .image-box {
    height: 130px;
  }
}
.image-box {
  position: relative;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
}

.image-box img {
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
}

/* HOVER */
.overlay {
  position: absolute;
  inset: 0;
  background: rgba(2,6,23,.75);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  cursor: pointer;
  transition: .3s;
  border-radius: 16px;
}
.image-box:hover .overlay {
  opacity: 1;
}
.overlay span {
  color: white;
  font-weight: 900;
  font-size: 18px;
}

.price {
  font-size: 24px;
  font-weight: 900;
  color: #2563eb;
}

.actions {
  display: flex;
  gap: 12px;
}

.qty {
  background: #020617;
  color: white;
  border-radius: 999px;
  padding: 8px 16px;
  display: flex;
  gap: 12px;
}

.add {
  flex: 1;
  border-radius: 999px;
  background: #2563eb;
  color: white;
  border: none;
  font-weight: 800;
}

/* MODAL */
.modal-bg {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal {
  background: white;
  width: 420px;
  padding: 30px;
  border-radius: 30px;
  position: relative;
  text-align: center;
}

.modal img {
  max-width: 200px;
  margin-bottom: 16px;
}

.modal-price {
  font-size: 28px;
  font-weight: 900;
  color: #2563eb;
}

.description {
  margin-top: 16px;
  color: #334155;
  line-height: 1.6;
}

.close {
  position: absolute;
  top: 14px;
  right: 18px;
  border: none;
  background: none;
  font-size: 22px;
  cursor: pointer;
}
      `}</style>
    </>
  );
}