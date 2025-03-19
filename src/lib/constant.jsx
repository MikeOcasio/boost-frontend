import {
  BiCategory,
  BiGroup,
  BiHome,
  BiLogIn,
  BiStore,
  BiSupport,
  BiUser,
  BiUserPlus,
} from "react-icons/bi";

export const NavPages = [
  {
    name: "Home",
    href: "/",
    icon: <BiHome size={24} className="text-gray-300" />,
  },
  {
    name: "Products",
    href: "/products",
    icon: <BiStore size={24} className="text-gray-300" />,
  },
  {
    name: "Game Categories",
    href: "/products/categories",
    icon: <BiCategory size={24} className="text-gray-300" />,
  },
  {
    name: "Skillmasters",
    href: "/skillmasters",
    icon: <BiGroup size={24} className="text-gray-300" />,
  },
  {
    name: "Support",
    href: "/support",
    icon: <BiSupport size={24} className="text-gray-300" />,
  },
  {
    name: "Skillmaster Application",
    href: "/skillmaster-application",
    icon: <BiUserPlus size={24} className="text-gray-300" />,
  },
  {
    name: "Account",
    href: "/dashboard/account",
    icon: <BiUser size={24} className="text-gray-300" />,
  },
  {
    name: "Login",
    href: "/login",
    icon: <BiLogIn size={24} className="text-gray-300" />,
  },
];
