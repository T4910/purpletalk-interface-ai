import { create } from "zustand"
import type { SortingState } from "@tanstack/react-table"

export type Property = {
  id: number
  location: string
  details_url: string
  image_url: string | null
  title: string
  description: string
  bedroom: number | null
  bathroom: number | null
  listing_time: string | null
  amenities: string[] | null
  property_type: string
  contact: string | null
  scraped_at: string
  price: string | null
  extra_data: {
    price: string | null
    title: string
    bedroom: number | null
    listing: string | null
    location: string
    amenities: string[] | null
    bathrooms: number | null
    image_url: string | null
    description: string
    details_url: string
    phonenumber: string | null
    property_type: string
  }
  initiator: string
}

interface TableState {
  // Search and filter
  globalFilter: string
  setGlobalFilter: (filter: string) => void

  // Sorting
  sorting: SortingState
  setSorting: (sorting: SortingState) => void

  // Pagination
  pageIndex: number
  pageSize: number
  setPageIndex: (index: number) => void
  setPageSize: (size: number) => void

  // Row selection
  selectedRowIds: Record<string, boolean>
  toggleRowSelection: (id: string) => void
  toggleAllRows: (ids: string[], selected: boolean) => void
  resetRowSelection: () => void

  // Row expansion
  expandedRowIds: Record<string, boolean>
  toggleRowExpansion: (id: string) => void

  // Derived data
  getSelectedRowIds: () => string[]
  getExpandedRowIds: () => string[]
}

export const useTableStore = create<TableState>((set, get) => ({
  // Search and filter
  globalFilter: "",
  setGlobalFilter: (filter) => set({ globalFilter: filter }),

  // Sorting
  sorting: [],
  setSorting: (sorting) => set({ sorting }),

  // Pagination
  pageIndex: 0,
  pageSize: 10,
  setPageIndex: (pageIndex) => set({ pageIndex }),
  setPageSize: (pageSize) => set({ pageSize, pageIndex: 0 }),

  // Row selection
  selectedRowIds: {},
  toggleRowSelection: (id) =>
    set((state) => {
      const newSelectedRowIds = { ...state.selectedRowIds }
      if (newSelectedRowIds[id]) {
        delete newSelectedRowIds[id]
      } else {
        newSelectedRowIds[id] = true
      }
      return { selectedRowIds: newSelectedRowIds }
    }),
  toggleAllRows: (ids, selected) =>
    set((state) => {
      const newSelectedRowIds = { ...state.selectedRowIds }
      ids.forEach((id) => {
        if (selected) {
          newSelectedRowIds[id] = true
        } else {
          delete newSelectedRowIds[id]
        }
      })
      return { selectedRowIds: newSelectedRowIds }
    }),
  resetRowSelection: () => set({ selectedRowIds: {} }),

  // Row expansion
  expandedRowIds: {},
  toggleRowExpansion: (id) =>
    set((state) => {
      const newExpandedRowIds = { ...state.expandedRowIds }
      if (newExpandedRowIds[id]) {
        delete newExpandedRowIds[id]
      } else {
        newExpandedRowIds[id] = true
      }
      return { expandedRowIds: newExpandedRowIds }
    }),

  // Derived data
  getSelectedRowIds: () => Object.keys(get().selectedRowIds),
  getExpandedRowIds: () => Object.keys(get().expandedRowIds),
}))
