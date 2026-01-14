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
    min-height: 100svh;
  }
}

.toolbar {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin: 60px 0;
}

.products {
  background: #f8fafc;
  padding: 60px 80px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 36px;
}

@media (max-width: 1100px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 700px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

.card {
  background: white;
  border-radius: 26px;
  padding: 26px;
  text-align: center;
  box-shadow: 0 30px 60px rgba(0,0,0,.12);
  display: flex;
  flex-direction: column;
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
  aspect-ratio: 1 / 1;
}

@media (max-width: 700px) {
  .image-box {
    height: 130px;
  }
}

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

.price {
  font-size: 24px;
  font-weight: 900;
  color: #2563eb;
}

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

.qty {
  background: #020617;
  color: white;
  border-radius: 999px;
  padding: 8px 16px;
  display: flex;
  gap: 12px;
  justify-content: center;
}

.add {
  flex: 1;
  border-radius: 999px;
  background: #2563eb;
  color: white;
  border: none;
  font-weight: 800;
  padding: 12px;
}

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
  text-align: center;
}

.close {
  position: absolute;
  top: 14px;
  right: 18px;
  border: none;
  background: none;
  font-size: 22px;
}
      `}</style>
    </>
  );
}