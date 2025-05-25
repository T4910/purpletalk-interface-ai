import { create } from "zustand";
export interface Property {
    location: string;
    image_url: string;
    details_url: string;
    description: string;
    title: string;
    bedroom: string;
    bathrooms: string;
    price: string;
    listing: string;
}

interface PropertyState {
    properties: Property[];
    setProperties: (properties: Property[]) => void;
    clearProperties: () => void;
}

export const usePropertyStore = create<PropertyState>((set) => ({
    properties: [],
    setProperties: (properties) => set({ properties }),
    clearProperties: () => set({ properties: [] }),
}));
