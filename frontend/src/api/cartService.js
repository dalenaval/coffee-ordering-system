import api from './axios'

export const addToCart = async (payload) => {
  const response = await api.post('/cart/add-to-cart', payload)
  return response.data
}
export const removeCartItem = async (cart_item_id) => {
  const response = await api.delete(`/cart/${cart_item_id}`)
  return response.data
}

export const getUserCart = async () => {
  const response = await api.get('/cart/my-cart')
  return response.data
}

export const updateQuantity = async (cart_item_id, payload) => {
  const response = await api.patch(`cart/${cart_item_id}/quantity`, payload)
  return response.data
}
