import { getUserCart } from '@/api/cartService'
import { getCurrentUser, getUsers, loginUser } from '@/api/userService'
import { useAuth } from '@/store/useAuthStore'
import { cartStore } from '@/store/useCartStore'
import { loginRedirect } from '@/utils/loginRedirect'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

export const useGetUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: getUsers,
  })
}

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: ['me'],
    queryFn: getCurrentUser,
  })
}

export const useAuthLogin = () => {
  const queryClient = useQueryClient()
  const { user, setUserData, setAuthToken } = useAuth()
  const clearCart = cartStore((state) => state.clearCart)
  const navigation = useNavigate()

  return useMutation({
    mutationFn: loginUser,
    onSuccess: async (response) => {
      const token = response?.access_token

      clearCart()
      setAuthToken(token)

      if (!token) {
        throw new Error('Unauthorized, invalid token')
      }
      await Promise.all([
        queryClient.prefetchQuery({
          queryKey: ['me'],
          queryFn: getCurrentUser,
        }),
        queryClient.prefetchQuery({
          queryKey: ['user_cart'],
          queryFn: getUserCart,
        }),
      ])

      setUserData(queryClient.getQueryData(['me']))

      if (!user && user.length === 0) {
        throw new Error('Failed to fetch user')
      }

      loginRedirect(user?.role, navigation)
    },
    onError: (error) => {
      if (error?.response?.status === 401) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error?.response?.data?.detail,
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Login Failed',
        })
      }
    },
  })
}
