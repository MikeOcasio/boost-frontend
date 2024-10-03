"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { BiPowerOff, BiReceipt, BiSupport } from "react-icons/bi";
import { MdDashboard, MdPerson } from "react-icons/md";

import { MobileNavigation } from "@/components/home/MobileNavigation";
import { useUserStore } from "@/store/use-user";

const resources = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: <MdDashboard size={32} />,
  },
  {
    name: "Account",
    href: "/dashboard/account",
    icon: <MdPerson size={32} />,
  },
  {
    name: "Orders",
    href: "/dashboard/orders",
    icon: <BiReceipt size={32} />,
  },
  { name: "Support", href: "/support", icon: <BiSupport size={32} /> },
  { name: "Logout", href: "/logout", icon: <BiPowerOff size={32} /> },
];

export function Navbar() {
  const [isScrollDown, setIsScrollDown] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const { logoutUser } = useUserStore();

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
    try {
      await logoutUser();
      toast.success("Logged out!");
    } catch (err) {
      toast.error("Failed to log out user.");
      console.log("Error logging out user:", err);
    } finally {
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
      <div className="lg:rounded-xl flex px-4 md:px-8 justify-between items-center bg-gradient-to-r from-Plum/50 to-Gold/50 backdrop-blur-2xl max-w-[1600px] w-full mx-auto">
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
          <MobileNavigation resources={resources} />
        </div>
        <div className="hidden md:block">
          <div className="flex items-center gap-x-4">
            {resources.map((item, index) =>
              item.name === "Logout" ? (
                <button
                  onClick={handleLogout}
                  className="text-lg font-semibold rounded-lg p-2 hover:bg-Plum/30"
                >
                  {item.icon}
                </button>
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
