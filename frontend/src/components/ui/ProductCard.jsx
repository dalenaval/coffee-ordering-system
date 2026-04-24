import './ProductCard.css'

const fallbackImage =
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=600&auto=format&fit=crop'

const ProductCard = ({ product, onCustomize }) => {
  const imageUrl = product?.image_url || fallbackImage

  return (
    <div className="product-card">
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
        <h3 className="product-name">{product?.name}</h3>
        <p className="product-description">{product?.description}</p>

        <div className="product-footer">
          <span className="product-price">
            ₱ {Number(product?.price || 0).toFixed(2)}
          </span>

          <button
            className="customize-button"
            onClick={() => onCustomize(product)}
          >
            Customize
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
