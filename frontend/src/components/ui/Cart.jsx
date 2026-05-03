import { Trash2Icon } from 'lucide-react'
import './Cart.css'
import { useCart } from '@/utils/useCart'

const Cart = ({ isOpen, onClose, onCheckout }) => {
  const { cart, total, removeItem, updateItemQuantity } = useCart()
  if (!isOpen) return null

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
          {cart?.length === 0 ? (
            <div className="cart-empty">
              <p>Your cart is empty</p>
              <p className="cart-empty-hint">Add items to get started!</p>
            </div>
          ) : (
            cart?.map((item) => (
              <div key={item.product_code} className="cart-item">
                <div className="cart-item-image">
                  <img src={item?.product_image} alt={item?.product_name} />
                </div>
                <div className="cart-item-details">
                  <h4>{item.product_name}</h4>
                  {Object.keys(item.options)?.length > 0 && (
                    <div className="cart-item-options">
                      {Object.values(item.options).map((option, index) => (
                        <span key={index} className="customization-tag">
                          {option.name}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="cart-item-footer">
                    <div className="cart-item-quantity">
                      <button className="quantity-btn" onClick={() => updateItemQuantity(item, item.quantity - 1)}>
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button className="quantity-btn" onClick={() => updateItemQuantity(item, item.quantity + 1)}>
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <div className="cart-item-actions">
                  <Trash2Icon onClick={() => removeItem(item)} className={'cart-item-remove'} />

                  <span className="cart-item-price">₱ {item?.line_total}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total:</span>
              <span className="cart-total-amount">₱{total}</span>
            </div>
            <button className="checkout-button" onClick={onCheckout}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart
