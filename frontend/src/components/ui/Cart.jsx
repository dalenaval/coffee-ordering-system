import { Trash2Icon } from "lucide-react";
import "./Cart.css";

const Cart = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  const calculateCartTotal = () => {
    return cartItems
      .reduce((total, item) => total + item.totalPrice, 0)
      .toFixed(2);
  };

  if (!isOpen) return null;

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-sidebar" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button className="cart-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="cart-items">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <p>Your cart is empty</p>
              <p className="cart-empty-hint">Add items to get started!</p>
            </div>
          ) : (
            cartItems.map((item, index) => (
              <div key={index} className="cart-item">
                <div className="cart-item-image">
                  <img src={item.product.image_url} alt={item.product.name} />
                </div>
                <div className="cart-item-details">
                  <h4>{item.product.name}</h4>
                  {item.customizations.length > 0 && (
                    <div className="cart-item-customizations">
                      {item.customizations.map((custom, idx) => (
                        <span key={idx} className="customization-tag">
                          {custom.name}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="cart-item-footer">
                    <div className="cart-item-quantity">
                      <button
                        className="quantity-btn"
                        onClick={() =>
                          onUpdateQuantity(index, item.quantity - 1)
                        }
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className="quantity-btn"
                        onClick={() =>
                          onUpdateQuantity(index, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <div className="cart-item-actions">
                  <Trash2Icon
                    onClick={() => onRemoveItem(index)}
                    className={"cart-item-remove"}
                  />

                  <span className="cart-item-price">
                    ₱ {item.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total:</span>
              <span className="cart-total-amount">₱{calculateCartTotal()}</span>
            </div>
            <button className="checkout-button" onClick={onCheckout}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
