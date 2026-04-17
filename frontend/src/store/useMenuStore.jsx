import { create } from 'zustand'

export const useMenuStore = create((set) => ({
  user: {},

  setSelectedMenu: (product) => {
    set({ selectedMenu: product })
  },
}))
