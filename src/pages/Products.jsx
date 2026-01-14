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
      } else {
        setProducts([]);
      }
    });
  }, []);

  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      return (
        p.name.toLowerCase().includes(search.toLowerCase()) &&
        p.price <= maxPrice &&
        (!selectedCategory ||
          selectedCategory === "all" ||
          p.category === selectedCategory) &&
        (!selectedSub ||
          selectedSub === "all" ||
          p.subCategory === selectedSub)
      );
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
        <div>
          <h1>All Products</h1>
          <p>Everything you need in one place</p>
        </div>
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
                <div className="overlay" onClick={() => setSelectedProduct(p)}>
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
            <button className="close" onClick={() => setSelectedProduct(null)}>
              ✕
            </button>
            <img src={selectedProduct.imageUrl} alt={selectedProduct.name} />
            <h2>{selectedProduct.name}</h2>
            <p className="modal-weight">{selectedProduct.weight}</p>
            <div className="modal-price">${selectedProduct.price}</div>
            <p className="description">{selectedProduct.description}</p>
          </div>
        </div>
      )}

      {/* CSS */}
    <style>{`
/* GLOBAL SAFETY */
html, body {
  max-width: 100%;
  overflow-x: hidden;
}

/* HERO */
.hero {
  background: radial-gradient(circle at top, #0f172a, #020617);
  min-height: 100vh;
  margin-top: -80px;
  padding: 200px 60px 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
}

@media (max-width: 700px) {
  .hero {
    margin-top: -70px;
    padding: 160px 20px 80px;
    min-height: 100svh;
  }
}

/* TOOLBAR */
.toolbar {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin: 60px auto;
}

.search,
.sort {
  padding: 14px 18px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  font-size: 15px;
}

/* MOBILE TOOLBAR FIX */
@media (max-width: 700px) {
  .toolbar {
    flex-direction: column;
    padding: 0 16px;
    gap: 12px;
  }

  .search,
  .sort {
    width: 100%;
  }
}

/* PRODUCTS SECTION */
.products {
  background: #f8fafc;
  padding: 60px 80px;
}

/* MOBILE PADDING FIX */
@media (max-width: 700px) {
  .products {
    padding: 30px 16px;
  }
}

/* GRID */
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 36px;
}

/* TABLET */
@media (max-width: 1100px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* MOBILE */
@media (max-width: 700px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

/* CARD */
.card {
  background: white;
  border-radius: 26px;
  padding: 26px;
  text-align: center;
  box-shadow: 0 30px 60px rgba(0,0,0,.12);
  display: flex;
  flex-direction: column;
}

@media (max-width: 700px) {
  .card {
    padding: 18px;
    border-radius: 20px;
  }
}

/* IMAGE */
.image-box {
  position: relative;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
}

@media (max-width: 700px) {
  .image-box {
    height: 130px;
  }
}

.image-box img {
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
  aspect-ratio: 1 / 1;
}

/* OVERLAY */
.overlay {
  position: absolute;
  inset: 0;
  background: rgba(2,6,23,.75);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: .3s;
  border-radius: 16px;
  cursor: pointer;
}

.image-box:hover .overlay {
  opacity: 1;
}

.overlay span {
  color: white;
  font-weight: 900;
  font-size: 18px;
}

/* PRICE */
.price {
  font-size: 24px;
  font-weight: 900;
  color: #2563eb;
}

@media (max-width: 700px) {
  .price {
    font-size: 20px;
  }
}

/* ACTIONS */
.actions {
  display: flex;
  gap: 12px;
  margin-top: auto;
}

@media (max-width: 700px) {
  .actions {
    flex-direction: column;
    gap: 10px;
  }
}

/* QTY */
.qty {
  background: #020617;
  color: white;
  border-radius: 999px;
  padding: 8px 16px;
  display: flex;
  gap: 12px;
  justify-content: center;
}

/* ADD BUTTON */
.add {
  flex: 1;
  border-radius: 999px;
  background: #2563eb;
  color: white;
  border: none;
  font-weight: 800;
  padding: 12px;
  cursor: pointer;
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

@media (max-width: 700px) {
  .modal {
    width: calc(100% - 32px);
  }
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