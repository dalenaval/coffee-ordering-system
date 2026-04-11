import { useEffect, useState, useMemo } from 'react'
import './ProductModal.css'
import OptionGroup from './OptionGroup'
import { useGetProductAttributes } from '@/hooks/useGetProductAttributes'
import { normalizeAttributes } from '@/utils/normalizeAttributes'
import { buildDefaultSelections } from '@/utils/buildDefaultSelections'
import { useCartStore } from '@/store/useCartStore'
import { calculateTotal } from '@/utils/calculateTotal'
const ProductModal = ({ product, onClose }) => {
  const { data: attributes, isLoading } = useGetProductAttributes(product?.id)

  const [quantity, setQuantity] = useState(1)
  const [selectedOptions, setSelectedOptions] = useState({})

  const addItem = useCartStore((state) => state.addItem)

  const normalizeGroup = useMemo(() => {
    return normalizeAttributes(attributes)
  }, [attributes])

  useEffect(() => {
    if (normalizeGroup) {
      const initialDefault = buildDefaultSelections(normalizeGroup)
      setSelectedOptions(initialDefault)
    }
  }, [normalizeGroup])

  const unitPrice = useMemo(() => {
    // let total = Object.values(selectedOptions).reduce((sum, current) => {
    //   console.log('current', current)
    //   sum + (parseFloat(current.price_modifier) || 0)
    // }, 0)
    let total = calculateTotal(product.price, selectedOptions)

    return total * quantity
  }, [selectedOptions, product.price, quantity])

  const handleAddToCart = () => {
    const cartItem = {
      product,
      customizations: selectedOptions,
      quantity,
    }

    addItem(cartItem)
    onClose()
  }

  if (isLoading) {
    return <div className="loading"> Loading ....</div>
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-close" onClick={onClose}>
          x
        </div>
        <div className="modal-header">
          <img src={product.image_url} alt={product.name} className="modal-product-image" />
          <div>
            <h2>{product.name}</h2>
            <p className="modal-description">{product.description}</p>
            <p className="modal-base-price">Base price: ₱ {parseFloat(product.price)}</p>
          </div>
        </div>

        <div className="customization-sections">
          {normalizeGroup.map((options, index) => {
            return (
              <OptionGroup
                attribute={options}
                key={index}
                selectedOptions={selectedOptions}
                setSelectedOptions={setSelectedOptions}
              />
            )
          })}
        </div>
        <div className="quantity-section">
          <h3>Quantity</h3>
          <div className="quantity-controls">
            <button className="quantity-button" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
              -
            </button>
            <span className="quantity-display">{quantity}</span>
            <button className="quantity-button" onClick={() => setQuantity(quantity + 1)}>
              +
            </button>
          </div>
        </div>

        <div className="modal-footer">
          <button className="add-to-cart-button" onClick={handleAddToCart}>
            Add to Cart - ₱ {unitPrice}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductModal
