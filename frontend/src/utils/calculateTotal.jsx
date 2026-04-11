export const calculateTotal = (price, options = {}) => {
  const totalPrice = Object.values(options).reduce((sum, current) => sum + (parseFloat(current.price_modifier) || 0), 0)
  return parseFloat(price) + totalPrice
}
