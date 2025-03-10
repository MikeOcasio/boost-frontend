import useSidebarStore from "@/store/use-sidebar";

const Backdrop = () => {
  const { isMobileOpen, toggleMobileSidebar } = useSidebarStore();

  if (!isMobileOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 bg-gray-900 bg-opacity-50 lg:hidden"
      onClick={toggleMobileSidebar}
    />
  );
};

export default Backdrop;
