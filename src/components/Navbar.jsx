import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import MenuDrawer from "./MenuDrawer";

function Navbar() {
  const { cartCount } = useCart();

  return (
    <nav style={styles.nav}>
      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        <MenuDrawer />

        <Link to="/" style={styles.brand}>
          <img src="/PumpLab.jpg" alt="Pump Lab Logo" style={styles.logo} />
          <div>
            <h2 style={styles.name}>Pump Lab</h2>
            <span style={styles.slogan}>Science Meets Strength</span>
          </div>
        </Link>
      </div>

      <Link to="/cart">Cart ({cartCount})</Link>
    </nav>
  );
}


const styles = {
  nav: {
    backgroundColor: "white",
    padding: "16px 40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    textDecoration: "none",
    color: "inherit",
  },
  logo: {
    width: "46px",
    height: "46px",
    borderRadius: "12px",
  },
  name: {
    margin: 0,
    fontSize: "22px",
    fontWeight: 700,
  },
  slogan: {
    fontSize: "12px",
    color: "#64748b",
  },
};

export default Navbar;
