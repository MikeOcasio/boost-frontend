import Link from "next/link";
import { GiConsoleController } from "react-icons/gi";
import { BsFillPeopleFill } from "react-icons/bs";
import { BiReceipt } from "react-icons/bi";
import { MdCategory } from "react-icons/md";
import { CgAttribution } from "react-icons/cg";

const AdminTabs = () => {
  const adminNav = [
    {
      name: "Games",
      href: "/dashboard/admin/allgames",
      icon: <GiConsoleController size={22} />,
    },
    {
      name: "Users",
      href: "/dashboard/admin/allusers",
      icon: <BsFillPeopleFill size={22} />,
    },
    {
      name: "Orders",
      href: "/dashboard/admin/allorders",
      icon: <BiReceipt size={22} />,
    },
    {
      name: "Game Categories",
      href: "/dashboard/admin/game_categories",
      icon: <MdCategory size={22} />,
    },
    {
      name: "Game Attributes",
      href: "/dashboard/admin/product_attribute_categories",
      icon: <CgAttribution size={22} />,
    },
  ];

  return (
    <div className="bg-gray-500/10 rounded-lg p-2 w-full flex flex-wrap gap-2 items-center">
      {adminNav.map((item, index) => (
        <Link
          href={item.href}
          key={index}
          className="flex items-center flex-1 min-w-fit flex-wrap rounded-lg p-2 bg-gray-500/20 hover:bg-gray-500/30"
        >
          <button className="flex flex-wrap items-center gap-4 mx-auto">
            {item.icon}
            <p className="text-sm font-semibold">{item.name}</p>
          </button>
        </Link>
      ))}
    </div>
  );
};

export default AdminTabs;
