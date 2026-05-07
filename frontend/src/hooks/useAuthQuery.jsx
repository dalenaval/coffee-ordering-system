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
  const { setUserData, setAuthToken } = useAuth()
  const clearCart = cartStore((state) => state.clearCart)
  const navigation = useNavigate()

  return useMutation({
    mutationFn: loginUser,
    onSuccess: async (response) => {
      try {
        const token = response?.access_token

        clearCart()

        if (!token) {
          throw new Error('Failed to get token')
        }

        queryClient.clear()

        setAuthToken(token) // Set token in auth store for global access

        const me = await queryClient.fetchQuery({
          queryKey: ['me'],
          queryFn: getCurrentUser,
        })

        if (!me) {
          throw new Error('Failed to fetch current user')
        }

        setUserData(me) // Set user data in auth store

        if (me?.role === 'customer') {
          // Only fetch cart if user is a customer
          await queryClient.prefetchQuery({
            queryKey: ['user_cart'],
            queryFn: getUserCart,
          })
        }

        loginRedirect(me?.role, navigation) // Redirect based on role
      } catch (error) {
        console.error('Login initialization failed:', error?.response?.data || error.message)
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Login succeeded but failed to initialize session.',
        })
      }
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
