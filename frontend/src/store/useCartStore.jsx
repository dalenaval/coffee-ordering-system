import { calculateLineTotal } from '@/utils/calculateLineTotal'
import { computeCartTotal } from '@/utils/computeCartTotal'
import { generateProductKey } from '@/utils/generateProductKey'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useShallow } from 'zustand/shallow'

export const cartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],
      cartTotal: 0,

      addItem: (item) => {
        const { product_id, options, quantity } = item

        const productKey = generateProductKey(product_id, options)
        const basePrice = calculateLineTotal(item.unit_price, options)
        const lineTotal = basePrice * quantity

        set((state) => {
          const existingItemIndex = state.cartItems.findIndex((cartItem) => cartItem.product_id === productKey)

          if (existingItemIndex !== -1) {
            const updatedItems = [...state.cartItems]
            const existingItem = updatedItems[existingItemIndex]
            const newQuantity = existingItem?.quantity + quantity
            const newLineTotal = existingItem.line_total * quantity

            updatedItems[existingItemIndex] = {
              ...existingItem,
              quantity: newQuantity,
              line_total: newLineTotal,
            }
            return { cartItems: updatedItems, cartTotal: computeCartTotal(updatedItems) }
          }

          const newItem = {
            ...item,
            product_id: productKey,
            base_price: basePrice,
            line_total: lineTotal,
          }
          const updatedCart = [...state.cartItems, newItem]
          return { cartItems: updatedCart, cartTotal: computeCartTotal(updatedCart) }
        })
      },

      updateQuantity: (product_id, quantity) => {
        if (quantity <= 0) return get().removeCart(product_id)

        set((state) => {
          const findCartIndex = state.cartItems.findIndex((cartItem) => cartItem.product_id === product_id)
          console.log('findCartIndex', findCartIndex)
          if (findCartIndex === -1) return { cartItems: state.cartItems }

          const newCart = [...state.cartItems]
          const updatedCart = newCart[findCartIndex]

          newCart[findCartIndex] = {
            ...updatedCart,
            quantity,
            line_total: calculateLineTotal(updatedCart.base_price, updatedCart.options) * quantity,
          }

          return { cartItems: newCart, cartTotal: computeCartTotal(newCart) }
        })
      },

      removeCart: (product_id) => {
        const updatedCart = get().cartItems.filter((item) => item.product_id !== product_id)
        set({ cartItems: updatedCart, cartTotal: computeCartTotal(updatedCart) })
      },
      clearCart: () => {
        set({ cartItems: [], cartTotal: 0 })
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        cartItems: state.cartItems,
      }),
    }
  )
)

export const useCartStore = () => {
  return cartStore(
    useShallow((state) => ({
      cartItems: state.cartItems,
      cartTotal: state.cartTotal,
      addItem: state.addItem,
      updateQuantity: state.updateQuantity,
      getCartTotal: state.getCartTotal,
      removeCart: state.removeCart,
      clearCart: state.clearCart,
    }))
  )
}
