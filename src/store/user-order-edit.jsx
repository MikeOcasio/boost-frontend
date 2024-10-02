import { create } from "zustand";

export const useCartStore = create((set) => ({
  cartItems: [],
  setCartItems: (cartItems) => set({ cartItems }),
}));
