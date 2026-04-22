import api from './axios'

export const createPaymentMethod = async (payload) => {
  const response = await api.post('/create-payment-method', payload)
  return response.data
}

export const attachPayment = async (payment_intent_id, payment_method_id) => {
  const response = await api.post('/attach-payment', {
    intent_id: payment_intent_id,
    payment_method_id: payment_method_id,
  })
  return response
}
