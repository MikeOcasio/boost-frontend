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

// Helper function to calculate total price
const calculateTotalPrice = (cartItems) => {
  const totalPrice = cartItems
    .reduce(
      (total, item) =>
        total +
        (item.is_dropdown
          ? item.dropdown_options.reduce((acc, curr) => acc + curr.price, 0)
          : item.is_slider
          ? item.slider_range.reduce((acc, curr) => acc + curr.price, 0)
          : item.price * item.quantity),
      0
    )
    .toFixed(2);

  localStorage.setItem("totalPrice", totalPrice);

  return totalPrice;
};

// get total price from localStorage
const getTotalPrice = () => {
  if (typeof window !== "undefined") {
    const storedTotalPrice = localStorage.getItem("totalPrice");
    return storedTotalPrice ? parseFloat(storedTotalPrice) : 0;
  }
  return 0;
};

export const useCartStore = create((set) => ({
  totalPrice: getTotalPrice(),
  setTotalPrice: (totalPrice) => set({ totalPrice }),

  cartItems: getInitialCart(),

  // set cart items
  setCartItems: (cartItems) => set({ cartItems }),

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
          image: product.image,
          is_active: product.is_active,
          tax: product.tax,
          category_id: product.category_id,
          prod_attr_cats: product.prod_attr_cats,
          dropdown_options: product.dropdown_options,
          starting_point: product.starting_point,
          ending_point: product.ending_point,
          is_dropdown: product.is_dropdown,
          is_slider: product.is_slider,
          slider_range: product.slider_range,
        };
        updatedCart = [...state.cartItems, newItem];
      }

      // Update localStorage and total price
      updateLocalStorage(updatedCart);
      const newTotalPrice = calculateTotalPrice(updatedCart);
      return { cartItems: updatedCart, totalPrice: newTotalPrice };
    }),

  // Remove item from cart
  removeFromCart: (id) =>
    set((state) => {
      const updatedCart = state.cartItems.filter((item) => item.id !== id);
      // Update localStorage and total price
      updateLocalStorage(updatedCart);
      const newTotalPrice = calculateTotalPrice(updatedCart);
      return { cartItems: updatedCart, totalPrice: newTotalPrice };
    }),

  // Empty cart
  emptyCart: () => {
    updateLocalStorage([]);
    return { cartItems: [], totalPrice: 0 };
  },

  // Increase item quantity
  increaseQuantity: (id) =>
    set((state) => {
      const updatedCart = state.cartItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      );
      // Update localStorage and total price
      updateLocalStorage(updatedCart);
      const newTotalPrice = calculateTotalPrice(updatedCart);
      return { cartItems: updatedCart, totalPrice: newTotalPrice };
    }),

  // Decrease item quantity
  decreaseQuantity: (id) =>
    set((state) => {
      const updatedCart = state.cartItems
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0); // Remove item if quantity is 0
      // Update localStorage and total price
      updateLocalStorage(updatedCart);
      const newTotalPrice = calculateTotalPrice(updatedCart);
      return { cartItems: updatedCart, totalPrice: newTotalPrice };
    }),
}));
