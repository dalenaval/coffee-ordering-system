import './PaymentMethod.css'
import GcashIconPath from '@/assets/gcash.svg'
import MayaIconPath from '@/assets/maya.svg'
import VisaIconPath from '@/assets/visa.svg'
import { Wallet } from 'lucide-react'
import PaymentIcon from './PaymentIcon'

const CardField = ({ label, placeholder, type = 'text', halfWidth = false }) => {
  return (
    <div className={`form-field ${halfWidth ? 'half-width' : ''}`}>
      <label className="form-label">{label}</label>
      <input type={type} placeholder={placeholder} className="form-input" />
    </div>
  )
}

export default function PaymentMethods({ selected, onChange }) {
  const options = [
    {
      id: 'cash',
      label: 'Cash',
      description: 'Pay with cash upon pickup or delivery',
      icon: <Wallet />,
    },
    {
      id: 'gcash',
      label: 'GCash',
      description: 'Pay via GCash e-wallet',
      icon: <PaymentIcon altName={'gcash'} icon={GcashIconPath} />,
      badge: 'Popular',
    },
    {
      id: 'maya',
      label: 'Maya',
      description: 'Pay via Maya e-wallet',
      icon: <PaymentIcon altName={'maya'} icon={MayaIconPath} />,
    },
    {
      id: 'card',
      label: 'Credit / Debit Card',
      description: 'Visa, Mastercard, and more',
      icon: <PaymentIcon altName={'visa'} icon={VisaIconPath} />,
    },
  ]

  return (
    <div className="payment-methods">
      <div className="payment-methods-header">
        <h2>Payment Method</h2>
        <p>Choose how you'd like to pay</p>
      </div>

      <div className="payment-options">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className={`payment-option ${selected === opt.id ? 'selected' : ''}`}
          >
            <div className="payment-icon">{opt.icon}</div>
            <div className="payment-content">
              <div className="payment-header-row">
                <span className="payment-label">{opt.label}</span>
                {opt.badge && <span className="payment-badge">{opt.badge}</span>}
              </div>
              <p className="payment-description">{opt.description}</p>
            </div>
            <div className="payment-radio">
              <div className="payment-radio-dot"></div>
            </div>
          </button>
        ))}

        {selected === 'card' && (
          <div className="payment-form">
            <CardField label="Cardholder Name" placeholder="Juan Dela Cruz" />
            <CardField label="Card Number" placeholder="0000 0000 0000 0000" />
            <div className="form-group-row">
              <CardField label="Expiry Date" placeholder="MM / YY" halfWidth />
              <CardField label="CVV" placeholder="123" type="password" halfWidth />
            </div>
          </div>
        )}

        {(selected === 'gcash' || selected === 'maya') && (
          <div className="payment-form">
            <div className="form-field">
              <label className="form-label">{selected === 'gcash' ? 'GCash' : 'Maya'} Mobile Number</label>
              <input type="tel" placeholder="09XX XXX XXXX" className="form-input" />
              <p className="payment-form-hint">A payment request will be sent to this number.</p>
            </div>
          </div>
        )}
      </div>

      <div className="payment-footer">
        <span className="security-icon">✓</span>
        <span>Your payment information is encrypted and secure.</span>
      </div>
    </div>
  )
}
