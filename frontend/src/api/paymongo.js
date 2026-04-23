import { apiKey, apiPaymongoUrl } from '@/config/config'
import axios from 'axios'

// export const createPaymentMethod = async (payload) => {
//   const response = await api.post('/webhook/create-payment-method', payload)
//   return response.data
// }

// export const attachPayment = async (payment_intent_id, payment_method_id) => {
//   const response = await api.post('/webhook/attach-payment', {
//     intent_id: payment_intent_id,
//     payment_method_id: payment_method_id,
//   })
//   return response
// }

const api = axios.create({
  baseURL: apiPaymongoUrl,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Basic ${btoa(apiKey)}`,
  },
})

export const getPaymentMethodId = async (payment_method, payload) => {
  const paymentMethodResponse = await fetch('https://api.paymongo.com/v1/payment_methods', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${btoa('apiKey')}`,
    },
    body: JSON.stringify({
      data: {
        attributes: {
          type: payment_method,
          billing: payload,
        },
      },
    }),
  })
  const pmData = await paymentMethodResponse.json()
  return pmData.data.idd
}

export const paymongoClient = async (payload) => {
  const response = await api.post('/payment_methods', {
    data: {
      attributes: {
        type: payload.payment_method,
        details: {
          card_number: payload?.card_number ?? '',
          exp_month: payload?.exp_month ?? '',
          exp_year: payload?.exp_year ?? '',
          cvc: payload?.cvc ?? '',
        },
        billing: {
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
        },
      },
    },
  })

  return response.data
}
