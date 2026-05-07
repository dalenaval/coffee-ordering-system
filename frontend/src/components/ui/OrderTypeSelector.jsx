import './OrderTypeSelector.css'
import orderTypes from '@/data/orderTypes'

const OrderTypeSelector = ({ selectedType, onSelectType }) => {
  return (
    <div className="order-type-selector">
      <h3>Choose Order Type</h3>
      <div className="order-type-options">
        {orderTypes.map((type) => (
          <button
            type="button"
            key={type.id}
            className={`order-type-option ${selectedType === type.value ? 'selected' : ''}`}
            onClick={() => onSelectType(type.value, 'order_type')}
            disabled={type.status === 'coming_soon'}
          >
            {type.status === 'coming_soon' && (
              <div className="order-overlay">
                <span className="coming-soon-badge">Coming Soon</span>
              </div>
            )}
            <span className="order-type-icon">{type.icon}</span>
            <span className="order-type-name">{type.name}</span>
            <span className="order-type-description">{type.description}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default OrderTypeSelector
