import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import "./Cart.css";

function Cart() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <h1>Your cart is empty</h1>
        <Link to="/products" className="cart-link">
          Browse Products →
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page container">
      <h1 className="cart-title">Shopping Cart</h1>

      <div className="cart-layout">
        {/* ITEMS */}
        <div className="cart-list">
          {cartItems.map(item => (
            <div key={item.id} className="cart-row">
              <div className="cart-info">
                <h3>{item.name}</h3>
                <span>{item.weight}</span>
              </div>

              <div className="cart-qty">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              </div>

              <div className="cart-price">${item.price}</div>

              <button
                className="cart-remove"
                onClick={() => removeFromCart(item.id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* SUMMARY */}
        <div className="cart-summary">
          <h2>Order Summary</h2>

          <div className="summary-line">
            <span>Total</span>
            <strong>${total.toFixed(2)}</strong>
          </div>

          <Link to="/checkout" className="checkout-btn">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Cart;
