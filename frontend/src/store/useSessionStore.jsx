import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useSessionStore = create(
  persist(
    (set, get) => ({
      guestSessionId: null,

      initializeSession: (isLoggedIn) => {
        if (isLoggedIn) {
          get().clearSession()
          return
        }

        if (!get().guestSessionId) set({ guestSessionId: crypto.randomUUID() })
      },

      clearSession: () => {
        set({ guestSessionId: null })
      },
    }),
    {
      name: 'guest-auth-session',
      partialize: (state) => ({
        guestSessionId: state.guestSessionId,
      }),
    }
  )
)
