import "./ProductCard.css";

const ProductCard = ({ product, onCustomize }) => {
  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product?.image_url} alt={product?.name} />
      </div>
      <div className="product-info">
        <h3 className="product-name">{product?.name}</h3>
        <p className="product-description">{product?.description}</p>
        <div className="product-footer">
          <span className="product-price">
            ₱ {parseFloat(product?.price).toFixed(2)}
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
  );
};

export default ProductCard;
