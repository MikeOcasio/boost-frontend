"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { BiLoader, BiPowerOff, BiReceipt, BiSupport } from "react-icons/bi";
import { MdDashboard, MdPerson } from "react-icons/md";
import { useRouter } from "next/navigation";

import { MobileNavigation } from "@/components/home/MobileNavigation";
import { useUserStore } from "@/store/use-user";
import { logoutSession } from "@/lib/actions";

const resources = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: <MdDashboard size={28} />,
  },
  {
    name: "Account",
    href: "/dashboard/account",
    icon: <MdPerson size={28} />,
  },
  {
    name: "Orders",
    href: "/dashboard/orders",
    icon: <BiReceipt size={28} />,
  },
  { name: "Support", href: "/support", icon: <BiSupport size={28} /> },
  { name: "Logout", href: "/logout", icon: <BiPowerOff size={28} /> },
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
              item.name === "Logout" ? (
                <button
                  key={index}
                  onClick={handleLogout}
                  disabled={loading}
                  className="font-semibold rounded-lg p-2 hover:bg-Plum/30"
                >
                  {loading ? (
                    <BiLoader className="h-6 w-6 text-white animate-spin" />
                  ) : (
                    item.icon
                  )}
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
