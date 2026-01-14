import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home-hero">
      {/* LEFT */}
      <div className="home-left">
        <h1>Fuel Your Performance</h1>

        <p className="home-subtitle">
          Premium supplements engineered to push your limits.
        </p>

        <Link to="/products">
          <button className="home-button">Shop Products</button>
        </Link>
      </div>

      {/* RIGHT */}
      <div className="home-right">
        <img src="/PumpLab.jpg" alt="Pump Lab" className="home-logo" />
      </div>
    </div>
  );
}

export default Home;
