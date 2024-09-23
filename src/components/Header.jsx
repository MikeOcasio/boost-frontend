"use client";

import { IoGameControllerOutline, IoMenu } from "react-icons/io5";
import { GiSergeant } from "react-icons/gi";
import { HiOutlineBolt } from "react-icons/hi2";
import { BiLogIn, BiSupport } from "react-icons/bi";
import Image from "next/image";

import { MobileNavigation } from "./home/MobileNavigation";
import { useEffect, useState } from "react";
import clsx from "clsx";
import Link from "next/link";
import { MdDashboard } from "react-icons/md";

const resourcesData = [
  // {
  //   name: "Games",
  //   href: "/games",
  //   icon: <IoGameControllerOutline size={32} />,
  // },
  // {
  //   name: "Skill Masters",
  //   href: "/skillmasters",
  //   icon: <GiSergeant size={32} />,
  // },
  // { name: "Boost", href: "/boost", icon: <HiOutlineBolt size={32} /> },
  // { name: "Support", href: "/support", icon: <BiSupport size={32} /> },
];

export function Header() {
  const user = {
    name: "Nikhil Sharma",
    email: "mail@gmail.com",
    authenticated: false,
  };

  const [resources, setResources] = useState(resourcesData);
  const [isScrollDown, setIsScrollDown] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  {
    /* Prod Changes */
  }
  // useEffect(() => {
  //   if (user.authenticated) {
  //     setResources([
  //       ...resourcesData,
  //       {
  //         name: "Dashboard",
  //         href: "/dashboard",
  //         icon: <MdDashboard size={32} />,
  //       },
  //     ]);
  //   } else {
  //     setResources([
  //       ...resourcesData,
  //       {
  //         name: "Login",
  //         href: "/login",
  //         icon: <BiLogIn size={32} />,
  //       },
  //     ]);
  //   }
  // }, [!!user.authenticated]);

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
          <MobileNavigation resources={resources} user={user} />
        </div>

        <div className="hidden md:block">
          <div className="flex items-center gap-x-4">
            {/* Prod Changes */}
            <IoMenu className="h-7 w-7" />

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
          </div>
        </div>
      </div>
    </nav>
  );
}
