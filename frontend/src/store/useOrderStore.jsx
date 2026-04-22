import { create } from 'zustand'

export const useOrderStore = create(
  (set) => ({
    orderId: '',

    setOrderId: (orderId) => {
      set({ orderId: orderId })
    },
  }),
  {
    name: 'order-storage',
  }
)
