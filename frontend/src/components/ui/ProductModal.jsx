import { useEffect, useState } from "react";
import optionsData from "@/data/optionsData";
import "./ProductModal.css";

const ProductModal = ({ onClose, product, onAddToCart }) => {
  const [selectedOptions, setSelectedOptions] = useState({
    size: "Medium",
    shots: "Single",
    milk: "Whole",
    sugar: "Regular",
    extras: [],
  });
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const setDefaultOptions = () => {
      const defaults = {};
      optionsData.forEach((option) => {
        if (option.type === "size" && option.name.includes("Medium")) {
          defaults.size = option;
        } else if (option.type === "shots" && option.name.includes("Single")) {
          defaults.shots = option;
        } else if (option.type === "milk" && option.name.includes("Whole")) {
          defaults.milk = option;
        } else if (option.type === "sugar" && option.name.includes("Regular")) {
          defaults.sugar = option;
        }
      });
      setSelectedOptions((prev) => ({ ...prev, ...defaults }));
    };
    setDefaultOptions();
  }, []);

  const handleOptionSelect = (type, option) => {
    if (type === "extras") {
      setSelectedOptions((prev) => {
        const currentExtras = prev.extras || [];
        const isSelected = currentExtras.some((e) => e.id === option.id);
        return {
          ...prev,
          extras: isSelected
            ? currentExtras.filter((e) => e.id !== option.id)
            : [...currentExtras, option],
        };
      });
    } else {
      setSelectedOptions((prev) => ({
        ...prev,
        [type]: option,
      }));
    }
  };

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

  const groupedCustomizations = optionsData.reduce((acc, option) => {
    if (!acc[option.type]) {
      acc[option.type] = [];
    }
    acc[option.type].push(option);
    return acc;
  }, {});
  console.log("groupedCustomizations:", groupedCustomizations);
  console.log("selectedOptions:", selectedOptions);

  const categoryLabels = {
    size: "Size",
    shots: "Espresso Shots",
    milk: "Milk Options",
    sugar: "Sugar Level",
    extras: "Add Extras",
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
          {Object.entries(groupedCustomizations).map(([type, options]) => {
            return (
              <div key={type} className="customization-section">
                <h3>{categoryLabels[type] || type}</h3>
                <div
                  className={
                    type === "extras" ? "options-grid" : "options-list"
                  }
                >
                  {options.map((option) => {
                    const isSelected =
                      type === "extras"
                        ? selectedOptions.extras?.some(
                            (e) => e.id === option.id
                          )
                        : selectedOptions[type]?.id === option.id;

                    return (
                      <button
                        key={option.id}
                        className={`option-button ${isSelected ? "selected" : ""}`}
                        onClick={() => handleOptionSelect(type, option)}
                      >
                        <span className="option-name">{option.name}</span>
                        {parseFloat(option.price_modifier) !== 0 && (
                          <span className="option-price">
                            {parseFloat(option.price_modifier) > 0 ? "+" : ""}₱
                            {parseFloat(option.price_modifier).toFixed(2)}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
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
