import {
  Popover,
  PopoverBackdrop,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";
import Link from "next/link";
import { BiCross } from "react-icons/bi";
import { IoMenu } from "react-icons/io5";
import { CartButton } from "../CartButton";

function MobileNavItem({ href, children }) {
  return (
    <li>
      <PopoverButton as={Link} href={href} className="block py-2">
        {children}
      </PopoverButton>
    </li>
  );
}

export const MobileNavigation = ({ resources }) => {
  return (
    <Popover>
      <PopoverButton>
        <IoMenu className="h-8 w-8" />
      </PopoverButton>

      <PopoverBackdrop
        transition
        className="fixed h-[110vh] top-0 inset-0 bg-black/50 backdrop-blur-sm"
      />

      <PopoverPanel
        focus
        transition
        className="fixed inset-x-4 top-20 z-50 origin-top rounded-xl p-4 ring-1 ring-zinc-900/5 dark:bg-zinc-900 dark:ring-zinc-800 overflow-y-auto transition duration-200 ease-in-out [--anchor-gap:var(--spacing-5)] data-[closed]:-translate-y-1 data-[closed]:opacity-0"
      >
        <div className="flex flex-row-reverse flex-wrap items-center justify-between">
          <PopoverButton aria-label="Close menu" className="p-1 ml-auto">
            <BiCross className="h-6 w-6 text-zinc-500 dark:text-zinc-400 rotate-45" />
          </PopoverButton>

          <h3 className="text-lg font-semibold">Menu</h3>
        </div>

        <nav className="overflow-y-auto max-h-[80vh] no-scrollbar">
          <ul className="divide-y divide-zinc-100 text-base text-zinc-800 dark:divide-zinc-100/5 dark:text-zinc-300">
            {resources.map((item) => (
              <MobileNavItem key={item.name} href={item.href}>
                <div className="group relative flex flex-wrap items-center gap-x-6 rounded-lg p-2 hover:bg-yellow-600/30">
                  <div className="bg-inherit mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg">
                    {item.icon}
                  </div>
                  <div>
                    <Link href={item.href} className="font-semibold">
                      {item.name}
                    </Link>
                  </div>
                </div>
              </MobileNavItem>
            ))}

            <CartButton />
          </ul>
        </nav>
      </PopoverPanel>
    </Popover>
  );
};
