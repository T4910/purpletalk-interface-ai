
import { create } from 'zustand';

type PropertiesPanelStore = {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

export const usePropertiesPanel = create<PropertiesPanelStore>((set) => ({
  isOpen: false,
  setOpen: (isOpen: boolean) => set({ isOpen }),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));
