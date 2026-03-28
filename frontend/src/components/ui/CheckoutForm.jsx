import { useState } from "react";
import OrderTypeSelector from "./OrderTypeSelector";
import "./CheckoutForm.css";

function CheckoutForm({ cartItems, onClose, onOrderComplete }) {
  const [orderType, setOrderType] = useState("takeout");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.totalPrice, 0);
  };

  const handleSubmit = () => {
    console.log("Submitting order with details:");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <h2>Checkout</h2>

        <form onSubmit={handleSubmit}>
          <OrderTypeSelector
            selectedType={orderType}
            onSelectType={setOrderType}
          />

          <div className="form-section">
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="(Optional)"
              />
            </div>

            {orderType === "delivery" && (
              <div className="form-group">
                <label htmlFor="address">Delivery Address *</label>
                <textarea
                  id="address"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Enter your delivery address"
                  rows="3"
                  required
                />
              </div>
            )}
          </div>

          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="summary-items">
              {cartItems.map((item, index) => (
                <div key={index} className="summary-item">
                  <span>
                    {item.quantity}x {item.product.name}
                  </span>
                  <span>₱ {item.totalPrice.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>₱ {calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            className="submit-order-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Placing Order..." : "Place Order"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CheckoutForm;
