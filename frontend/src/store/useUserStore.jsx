import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useUserStore = create(
  persist((set) => ({
    user: [],

    setUserData: (user) => {
      set({ user: user })
    },

    clearUserData: () => {
      set({ user: [] })
    },
  }))
)
