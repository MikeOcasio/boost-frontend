import {
  Popover,
  PopoverBackdrop,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";
import Link from "next/link";
import { BiCross, BiLoader, BiPowerOff } from "react-icons/bi";
import { IoMenu } from "react-icons/io5";

import { CartButton } from "../CartButton";
import HeaderSearchHome from "../header-search-home";

function MobileNavItem({ href, children }) {
  return (
    <li>
      <PopoverButton as={Link} href={href} className="block py-2 text-white">
        {children}
      </PopoverButton>
    </li>
  );
}

export const MobileNavigation = ({
  resources,
  handleLogout,
  userToken,
  loading,
}) => {
  return (
    <Popover>
      <div className="flex items-center justify-between gap-4">
        {/* search input tab */}
        <HeaderSearchHome />

        <PopoverButton>
          <IoMenu className="h-8 w-8" />
        </PopoverButton>
      </div>

      <PopoverBackdrop
        transition
        className="fixed h-[110vh] top-0 inset-0 bg-black/50 backdrop-blur-sm"
      />

      <PopoverPanel
        focus
        transition
        className="fixed inset-x-4 top-20 z-50 origin-top rounded-xl p-4 ring-1 ring-zinc-900/5 bg-zinc-900 ring-zinc-800 overflow-y-auto transition duration-200 ease-in-out [--anchor-gap:var(--spacing-5)] data-[closed]:-translate-y-1 data-[closed]:opacity-0"
      >
        <div className="flex flex-row-reverse flex-wrap items-center justify-between">
          <PopoverButton aria-label="Close menu" className="p-1 ml-auto">
            <BiCross className="h-6 w-6 text-zinc-500 rotate-45" />
          </PopoverButton>

          <h3 className="text-lg font-semibold">Menu</h3>
        </div>

        <nav className="overflow-y-auto max-h-[80vh] no-scrollbar text-white">
          <ul className="divide-y divide-zinc-100 text-base text-zinc-800">
            {resources.map((item) => (
              <MobileNavItem key={item.name} href={item.href}>
                <div className="group relative flex flex-wrap items-center gap-x-6 rounded-lg p-2 hover:bg-yellow-600/30">
                  <div className="bg-inherit mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-semibold">{item.name}</p>
                  </div>
                </div>
              </MobileNavItem>
            ))}

            {userToken && (
              <button
                onClick={handleLogout}
                disabled={loading}
                className="w-full group relative flex flex-wrap items-center gap-x-6 p-2 hover:bg-yellow-600/30"
              >
                <div className="bg-inherit mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg">
                  {loading ? (
                    <BiLoader className="h-6 w-6 text-white animate-spin" />
                  ) : (
                    <BiPowerOff className="h-6 w-6 text-white" />
                  )}
                </div>
                <p className="text-white">Logout</p>
              </button>
            )}

            <CartButton mobileNav />
          </ul>
        </nav>
      </PopoverPanel>
    </Popover>
  );
};
