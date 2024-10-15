"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import {
  BiHome,
  BiLoader,
  BiPowerOff,
  BiReceipt,
  BiSupport,
} from "react-icons/bi";
import { MdDashboard } from "react-icons/md";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { MobileNavigation } from "@/components/home/MobileNavigation";
import { useUserStore } from "@/store/use-user";
import { logoutSession } from "@/lib/actions";
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { FaRegUser } from "react-icons/fa";

const resources = [
  {
    name: "Home",
    href: "/",
    icon: <BiHome size={28} />,
  },
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: <MdDashboard size={28} />,
  },
  { name: "Support", href: "/support", icon: <BiSupport size={28} /> },
  {
    name: "Orders",
    href: "/dashboard/orders",
    icon: <BiReceipt size={28} />,
  },
  {
    name: "Account",
    href: "/dashboard/account",
    icon: <FaRegUser size={28} />,
  },
];

export function Navbar() {
  const router = useRouter();

  const [isScrollDown, setIsScrollDown] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [loading, setLoading] = useState(false);

  const { userToken, removeToken } = useUserStore();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY) {
        setIsScrollDown(true);
      } else {
        setIsScrollDown(false);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleLogout = async () => {
    setLoading(true);
    try {
      if (!userToken) {
        toast.error("No token found. Please login again.");
        return;
      }

      const response = await logoutSession();

      if (response.error) {
        toast.error(response.error || "An error occurred.");
      } else {
        toast.success("Logged out!");
        router.push("/");
      }
    } catch (err) {
      toast.error(err.message || "Failed to log out user.");
      console.log("Error logging out user:", err);
    } finally {
      removeToken();
      setLoading(false);
      router.push("/");
    }
  };

  return (
    <nav
      className={clsx(
        "z-50 fixed top-0 w-full lg:p-4 transition-all",
        isScrollDown ? "-translate-y-full" : "translate-y-0"
      )}
    >
      <div className="lg:rounded-xl flex px-4 md:px-8 justify-between items-center bg-gradient-to-r from-Plum/60 to-Gold/60 backdrop-blur-sm max-w-[1600px] w-full mx-auto">
        <Link href="/">
          <Image
            src="/logo.svg"
            height={150}
            width={150}
            alt="RavenBoost"
            className="h-full w-16"
          />
        </Link>

        <div className="md:hidden">
          <MobileNavigation
            resources={resources}
            handleLogout={handleLogout}
            userToken={userToken}
            loading={loading}
          />
        </div>
        <div className="hidden md:block">
          <div className="flex items-center gap-x-4">
            {resources.map((item, index) =>
              item.name === "Orders" ? null : item.name === "Account" ? (
                <div key={index} className="text-right">
                  <Menu>
                    <MenuButton className="rounded-lg hover:bg-Plum/30 border border-white/10 h-full mt-1">
                      {loading ? (
                        <BiLoader className="h-10 w-10 p-2.5 animate-spin" />
                      ) : (
                        <FaRegUser className="h-10 w-10 p-2.5" />
                      )}
                    </MenuButton>

                    <MenuItems
                      transition
                      anchor="bottom end"
                      className="w-52 origin-top-right rounded-xl border border-white/5 bg-neutral-800/90 backdrop-blur-lg p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 z-50 mt-2"
                    >
                      <MenuItem
                        as={Link}
                        href="/dashboard/account"
                        className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10"
                      >
                        <FaRegUser className="size-4 fill-white/30" />
                        Account
                      </MenuItem>

                      <div className="my-1 h-px bg-white/5" />

                      <MenuItem
                        as={Link}
                        href="/dashboard/orders"
                        className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10"
                      >
                        <BiReceipt className="size-4 fill-white/30" />
                        Orders
                      </MenuItem>

                      <div className="my-1 h-px bg-white/5" />

                      <MenuItem
                        onClick={handleLogout}
                        disabled={loading}
                        as={Button}
                        className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10"
                      >
                        {loading ? (
                          <BiLoader className="size-4 fill-white/30 animate-spin" />
                        ) : (
                          <BiPowerOff className="size-4 fill-white/30" />
                        )}
                        Logout
                      </MenuItem>
                    </MenuItems>
                  </Menu>
                </div>
              ) : (
                <Link
                  href={item.href}
                  className="text-lg font-semibold"
                  key={index}
                >
                  <div className="group relative flex items-center gap-x-2 rounded-lg p-2 hover:bg-Plum/30">
                    {item.name}
                  </div>
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
