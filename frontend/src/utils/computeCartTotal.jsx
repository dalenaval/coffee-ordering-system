export const computeCartTotal = (cart) => cart.reduce((total, item) => total + parseFloat(item?.line_total), 0)
