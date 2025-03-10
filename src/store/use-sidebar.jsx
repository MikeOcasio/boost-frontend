import { create } from "zustand";

const useSidebarStore = create((set) => ({
  isExpanded: true,
  isMobileOpen: false,
  isMobile: false,
  isHovered: false,
  activeItem: null,
  openSubmenu: null,

  toggleSidebar: () => set((state) => ({ isExpanded: !state.isExpanded })),

  toggleMobileSidebar: () =>
    set((state) => ({ isMobileOpen: !state.isMobileOpen })),

  setIsHovered: (isHovered) => set({ isHovered }),

  setActiveItem: (activeItem) => set({ activeItem }),

  toggleSubmenu: (item) =>
    set((state) => ({
      openSubmenu: state.openSubmenu === item ? null : item,
    })),

  // Initialize mobile detection
  initializeMobileDetection: () => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      set({
        isMobile: mobile,
        isMobileOpen: mobile ? false : false,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  },
}));

export default useSidebarStore;
