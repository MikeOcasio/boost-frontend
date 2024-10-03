import { create } from "zustand";

// Helper function to update localStorage
const updateLocalStorage = (cartItems) => {
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
};

// Initialize cart from localStorage
const getInitialCart = () => {
  if (typeof window !== "undefined") {
    const storedCart = localStorage.getItem("cartItems");
    return storedCart ? JSON.parse(storedCart) : [];
  }
  return [];
};

export const useCartStore = create((set) => ({
  // Initialize cart from localStorage
  cartItems: getInitialCart(),

  // Add item to cart (only specific keys)
  addToCart: (product) =>
    set((state) => {
      const existingItem = state.cartItems.find(
        (item) => item.id === product.id
      );
      let updatedCart;
      if (existingItem) {
        // If item already exists, increase quantity
        updatedCart = state.cartItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new item with only the necessary keys
        const newItem = {
          id: product.id,
          name: product.name,
          quantity: 1,
          price: product.price,
          platform: product.platform,
          image_url: product.image_url,
        };
        updatedCart = [...state.cartItems, newItem];
      }
      // Update localStorage
      updateLocalStorage(updatedCart);
      return { cartItems: updatedCart };
    }),

  // Remove item from cart
  removeFromCart: (id) =>
    set((state) => {
      const updatedCart = state.cartItems.filter((item) => item.id !== id);
      // Update localStorage
      updateLocalStorage(updatedCart);
      return { cartItems: updatedCart };
    }),

  // Empty cart
  emptyCart: () => {
    updateLocalStorage([]);
    return { cartItems: [] };
  },

  // Increase item quantity
  increaseQuantity: (id) =>
    set((state) => {
      const updatedCart = state.cartItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      );
      // Update localStorage
      updateLocalStorage(updatedCart);
      return { cartItems: updatedCart };
    }),

  // Decrease item quantity
  decreaseQuantity: (id) =>
    set((state) => {
      const updatedCart = state.cartItems
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0); // Remove item if quantity is 0
      // Update localStorage
      updateLocalStorage(updatedCart);
      return { cartItems: updatedCart };
    }),
}));
