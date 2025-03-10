import Link from "next/link";
import { GiConsoleController, GiPlatform } from "react-icons/gi";
import { BsFillPeopleFill } from "react-icons/bs";
import { BiReceipt, BiSolidOffer } from "react-icons/bi";
import { MdCategory, MdEmojiPeople } from "react-icons/md";
import { CgAttribution } from "react-icons/cg";

const AdminTabs = () => {
  const adminNav = [
    {
      name: "Products",
      href: "/dashboard/admin/allgames",
      icon: <GiConsoleController size={22} />,
    },
    {
      name: "Users",
      href: "/dashboard/admin/allusers",
      icon: <BsFillPeopleFill size={22} />,
    },
    {
      name: "Skillmasters Applications",
      href: "/dashboard/admin/skillmaster-applications",
      icon: <MdEmojiPeople size={22} />,
    },
    {
      name: "Orders",
      href: "/dashboard/admin/allorders",
      icon: <BiReceipt size={22} />,
    },
    {
      name: "Products Categories",
      href: "/dashboard/admin/game_categories",
      icon: <MdCategory size={22} />,
    },
    {
      name: "Products Attributes",
      href: "/dashboard/admin/product_attribute_categories",
      icon: <CgAttribution size={22} />,
    },
    {
      name: "Platforms",
      href: "/dashboard/admin/platforms",
      icon: <GiPlatform size={22} />,
    },
    {
      name: "Promotions",
      href: "/dashboard/admin/promotions",
      icon: <BiSolidOffer size={22} />,
    },
  ];

  return (
    <div className="bg-gray-500/10 rounded-2xl p-2 w-full space-y-2">
      <p className="text-xs">Control Tabs</p>
      <div className="flex flex-wrap gap-2 items-center">
        {adminNav.map((item, index) => (
          <Link
            href={item.href}
            key={index}
            className="flex items-center flex-1 min-w-fit flex-wrap rounded-lg p-2 px-6 bg-gray-500/20 hover:bg-gray-500/30"
          >
            <button className="flex flex-wrap items-center gap-2 mx-auto">
              {item.icon}
              <p className="text-sm font-semibold">{item.name}</p>
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminTabs;
