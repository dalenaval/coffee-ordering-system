import { useAuthStore } from '@/store/useAuthStore'
import axios from 'axios'
import Swal from 'sweetalert2'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    const isLoginRequest = originalRequest.url.includes('/login')

    if (error.response?.status === 401 && !originalRequest._retry && !isLoginRequest) {
      originalRequest._retry = true

      const logout = useAuthStore.getState().logout

      await Swal.fire({
        icon: 'warning',
        title: 'Session Expired',
        text: 'Please login again',
        confirmButtonText: 'Ok',
      })

      logout()

      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
