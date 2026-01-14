import { Link } from "react-router-dom";
import { useState } from "react";
import { categoryTree } from "../data/categories";

export default function MenuDrawer() {
  const [open, setOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState(null);
  const [categoriesOpen, setCategoriesOpen] = useState(true);

  return (
    <>
      {/* MENU BUTTON */}
      <button className="menu-btn" onClick={() => setOpen(true)}>
        ☰
      </button>

      {open && (
        <div className="menu-overlay" onClick={() => setOpen(false)}>
          <div className="menu-drawer" onClick={(e) => e.stopPropagation()}>
            <header>
              <h3>Menu</h3>
              <button onClick={() => setOpen(false)}>✕</button>
            </header>

            <Link to="/" className="menu-link" onClick={() => setOpen(false)}>
              Home
            </Link>

            {/* PRODUCTS */}
            <div className="menu-section">
              <button
                className="accordion-btn main"
                onClick={() => setCategoriesOpen(!categoriesOpen)}
              >
                Products
                <span className={categoriesOpen ? "arrow open" : "arrow"}>
                  ▶️
                </span>
              </button>

              {categoriesOpen && (
                <>
                  {/* 🌍 ALL PRODUCTS */}
                  <Link
                    to="/products"
                    className="submenu-link all-products"
                    onClick={() => setOpen(false)}
                  >
                    All Products
                  </Link>

                  {categoryTree.map((cat) => (
                    <div key={cat.name} className="accordion">
                      <button
                        className="accordion-btn"
                        onClick={() =>
                          setOpenCategory(
                            openCategory === cat.name ? null : cat.name
                          )
                        }
                      >
                        {cat.name}
                        <span
                          className={
                            openCategory === cat.name ? "arrow open" : "arrow"
                          }
                        >
                          ▶️
                        </span>
                      </button>

                      {openCategory === cat.name && (
                        <div className="accordion-content">
                          {/* CATEGORY ALL */}
                          <Link
                            to={`/products?category=${encodeURIComponent(
                              cat.name
                            )}`}
                            className="submenu-link"
                            onClick={() => setOpen(false)}
                          >
                            All {cat.name}
                          </Link>

                          {cat.children.map((child) => (
                            <Link
                              key={child}
                              to={`/products?category=${encodeURIComponent(
                                cat.name
                              )}&sub=${encodeURIComponent(child)}`}
                              className="submenu-link"
                              onClick={() => setOpen(false)}
                            >
                              {child}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CSS */}
      <style>{`
.menu-btn {
  background: #22c55e;
  color: white;
  border: none;
  border-radius: 14px;
  padding: 12px 16px;
  font-size: 20px;
}

.menu-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.6);
  backdrop-filter: blur(8px);
  z-index: 200;
}

.menu-drawer {
  width: 320px;
  height: 100%;
  background: #020617;
  color: white;
  padding: 24px;
  overflow-y: auto;
}

.menu-link {
  display: block;
  padding: 14px 0;
  color: white;
  font-size: 18px;
  text-decoration: none;
}

.menu-section {
  margin-top: 30px;
}

.accordion {
  margin-top: 12px;
}

.accordion-btn {
  width: 100%;
  background: #1e293b;
  border: none;
  color: white;
  padding: 12px 14px;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.arrow {
  transition: transform 0.2s ease;
}
.arrow.open {
  transform: rotate(90deg);
}

.accordion-content {
  margin-top: 8px;
  padding-left: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.submenu-link {
  background: #334155;
  padding: 10px 14px;
  border-radius: 8px;
  color: white;
  text-decoration: none;
  font-size: 14px;
}

.submenu-link.all-products {
  background: linear-gradient(135deg,#3b82f6,#6366f1);
  font-weight: 900;
}
      `}</style>
    </>
  );
}