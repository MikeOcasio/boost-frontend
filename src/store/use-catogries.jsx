import { create } from "zustand";

const useCategoriesStore = create((set) => ({
  categories: [],
  selectedCategory: null,
  isLoading: false,
  error: false,

  // Set categories
  setCategories: (categories) => set({ categories }),

  // Select a category
  selectCategory: (category) => set({ selectedCategory: category }),

  // Set loading state
  setLoading: (isLoading) => set({ isLoading }),

  // Set error state
  setError: (error) => set({ error }),

  // Reset store
  reset: () =>
    set({
      categories: [],
      selectedCategory: null,
      isLoading: false,
      error: false,
    }),
}));

export default useCategoriesStore;
