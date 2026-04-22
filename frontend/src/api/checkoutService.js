import api from './axios'

export const checkout = async (payload) => {
  const response = await api.post('/orders/checkout', payload)
  return response?.data
}
