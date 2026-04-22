import { useMemo, useState } from 'react'
import OrderTypeSelector from './OrderTypeSelector'
import './CheckoutForm.css'
import { useCart } from '@/utils/useCart'
import PaymentMethods from './PaymentMethod'
import { useAuth } from '@/store/useAuthStore'
import { useCheckout } from '@/hooks/useCheckout'

function CheckoutForm({ onClose }) {
  const { cart, total, removeItem, updateItemQuantity } = useCart()
  const { user, isAuthenticated } = useAuth()
  const { mutate: checkout } = useCheckout()

  const [form, setForm] = useState({
    order_type: 'dine-in',
    name: isAuthenticated ? user?.full_name : '',
    email: isAuthenticated ? user?.email : '',
    phone: '',
    payment_method: 'cash',
    cart_items: cart,
  })

  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    checkout(form)
  }

  const handleChange = (e) => {
    console.log('target', e.target)
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSelect = (value, key) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const vatPrice = useMemo(() => {
    return (parseFloat(total) * 0.12).toFixed(2)
  }, [total])

  const totalAmout = useMemo(() => {
    return (parseFloat(total) + parseFloat(vatPrice)).toFixed(2)
  }, [vatPrice, total])

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <h2>Checkout</h2>

        <form onSubmit={handleSubmit}>
          <OrderTypeSelector selectedType={form.order_type} onSelectType={handleSelect} />

          <div className="form-section">
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                disabled={isAuthenticated}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="(Optional for digital receipt)"
                value={form.email}
                onChange={handleChange}
                disabled={isAuthenticated}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input type="tel" id="phone" name="phone" onChange={handleChange} placeholder="(Optional)" />
            </div>

            {form.order_type === 'delivery' && (
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
          <PaymentMethods selected={form.payment_method} onChange={handleSelect} />

          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="summary-items">
              {cart.map((item, index) => (
                <div key={index} className="summary-item">
                  <span>
                    {item.quantity}x {item.product_name}
                  </span>
                  <span>₱ {item.line_total.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="summary-subTotal">
              <span>Subtotal</span>
              <span>₱ {total.toFixed(2)}</span>
            </div>

            <div className="summary-vat-amount">
              <span>Vat Amount</span>
              <span>₱ {vatPrice}</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>₱ {totalAmout}</span>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-order-button" disabled={isSubmitting}>
            {isSubmitting ? 'Placing Order...' : 'Place Order'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CheckoutForm
