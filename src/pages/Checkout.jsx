import { useState } from "react";
import api from "../api/axios";
import { useCart } from "../context/CartContext";
import "./Checkout.css";

function Checkout() {
  const { cartItems, clearCart } = useCart();
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cartItems.length) return;

    setLoading(true);
    try {
      const res = await api.post("/orders", {
        customerName: `${firstName} ${lastName}`,
        email,
        phone,
        address,
        items: cartItems.map((i) => ({
          productId: i.id,
          quantity: i.quantity,
        })),
      });

      clearCart();
      setOrderId(res.data.orderId);
    } catch {
      alert("Error placing order");
    } finally {
      setLoading(false);
    }
  };

  /* SUCCESS SCREEN */
  if (orderId) {
    return (
      <div className="checkout-success">
        <div className="success-box">
          <h1>Order Confirmed 🎉</h1>
          <p>Your order has been placed successfully.</p>
          <strong>Order ID #{orderId}</strong>
          <span>Confirmation email sent to</span>
          <b>{email}</b>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-layout">
      {/* LEFT — FORM */}
      <form className="checkout-page" onSubmit={handleSubmit}>
        <h1>Checkout</h1>

        {/* CUSTOMER INFO */}
        <div className="checkout-section">
          <h3>Customer Information</h3>

          <div className="checkout-row">
            <input
              placeholder="First Name"
              required
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              placeholder="Last Name"
              required
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <input
            placeholder="Email"
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            placeholder="Phone Number"
            required
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        {/* ADDRESS */}
        <div className="checkout-section">
          <h3>Shipping Address</h3>
          <input
            placeholder="Full Address"
            required
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        {/* TOTAL */}
        <div className="checkout-section total-box">
          <span>Total Amount</span>
          <strong>${total.toFixed(2)}</strong>
        </div>

        {/* PAYMENT */}
        <div className="checkout-section payment-box">
          <h3>Payment Method</h3>
          <p>Cash on Delivery</p>
        </div>

        <button className="checkout-confirm" disabled={loading}>
          {loading ? "Processing..." : "Confirm Order"}
        </button>
      </form>

      {/* RIGHT — ORDER SUMMARY */}
      <aside className="checkout-aside">
        <h3>Your Order</h3>

        {cartItems.map((item) => (
          <div key={item.id} className="aside-item">
            <img src={item.imageUrl} alt={item.name} />

            <div className="aside-info">
              <span className="aside-name">{item.name}</span>
              <span className="aside-qty">Qty: {item.quantity}</span>
            </div>

            <strong className="aside-price">
              ${(item.price * item.quantity).toFixed(2)}
            </strong>
          </div>
        ))}

        <div className="aside-total">
          <span>Total</span>
          <strong>${total.toFixed(2)}</strong>
        </div>
      </aside>
    </div>
  );
}

export default Checkout;