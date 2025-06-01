import { create } from "zustand"
import type { Property } from "./table-store"

interface ModalState {
  // Modal visibility
  isOpen: boolean
  openModal: () => void
  closeModal: () => void

  // Selected property
  selectedProperty: Property | null
  setSelectedProperty: (property: Property | null) => void

  // Modal actions
  isRefreshing: boolean
  setIsRefreshing: (isRefreshing: boolean) => void

  // Combined actions
  openPropertyModal: (property: Property) => void

  // Scrape history (mock data)
  scrapeHistory: string[]
}

export const useModalStore = create<ModalState>((set) => ({
  // Modal visibility
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false, selectedProperty: null }),

  // Selected property
  selectedProperty: null,
  setSelectedProperty: (property) => set({ selectedProperty: property }),

  // Modal actions
  isRefreshing: false,
  setIsRefreshing: (isRefreshing) => set({ isRefreshing }),

  // Combined actions
  openPropertyModal: (property) => set({ selectedProperty: property, isOpen: true }),

  // Scrape history (mock data)
  scrapeHistory: ["2025-05-30 21:39", "2025-05-29 18:22", "2025-05-28 12:15", "2025-05-27 09:30", "2025-05-26 15:45"],
}))
