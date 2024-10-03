import { create } from "zustand";
import { getUserToken, logoutSession } from "@/lib/actions";

export const useUserStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),

  // Function to get user token from cookies
  getUserToken: async () => {
    const token = await getUserToken();

    if (token?.value) {
      set({ user: token.value });
    } else {
      set({ user: null });
    }
  },
}));
