import { create } from 'zustand'

export const usePaymentStore = create(
  (set) => ({
    qr_image: '',

    setQR: (qr_url) => {
      set({ qr_image: qr_url })
    },
  }),
  {
    name: 'payment-storage',
  }
)
