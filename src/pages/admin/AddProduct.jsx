import { useState } from "react";
import api from "../../api/axios";

export default function AddProduct() {
  const [product, setProduct] = useState({
    name: "",
    category: "",
    subCategory: "",
    description: "",
    price: "",
    weight: "",
    imageUrl: "",
  });

  const addProduct = async () => {
    try {
      await api.post("/admin/products", product, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      alert("Product added successfully!");
    } catch {
      alert("Failed to add product");
    }
  };

  return (
    <div className="admin-page">
      <h1>Add New Product</h1>

      <div className="admin-grid">
        {/* FORM */}
        <div className="panel">
          {Object.keys(product).map((key) => (
            <input
              key={key}
              placeholder={key}
              value={product[key]}
              onChange={(e) =>
                setProduct({ ...product, [key]: e.target.value })
              }
            />
          ))}
          <button onClick={addProduct}>Add Product</button>
        </div>

        {/* PREVIEW */}
        <div className="panel preview">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt="preview" />
          ) : (
            <span>Image Preview</span>
          )}
          <h3>{product.name || "Product Name"}</h3>
          <p>{product.category} / {product.subCategory}</p>
          <strong>${product.price || "0.00"}</strong>
        </div>
      </div>

      <style>{`
.admin-page {
  min-height: 100vh;
  background: #020617;
  padding: 80px;
  color: white;
}

.admin-page h1 {
  font-size: 48px;
  font-weight: 900;
  margin-bottom: 40px;
}

.admin-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.panel {
  background: rgba(15,23,42,.9);
  border-radius: 26px;
  padding: 32px;
  box-shadow: 0 20px 60px rgba(0,0,0,.5);
}

.panel input {
  width: 100%;
  padding: 14px 18px;
  margin-bottom: 12px;
  border-radius: 999px;
  border: none;
  background: #020617;
  color: white;
}

.panel button {
  width: 100%;
  padding: 14px;
  margin-top: 14px;
  border-radius: 999px;
  background: linear-gradient(135deg,#3b82f6,#6366f1);
  color: white;
  font-weight: 900;
  border: none;
  cursor: pointer;
}

.preview {
  text-align: center;
}

.preview img {
  max-width: 100%;
  max-height: 260px;
  object-fit: contain;
  margin-bottom: 16px;
}

.preview span {
  display: block;
  padding: 100px 0;
  color: #64748b;
}
      `}</style>
    </div>
  );
}