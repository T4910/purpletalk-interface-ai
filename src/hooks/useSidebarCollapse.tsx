
import { create } from 'zustand';

type SidebarCollapseStore = {
  isCollapsed: boolean;
  collapse: () => void;
  expand: () => void;
  toggle: () => void;
};

export const useSidebarCollapse = create<SidebarCollapseStore>((set) => ({
  isCollapsed: false,
  collapse: () => set({ isCollapsed: true }),
  expand: () => set({ isCollapsed: false }),
  toggle: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
}));
