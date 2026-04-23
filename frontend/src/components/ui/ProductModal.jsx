import { useEffect, useState, useMemo, useCallback } from 'react'
import './ProductModal.css'
import OptionGroup from './OptionGroup'
import { buildDefaultSelections } from '@/utils/buildDefaultSelections'
import { calculateLineTotal } from '@/utils/calculateLineTotal'
import { useGetProductAttributes } from '@/hooks/useProductAttributeQuery'
import { useCart } from '@/utils/useCart'
import { generateProductKey } from '@/utils/generateProductKey'

const ProductModal = ({ product, onClose }) => {
  const { data: attributes, isLoading } = useGetProductAttributes(product?.id)

  const defaultOptions = useMemo(() => {
    if (!attributes) return {}
    return buildDefaultSelections(attributes)
  }, [attributes])

  const [quantity, setQuantity] = useState(1)
  const [selectedMenu, setSelectedMenu] = useState(defaultOptions)

  const { addToCart } = useCart()

  useEffect(() => {
    setSelectedMenu(defaultOptions)
  }, [defaultOptions])

  const basePrice = useMemo(() => {
    const price = product?.price
    if (!price) return 0
    return calculateLineTotal(price, selectedMenu)
  }, [product.price, selectedMenu])

  const lineTotal = useMemo(() => basePrice * quantity, [basePrice, quantity])

  const handleAddToCart = useCallback(async () => {
    if (!product?.id) return

    const cartItem = {
      options: selectedMenu,
      quantity,
      product_code: generateProductKey(product?.id, selectedMenu),
      unit_price: product.price,
      product_id: product?.id,
      product_name: product.name,
      product_image: product.image_url,
    }
    addToCart(cartItem)
    onClose()
  }, [product, selectedMenu, quantity, addToCart, onClose])

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
          {attributes.map((options, index) => {
            return (
              <OptionGroup
                attribute={options}
                key={index}
                selectedMenu={selectedMenu}
                setSelectedMenu={setSelectedMenu}
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
            Add to Cart - ₱ {lineTotal}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductModal
