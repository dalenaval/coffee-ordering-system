import { useGetUserCart, useAddToCart, useRemoveCartItem, useUpdateQuantity } from '@/hooks/useCartQuery'
import { useAuth } from '@/store/useAuthStore'
import { useCartStore } from '@/store/useCartStore'

export const useCart = () => {
  const { isAuthenticated } = useAuth()

  const { cartItems, cartTotal, addItem, clearCart, removeCart, updateQuantity } = useCartStore()

  const addItemMutation = useAddToCart()

  const removeItemMutation = useRemoveCartItem()

  const updateItemMutation = useUpdateQuantity()

  const { data, isLoading } = useGetUserCart(isAuthenticated)

  const addToCart = (item) => {
    if (isAuthenticated) {
      return addItemMutation.mutate(item)
    } else {
      addItem(item)
    }
  }

  const removeItem = (item) => {
    if (isAuthenticated) {
      return removeItemMutation.mutate(item.cart_item_id)
    } else {
      removeCart(item?.product_id)
    }
  }

  const updateItemQuantity = (item, quantity) => {
    if (isAuthenticated) {
      return updateItemMutation.mutate({
        cart_item_id: item.cart_item_id,
        quantity,
      })
    } else {
      updateQuantity(item?.product_id, quantity)
    }
  }

  return {
    cart: isAuthenticated ? (data?.items ?? []) : cartItems,
    total: isAuthenticated ? data?.total_price : cartTotal,
    addToCart,
    removeItem,
    updateItemQuantity,
    clearCart: isAuthenticated ? clearCart : clearCart,
    loading: isLoading,
  }
}
