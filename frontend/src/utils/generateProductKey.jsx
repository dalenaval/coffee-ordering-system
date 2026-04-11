export const generateProductKey = (productId, options = {}) => {
  const optionString = Object.values(options)
    .map((option) => option.id)
    .sort((a, b) => a - b)
    .join('-')
  return `${productId}_${optionString || 'base'}`
}
