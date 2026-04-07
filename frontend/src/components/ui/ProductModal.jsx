import { useEffect, useState } from "react";
import "./ProductModal.css";
import OptionGroup from "./OptionGroup";
import { useGetProductAttributes } from "@/hooks/useGetProductAttributes";
import useGetDefaultAttributes from "@/hooks/useGetDefaultAttributes";

const ProductModal = ({ product, onAddToCart, onClose }) => {
  const { data: attributes, isLoading } = useGetProductAttributes(product?.id);

  console.log(attributes);
  const [selectedOptions, setSelectedOptions] = useState({});

  useEffect(() => {
    if (attributes) {
      const initialDefault = useGetDefaultAttributes(attributes);

      setSelectedOptions(initialDefault);
    }
  }, [attributes]);
  console.log("initial ", selectedOptions);
  const [quantity, setQuantity] = useState(1);

  const calculateTotal = () => {
    let total = parseFloat(product.price);

    Object.entries(selectedOptions).forEach(([type, value]) => {
      if (type === "extras" && Array.isArray(value)) {
        value.forEach((extra) => {
          total += parseFloat(extra.price_modifier || 0);
        });
      } else if (value && value.price_modifier) {
        total += parseFloat(value.price_modifier);
      }
    });

    return (total * quantity).toFixed(2);
  };

  const handleAddToCart = () => {
    const customizationsList = [];

    Object.entries(selectedOptions).forEach(([type, value]) => {
      if (type === "extras" && Array.isArray(value)) {
        value.forEach((extra) => customizationsList.push(extra));
      } else if (value) {
        customizationsList.push(value);
      }
    });

    const cartItem = {
      product,
      customizations: customizationsList,
      quantity,
      totalPrice: parseFloat(calculateTotal()),
    };

    onAddToCart(cartItem);
    onClose();
  };

  if (isLoading) {
    return <div className="loading"> Loading ....</div>;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-close" onClick={onClose}>
          x
        </div>
        <div className="modal-header">
          <img
            src={product.image_url}
            alt={product.name}
            className="modal-product-image"
          />
          <div>
            <h2>{product.name}</h2>
            <p className="modal-description">{product.description}</p>
            <p className="modal-base-price">
              Base price: ₱ {parseFloat(product.price).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="customization-sections">
          {attributes?.option_group?.map((options, index) => {
            return (
              <OptionGroup
                attribute={options}
                key={index}
                selectedOptions={selectedOptions}
                setSelectedOptions={setSelectedOptions}
              />
            );
          })}
        </div>
        <div className="quantity-section">
          <h3>Quantity</h3>
          <div className="quantity-controls">
            <button
              className="quantity-button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              -
            </button>
            <span className="quantity-display">{quantity}</span>
            <button
              className="quantity-button"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </button>
          </div>
        </div>

        <div className="modal-footer">
          <button className="add-to-cart-button" onClick={handleAddToCart}>
            Add to Cart - ₱ {calculateTotal()}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
