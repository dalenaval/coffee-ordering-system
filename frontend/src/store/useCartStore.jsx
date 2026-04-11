import { calculateTotal } from '@/utils/calculateTotal'
import { generateProductKey } from '@/utils/generateProductKey'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const { product, customizations, quantity } = item
        console.log('quantity:', quantity)

        const productKey = generateProductKey(product?.id, customizations)
        const unitPrice = calculateTotal(product.price, customizations)
        const totalPrice = unitPrice * quantity

        set((state) => {
          const existingItemIndex = state.items.findIndex((cartItem) => cartItem.productKey === productKey)
          console.log('quantity1:', quantity)

          if (existingItemIndex !== -1) {
            console.log('quantity2:', quantity)

            const updatedItems = [...state.items]
            const existingItem = updatedItems[existingItemIndex]
            const newQuantity = existingItem?.quantity + quantity

            updatedItems[existingItemIndex] = {
              ...existingItem,
              quantity: newQuantity,
              unitPrice: unitPrice,
              totalPrice: totalPrice,
            }
            return { items: updatedItems }
          }
          const newItem = {
            ...item,
            productKey,
            unitPrice: unitPrice,
            totalPrice: totalPrice,
          }
          return { items: [...state.items, newItem] }
        })
      },

      updateQuantity: (productKey, quantity) => {
        const { items, removeCart } = get()
        if (quantity <= 0) return removeCart(productKey)

        set({
          items: items.map((item) =>
            item.productKey === productKey
              ? {
                  ...item,
                  quantity,
                  totalPrice: calculateTotal(item.product.price, item.customizations) * quantity,
                }
              : item
          ),
        })
      },

      getCartTotal: () => {
        return get().items.reduce((total, item) => total + item.totalPrice, 0)
      },

      removeCart: (productKey) => {
        const { items } = get()

        const updatedCart = items.filter((item) => item.productKey !== productKey)
        set({ items: updatedCart })
      },
      clearCart: () => {
        set({ items: [] })
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
)
