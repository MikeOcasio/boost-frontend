"use client";

import { useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import Link from "next/link";
import Image from "next/image";
import { IoGameControllerOutline } from "react-icons/io5";
import { GiSergeant } from "react-icons/gi";
import {
  BiLoader,
  BiLogIn,
  BiPowerOff,
  BiReceipt,
  BiSupport,
} from "react-icons/bi";
import { MdDashboard } from "react-icons/md";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { FaRegUser } from "react-icons/fa";

import { MobileNavigation } from "./home/MobileNavigation";
import { CartButton } from "./CartButton";
import { useUserStore } from "@/store/use-user";
import { logoutSession } from "@/lib/actions/user-actions";
import { fetchCurrentUser } from "@/lib/actions/user-actions";

const resourcesData = [
  {
    name: "Products",
    href: "/products",
    icon: <IoGameControllerOutline size={32} />,
  },
  {
    name: "Skill Masters",
    href: "/skillmasters",
    icon: <GiSergeant size={32} />,
  },
  { name: "Support", href: "/support", icon: <BiSupport size={32} /> },
];

export function Header() {
  const router = useRouter();

  const { userToken, removeToken, user, setUser } = useUserStore();

  const [resources, setResources] = useState(resourcesData);
  const [isScrollDown, setIsScrollDown] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const handleUserFetch = useCallback(async () => {
    if (!userToken || !mounted) return;

    setLoading(true);
    try {
      const response = await fetchCurrentUser();

      if (response?.error) {
        toast.error(response.error);

        await removeToken();
        router.push("/");
      } else {
        setUser(response);
      }
    } catch (err) {
      await removeToken();
    } finally {
      setLoading(false);
    }
  }, [mounted, removeToken, router, setUser, userToken]);

  useEffect(() => {
    if (userToken) handleUserFetch();
  }, [handleUserFetch, userToken]);

  useEffect(() => {
    setMounted(true);
    // Adjust navbar resources based on session token
    if (userToken) {
      setResources([
        ...resourcesData,
        {
          name: "Dashboard",
          href: "/dashboard",
          icon: <MdDashboard size={32} />,
        },
      ]);
    } else {
      setResources([
        ...resourcesData,
        {
          name: "Login",
          href: "/login",
          icon: <BiLogIn size={32} />,
        },
      ]);
    }
  }, [userToken]);

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
    if (!userToken) {
      toast.error("No token found. Please login again.");
      return;
    }

    try {
      setLoading(true);

      const response = await logoutSession();

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Logged out!");
      }
    } catch (err) {
      // console.log("Error logging out user:", err);
      toast.error("Failed to log out user.");
    } finally {
      setLoading(false);

      removeToken();
      router.push("/");
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav
      className={clsx(
        "z-50 fixed top-0 w-full lg:p-4 transition-all text-white",
        isScrollDown ? "-translate-y-full" : "translate-y-0"
      )}
    >
      <div className="lg:rounded-xl flex px-4 md:px-8 justify-between items-center bg-gradient-to-r from-Plum/60 to-Gold/60 max-w-[1920px] w-full mx-auto backdrop-blur-sm">
        <Link href="/">
          <Image
            src="/logo.svg"
            height={150}
            width={150}
            alt="RavenBoost"
            priority
            className="h-full w-16"
          />
        </Link>

        <div className="md:hidden">
          <MobileNavigation
            resources={resources}
            userToken={userToken}
            handleLogout={handleLogout}
            loading={loading}
          />
        </div>

        <div className="hidden md:flex items-center gap-4">
          {resources.map((item, index) =>
            item.name === "Dashboard" ? (
              <div key={index} className="text-right">
                <Menu>
                  <MenuButton className="rounded-lg hover:bg-Plum/30 border border-white/10 h-full mt-1">
                    {loading ? (
                      <BiLoader className="h-10 w-10 p-2.5 animate-spin" />
                    ) : user?.image_url ? (
                      <Image
                        src={user.image_url}
                        alt={user.first_name}
                        width={50}
                        height={50}
                        priority
                        className="h-10 w-10 rounded-full object-cover"
                      />
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
                      href="/dashboard"
                      className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10"
                    >
                      <MdDashboard className="size-4 fill-white/30" />
                      Dashboard
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

                    {mounted && userToken && (
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
                    )}
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

          {/* cart */}
          <CartButton />
        </div>
      </div>
    </nav>
  );
}
