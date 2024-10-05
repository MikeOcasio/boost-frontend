"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import Link from "next/link";
import Image from "next/image";
import { IoGameControllerOutline } from "react-icons/io5";
import { GiSergeant } from "react-icons/gi";
import { BiLoader, BiLogIn, BiPowerOff, BiSupport } from "react-icons/bi";
import { MdDashboard } from "react-icons/md";

import { MobileNavigation } from "./home/MobileNavigation";
import { CartButton } from "./CartButton";
import { useUserStore } from "@/store/use-user";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { logoutSession } from "@/lib/actions";

const resourcesData = [
  {
    name: "Games",
    href: "/games",
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

  const [resources, setResources] = useState(resourcesData);
  const [isScrollDown, setIsScrollDown] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [loading, setLoading] = useState(false);

  const { userToken, removeToken } = useUserStore();

  useEffect(() => {
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
    setLoading(true);
    try {
      if (!userToken) {
        toast.error("No token found. Please login again.");
        return;
      }

      const response = await logoutSession();

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Logged out!");
      }
    } catch (err) {
      toast.error("Failed to log out user.");
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
            userToken={userToken}
            handleLogout={handleLogout}
            loading={loading}
          />
        </div>

        <div className="hidden md:flex items-center gap-4">
          {resources.map((item, index) => (
            <Link
              href={item.href}
              className="text-lg font-semibold"
              key={index}
            >
              <div className="group relative flex items-center gap-x-2 rounded-lg p-2 hover:bg-Plum/30">
                {item.name}
              </div>
            </Link>
          ))}

          {userToken && (
            <button
              onClick={handleLogout}
              disabled={loading}
              className="rounded-lg hover:bg-Plum/30 border border-white/10"
            >
              {loading ? (
                <BiLoader className="h-10 w-10 animate-spin p-2" />
              ) : (
                <BiPowerOff className="h-10 w-10 p-2" />
              )}
            </button>
          )}

          {/* cart */}
          <CartButton />
        </div>
      </div>
    </nav>
  );
}
