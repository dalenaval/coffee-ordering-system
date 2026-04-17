import './OptionItems.css'

const OptionItems = ({ item, isSelected, onClick }) => {
  return (
    <button key={item?.id} className={`option-btn ${isSelected ? 'selected' : ''} `} onClick={() => onClick(item)}>
      <span className="option-name">{item?.name}</span>
      {parseFloat(item?.price_modifier) !== 0 && (
        <span className="option-price">₱ {parseFloat(item?.price_modifier)}</span>
      )}
    </button>
  )
}

export default OptionItems
