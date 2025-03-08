import { create } from "zustand";

export const useUserStore = create((set) => ({
  user: null,
  userToken:
    typeof window !== "undefined" ? localStorage.getItem("jwtToken") : null,

  maintenanceToken:
    typeof window !== "undefined"
      ? localStorage.getItem("maintenanceToken")
      : null,

  setMaintenanceToken: (token) => {
    if (token) {
      localStorage.setItem("maintenanceToken", token);
    }
    set({ maintenanceToken: token });
  },

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
    localStorage.removeItem("maintenanceToken");
    set({ userToken: null });
    set({ user: null });
    set({ maintenanceToken: null });
  },
}));
