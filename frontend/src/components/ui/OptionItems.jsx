import useEmptyDataChecker from "@/hooks/useEmptyDataChecker";
import "./OptionItems.css";

const OptionItems = ({ item, isSelected, onClick }) => {
  return (
    <button
      key={item?.id}
      className={`option-btn ${isSelected ? "selected" : ""} `}
      onClick={() => onClick(item)}
    >
      <span className="option-name">{item?.name}</span>
      {!useEmptyDataChecker(parseFloat(item?.price_modifier)) && (
        <span className="option-price">
          +₱ {parseFloat(item?.price_modifier).toFixed(2)}`
        </span>
      )}
    </button>
  );
};

export default OptionItems;
