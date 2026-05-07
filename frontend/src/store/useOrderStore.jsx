import { create } from 'zustand'

export const useOrderStore = create(
  (set) => ({
    orderId: '',
    isCheckOutOpen: false,

    setOrderId: (orderId) => {
      set({ orderId: orderId })
    },
    setIsCheckOutOpen: (isCheckOutOpen) => {
      set({ isCheckOutOpen: isCheckOutOpen })
    },
  }),
  {
    name: 'order-storage',
  }
)
