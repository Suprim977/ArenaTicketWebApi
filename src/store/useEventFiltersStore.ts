import { create } from "zustand";

type EventFiltersState = {
  query: string;
  category: string;
  setQuery: (query: string) => void;
  setCategory: (category: string) => void;
  reset: () => void;
};

export const useEventFiltersStore = create<EventFiltersState>((set) => ({
  query: "",
  category: "all",
  setQuery: (query) => set({ query }),
  setCategory: (category) => set({ category }),
  reset: () => set({ query: "", category: "all" }),
}));
