export const calculateLineTotal = (price, options = {}) => {
  let totalModifier = 0
  const basePrice = parseFloat(price)
  const optionGroup = Object.values(options)

  for (let item = 0; item < optionGroup.length; item++) {
    const group = optionGroup[item]

    if (Array.isArray(group)) {
      for (let subItem = 0; subItem < group.length; subItem++) {
        totalModifier += parseFloat(group[subItem].price_modifier) ?? 0
      }
    } else {
      totalModifier += parseFloat(group.price_modifier) ?? 0
    }
  }

  return basePrice + totalModifier
}
