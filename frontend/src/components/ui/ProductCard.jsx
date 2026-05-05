import { toCapitalize } from '@/utils/toCapitalize'
import './ProductCard.css'

const fallbackImage = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=600&auto=format&fit=crop'

const ProductCard = ({ product, onClick }) => {
  const imageUrl = product?.image_url || fallbackImage

  return (
    <div className="product-card">
      {product?.stock === 0 && (
        <div className="product-overlay">
          <span className="out-of-stock-text">Out of Stock</span>
        </div>
      )}
      <div className="product-image">
        <img
          src={imageUrl}
          alt={product?.name || 'Product image'}
          onError={(e) => {
            e.currentTarget.src = fallbackImage
          }}
        />
      </div>

      <div className="product-info">
        <h3 className="product-name">{toCapitalize(product?.name)}</h3>
        <p className="product-description">{product?.description}</p>

        <div className="product-footer">
          <span className="product-price">₱ {Number(product?.price || 0).toFixed(2)}</span>

          <button className="customize-button" onClick={() => onClick(product)} disabled={product?.stock === 0}>
            {product?.has_options ? 'Customize' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
