import { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await api.post("/admin/login", { email, password });
      localStorage.setItem("adminToken", res.data.token);
      navigate("/admin/add-product");
    } catch {
      alert("Invalid admin credentials");
    }
  };

  return (
    <div className="admin-login-page">
      <div className="login-card">
        <div className="icon">🔒</div>
        <h1>Admin Access</h1>
        <p>Authorized personnel only</p>

        <input
          placeholder="Admin Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={login}>Login</button>
      </div>

      <style>{`
.admin-login-page {
  min-height: 100vh;
  background: radial-gradient(circle at top, #020617, #000);
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-card {
  width: 420px;
  padding: 48px;
  background: rgba(15,23,42,.85);
  backdrop-filter: blur(20px);
  border-radius: 26px;
  text-align: center;
  box-shadow: 0 0 60px rgba(34,197,94,.35);
  border: 1px solid rgba(34,197,94,.4);
}

.icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.login-card h1 {
  color: white;
  font-size: 32px;
  font-weight: 900;
}

.login-card p {
  color: #94a3b8;
  margin-bottom: 32px;
}

.login-card input {
  width: 100%;
  padding: 14px 18px;
  margin-bottom: 14px;
  border-radius: 999px;
  border: none;
  outline: none;
  background: #020617;
  color: white;
  font-size: 15px;
}

.login-card button {
  width: 100%;
  padding: 14px;
  border-radius: 999px;
  border: none;
  background: linear-gradient(135deg,#22c55e,#16a34a);
  color: #020617;
  font-weight: 900;
  font-size: 16px;
  cursor: pointer;
  transition: transform .2s, box-shadow .2s;
}

.login-card button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(34,197,94,.5);
}
      `}</style>
    </div>
  );
}