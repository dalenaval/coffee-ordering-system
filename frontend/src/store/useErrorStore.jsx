import { create } from 'zustand'

export const useErrorStore = create(
  (set) => ({
    error: null,

    setError: (errorMessage) => set({ error: errorMessage }),

    clearError: () => set({ error: null }),
  }),
  {
    name: 'error-storage',
  }
)
