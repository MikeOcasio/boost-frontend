import { create } from "zustand";

export const useUserStore = create((set) => ({
  user: null,
  userToken:
    typeof window !== "undefined" ? localStorage.getItem("jwtToken") : null,

  setUserToken: (token) => {
    if (token) {
      localStorage.setItem("jwtToken", token);
    } else {
      localStorage.removeItem("jwtToken");
    }
    set({ userToken: token });
  },

  setUser: (user) => set({ user }),

  removeToken: () => {
    localStorage.removeItem("jwtToken");
    set({ userToken: null });
    set({ user: null });
  },
}));
