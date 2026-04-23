import { calculateLineTotal } from '@/utils/calculateLineTotal'
import { computeCartTotal } from '@/utils/computeCartTotal'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useShallow } from 'zustand/shallow'

export const cartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],
      cartTotal: 0,

      addItem: (item) => {
        const { productCode, options, quantity } = item

        const optionTotal = calculateLineTotal(0, options)
        const basePrice = calculateLineTotal(item.unit_price, options)
        const lineTotal = basePrice * quantity

        set((state) => {
          const existingItemIndex = state.cartItems.findIndex((cartItem) => cartItem.product_code === productCode)

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
            base_price: basePrice,
            option_total: optionTotal,
            line_total: lineTotal,
          }
          const updatedCart = [...state.cartItems, newItem]
          return { cartItems: updatedCart, cartTotal: computeCartTotal(updatedCart) }
        })
      },

      updateQuantity: (productCode, quantity) => {
        if (quantity <= 0) return get().removeCart(productCode)

        set((state) => {
          const findCartIndex = state.cartItems.findIndex((cartItem) => cartItem.product_code === productCode)
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

      removeCart: (productCode) => {
        const updatedCart = get().cartItems.filter((item) => item.product_code !== productCode)
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
