"use client";
import React, { useEffect, useRef, useCallback, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ChatIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  UserCircleIcon,
} from "../icons/index";

import useSidebarStore from "@/store/use-sidebar";
import { GiConsoleController, GiHastyGrave, GiPlatform } from "react-icons/gi";
import { BsFillPeopleFill } from "react-icons/bs";
import {
  MdCategory,
  MdEmojiPeople,
  MdOutlineManageAccounts,
  MdOutlineRateReview,
} from "react-icons/md";
import {
  BiHome,
  BiReceipt,
  BiSolidOffer,
  BiSupport,
  BiWallet,
} from "react-icons/bi";
import { CgAttribution } from "react-icons/cg";
import { TfiReceipt } from "react-icons/tfi";
import { useUserStore } from "@/store/use-user";
import { SiSlideshare } from "react-icons/si";
import { PiHandCoins } from "react-icons/pi";
import { TbLayoutDashboard } from "react-icons/tb";

const navItems = [
  {
    icon: <BiHome size={22} color="white" />,
    name: "Go Back Home",
    path: "/",
  },
  {
    icon: <TbLayoutDashboard />,
    name: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: <GridIcon />,
    name: "Admin",
    subItems: [
      {
        name: "Games",
        path: "/dashboard/admin/game_categories",
        icon: <MdCategory size={22} color="white" />,
      },
      {
        name: "Products",
        path: "/dashboard/admin/allgames",
        icon: <GiConsoleController size={22} color="white" />,
      },
      {
        name: "Platforms",
        path: "/dashboard/admin/platforms",
        icon: <GiPlatform size={22} color="white" />,
      },
      {
        name: "Promotions",
        path: "/dashboard/admin/promotions",
        icon: <BiSolidOffer size={22} color="white" />,
      },
      {
        name: "Orders",
        path: "/dashboard/admin/allorders",
        icon: <BiReceipt size={22} color="white" />,
      },
      {
        name: "Skillmasters Applications",
        path: "/dashboard/admin/skillmaster-applications",
        icon: <MdEmojiPeople size={22} color="white" />,
      },
      {
        name: "Products Attributes",
        path: "/dashboard/admin/product_attribute_categories",
        icon: <CgAttribution size={22} color="white" />,
      },
      {
        name: "Users",
        path: "/dashboard/admin/allusers",
        icon: <BsFillPeopleFill size={22} color="white" />,
      },
    ],
  },

  {
    icon: <MdOutlineManageAccounts size={22} color="white" />,
    name: "Account",

    subItems: [
      {
        icon: <UserCircleIcon />,
        name: "User Profile",
        path: "/dashboard/account",
      },
      {
        icon: <PiHandCoins size={22} color="white" />,
        name: "Rewards",
        path: "/dashboard/reward",
      },
      {
        icon: <SiSlideshare size={22} color="white" />,
        name: "Referral",
        path: "/dashboard/referral",
      },
      {
        icon: <BiWallet size={22} color="white" />,
        name: "My Wallet",
        path: "/dashboard/wallet",
      },
      {
        icon: <MdOutlineRateReview size={22} color="white" />,
        name: "Reviews",
        path: "/dashboard/review",
      },
    ],
  },
  {
    name: "Orders",
    path: "/dashboard/orders",
    icon: <BiReceipt size={22} color="white" />,
  },
  {
    icon: <GiHastyGrave size={22} color="white" />,
    name: "Orders Graveyard",
    path: "/dashboard/orders_graveyard",
  },
];

const supportItems = [
  {
    icon: <ChatIcon />,
    name: "Chat",
    path: "/dashboard/chat",
  },
  {
    icon: <TfiReceipt size={22} color="white" />,
    name: "Invoice",
    path: "/dashboard/invoice",
  },
  {
    icon: <BiSupport size={22} color="white" />,
    name: "Support",
    path: "/support",
  },
];

const AppSidebar = () => {
  const { user } = useUserStore();
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } =
    useSidebarStore();
  const pathname = usePathname();

  const isAdminOrDev = user?.role === "dev" || user?.role === "admin";
  const isAdminorDevOrSkillmaster =
    user?.role === "dev" ||
    user?.role === "admin" ||
    user?.role === "skillmaster";

  const renderMenuItems = (navItems, menuType) => (
    <ul className="flex flex-col gap-4">
      {navItems.map(
        (nav, index) =>
          (nav?.name !== "Admin" || isAdminOrDev) &&
          (nav?.name !== "Orders Graveyard" || isAdminorDevOrSkillmaster) && (
            <li key={nav.name}>
              {nav.subItems ? (
                <button
                  onClick={() => handleSubmenuToggle(index, menuType)}
                  className={`menu-item group  ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "menu-item-active"
                      : "menu-item-inactive"
                  } cursor-pointer ${
                    !isExpanded && !isHovered
                      ? "lg:justify-center"
                      : "lg:justify-start"
                  }`}
                >
                  <span
                    className={` ${
                      openSubmenu?.type === menuType &&
                      openSubmenu?.index === index
                        ? "menu-item-icon-active"
                        : "menu-item-icon-inactive"
                    }`}
                  >
                    {nav.icon}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className={`menu-item-text`}>{nav.name}</span>
                  )}
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <ChevronDownIcon
                      className={`ml-auto w-5 h-5 transition-transform duration-200 invert  ${
                        openSubmenu?.type === menuType &&
                        openSubmenu?.index === index
                          ? "rotate-180 text-brand-500"
                          : ""
                      }`}
                    />
                  )}
                </button>
              ) : (
                nav.path && (
                  <Link
                    href={nav.path}
                    className={`menu-item group ${
                      isActive(nav.path)
                        ? "menu-item-active"
                        : "menu-item-inactive"
                    } ${nav.name === "Go Back Home" && "bg-Gold/20"}
                    `}
                  >
                    <span
                      className={`${
                        isActive(nav.path)
                          ? "menu-item-icon-active"
                          : "menu-item-icon-inactive"
                      }`}
                    >
                      {nav.icon}
                    </span>
                    {(isExpanded || isHovered || isMobileOpen) && (
                      <span className={`menu-item-text`}>{nav.name}</span>
                    )}
                  </Link>
                )
              )}

              {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
                <div
                  ref={(el) => {
                    subMenuRefs.current[`${menuType}-${index}`] = el;
                  }}
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    height:
                      openSubmenu?.type === menuType &&
                      openSubmenu?.index === index
                        ? `${subMenuHeight[`${menuType}-${index}`]}px`
                        : "0px",
                  }}
                >
                  <ul className="mt-2 space-y-1 ml-6">
                    {nav.subItems.map(
                      (subItem) =>
                        (subItem.name !== "Rewards" ||
                          isAdminorDevOrSkillmaster) && (
                          <li key={subItem.name}>
                            <Link
                              href={subItem.path}
                              className={`menu-dropdown-item ${
                                isActive(subItem.path)
                                  ? "menu-dropdown-item-active"
                                  : "menu-dropdown-item-inactive"
                              }`}
                            >
                              <span
                                className={`${
                                  isActive(nav.path)
                                    ? "menu-item-icon-active"
                                    : "menu-item-icon-inactive"
                                }`}
                              >
                                {subItem.icon}
                              </span>
                              {subItem.name}
                              <span className="flex items-center gap-1 ml-auto">
                                {subItem.new && (
                                  <span
                                    className={`ml-auto ${
                                      isActive(subItem.path)
                                        ? "menu-dropdown-badge-active"
                                        : "menu-dropdown-badge-inactive"
                                    } menu-dropdown-badge `}
                                  >
                                    new
                                  </span>
                                )}
                                {subItem.pro && (
                                  <span
                                    className={`ml-auto ${
                                      isActive(subItem.path)
                                        ? "menu-dropdown-badge-active"
                                        : "menu-dropdown-badge-inactive"
                                    } menu-dropdown-badge `}
                                  >
                                    pro
                                  </span>
                                )}
                              </span>
                            </Link>
                          </li>
                        )
                    )}
                  </ul>
                </div>
              )}
            </li>
          )
      )}
    </ul>
  );

  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [subMenuHeight, setSubMenuHeight] = useState({});
  const subMenuRefs = useRef({});

  // const isActive = (path: string) => path === pathname;

  const isActive = useCallback((path) => path === pathname, [pathname]);

  useEffect(() => {
    // Check if the current path matches any submenu item
    let submenuMatched = false;
    ["main", "support"].forEach((menuType) => {
      const items =
        menuType === "main" ? navItems : menuType === "support" && supportItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType,
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    // If no submenu item matches, close the open submenu
    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive]);

  useEffect(() => {
    // Set the height of the submenu items when the submenu is opened
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index, menuType) => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-Plum/20 backdrop-blur-2xl border-white/10 text-white h-full transition-all duration-300 ease-in-out z-50 border-r 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex  ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <Image
              src="/full-logo.png"
              height={150}
              width={200}
              alt="RavenBoost"
              priority
              className="h-full w-full hidden lg:block"
            />
          ) : (
            <Image src="/logo.svg" alt="Logo" width={60} height={60} />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto  duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Support"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(supportItems, "support")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
