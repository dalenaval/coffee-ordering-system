import { Bike, ShoppingBag, Utensils } from "lucide-react";
import "./OrderTypeSelector.css";

const OrderTypeSelector = ({ selectedType, onSelectType }) => {
  const orderTypes = [
    {
      id: "dine-in",
      name: "Dine In",
      icon: <Utensils />,
      description: "Enjoy your order at our cafe",
    },
    {
      id: "takeout",
      name: "Takeout",
      icon: <ShoppingBag />,
      description: "Pick up your order to go",
    },
    {
      id: "delivery",
      name: "Delivery",
      icon: <Bike />,
      description: "Get your order delivered",
    },
  ];

  return (
    <div className="order-type-selector">
      <h3>Choose Order Type</h3>
      <div className="order-type-options">
        {orderTypes.map((type) => (
          <button
            key={type.id}
            className={`order-type-option ${selectedType === type.id ? "selected" : ""}`}
            onClick={() => onSelectType(type.id)}
          >
            <span className="order-type-icon">{type.icon}</span>
            <span className="order-type-name">{type.name}</span>
            <span className="order-type-description">{type.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default OrderTypeSelector;
