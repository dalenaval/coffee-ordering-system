import { addToCart, getUserCart, removeCartItem, updateQuantity } from '@/api/cartService'
import { useErrorStore } from '@/store/useErrorStore'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Swal from 'sweetalert2'

export const useGetUserCart = (isAuthenticated) => {
  return useQuery({
    queryKey: ['user_cart'],
    queryFn: getUserCart,
    enabled: isAuthenticated,
    retry: (failureCount, error) => {
      if (error?.response?.status === 401) return false
      return failureCount < 3
    },
  })
}

export const useAddToCart = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload) => addToCart(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_cart'] })
    },
    onError: (error) => {
      useErrorStore.getState().setError(error?.response?.data || 'Something Went Wrong !')
    },
  })
}

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: removeCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_cart'] })
    },
    onError: (error) => {
      useErrorStore.getState().setError(error?.response?.data || 'Something Went Wrong !')
    },
  })
}

export const useUpdateQuantity = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ cart_item_id, quantity }) => updateQuantity(cart_item_id, { quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_cart'] })
    },
    onError: (error) => {
      useErrorStore.getState().setError(error?.response?.data || 'Something Went Wrong !')
    },
  })
}
