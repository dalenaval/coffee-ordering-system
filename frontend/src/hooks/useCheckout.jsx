import { checkout } from '@/api/checkoutService'
import { attachPayment, createPaymentMethod } from '@/api/paymongo'
import { useErrorStore } from '@/store/useErrorStore'
import { useOrderStore } from '@/store/useOrderStore'
import { useMutation } from '@tanstack/react-query'

export const useCheckout = () => {
  return useMutation({
    mutationFn: checkout,
    mutationKey: ['payment_process'],
    onSuccess: async (response) => {
      if (response.data.payment_intent_id) {
        handlePayMongo(response.data)
      } else {
        // showReceipt(res.data.order_id)
        useOrderStore.getState().setOrderId(response.data.order_id)
      }
    },
    onError: (error) => {
      useErrorStore.getState().setError(error?.response?.data || 'Something Went Wrong !')
    },
  })
}

const handlePayMongo = async ({ payment_intent_id, type }) => {
  const payment_method = await createPaymentMethod(type)

  await attachPayment(payment_intent_id, payment_method.id)
}
