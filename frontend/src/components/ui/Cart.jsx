import { Trash2Icon } from 'lucide-react'
import './Cart.css'
import { useCartStore } from '@/store/useCartStore'

const Cart = ({ isOpen, onClose, onCheckout }) => {
  const hasHydrated = useCartStore.persist.hasHydrated()

  const cartItems = useCartStore((state) => state.items)
  const removeCart = useCartStore((state) => state.removeCart)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const cartTotal = useCartStore((state) => state.getCartTotal)

  if (!hasHydrated) {
    return <div className="loading">Loading cart...</div>
  }
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
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <p>Your cart is empty</p>
              <p className="cart-empty-hint">Add items to get started!</p>
            </div>
          ) : (
            cartItems?.map((item, index) => (
              <div key={index} className="cart-item">
                <div className="cart-item-image">
                  <img src={item.product.image_url} alt={item.product.name} />
                </div>
                <div className="cart-item-details">
                  <h4>{item.product.name}</h4>
                  {Object.keys(item.customizations).length > 0 && (
                    <div className="cart-item-customizations">
                      {Object.values(item.customizations).map((option) => (
                        <span key={option.id} className="customization-tag">
                          {option.name}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="cart-item-footer">
                    <div className="cart-item-quantity">
                      <button
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.productKey, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.productKey, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <div className="cart-item-actions">
                  <Trash2Icon onClick={() => removeCart(item.productKey)} className={'cart-item-remove'} />

                  <span className="cart-item-price">₱ {item.totalPrice}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total:</span>
              <span className="cart-total-amount">₱{cartTotal()}</span>
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
