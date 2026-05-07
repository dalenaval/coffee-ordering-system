import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useShallow } from 'zustand/shallow'

export const useAuthStore = create(
  persist(
    (set) => ({
      accessToken: null,
      isAuthenticated: false,
      user: {},

      setAuthToken: (token) => {
        set({ accessToken: token, isAuthenticated: true })
      },

      setUserData: (user) => {
        set({ user })
      },

      logout: () => {
        set({ accessToken: null, isAuthenticated: false, user: {} })
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)

export const useAuth = () => {
  return useAuthStore(
    useShallow((state) => ({
      user: state.user,
      isAuthenticated: state.isAuthenticated,
      accessToken: state.accessToken,
      setUserData: state.setUserData,
      setAuthToken: state.setAuthToken,
      logout: state.logout,
    }))
  )
}
