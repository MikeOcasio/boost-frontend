import { NavPages } from "@/lib/constant";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { BiSearch } from "react-icons/bi";
import { IoClose } from "react-icons/io5";

const HeaderSearchHome = () => {
  const router = useRouter();

  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleClose = () => {
    setIsFocused(false);
    setSearchQuery("");
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a search query");
      return;
    }

    router.push(`/search?q=${searchQuery}`);
    handleClose();
  };

  return (
    <div>
      <button
        className="p-2.5 rounded-lg hover:bg-Plum/40 border border-white/20 flex items-center gap-3"
        onClick={() => setIsFocused(true)}
      >
        <p className="text-sm font-medium text-gray-200">Search...</p>

        <BiSearch className="size-5 text-gray-300" />
      </button>

      {isFocused && (
        <div>
          <div
            className="fixed h-[120vh] w-[150%] -left-[25%] -top-20 bg-black/80 backdrop-blur-md z-[999]"
            onClick={handleClose}
          />

          <div className="w-full z-[9999] fixed left-0 right-0 max-w-2xl mx-auto top-[15vh] p-4 bg-gradient-to-b from-gray-900/95 to-black/95 rounded-2xl shadow-2xl border border-gray-800/50 backdrop-blur-xl">
            <div className="flex items-center bg-gray-800/30 rounded-xl px-4 py-3 hover:bg-gray-800/40 transition-colors duration-200 mb-4">
              <BiSearch
                className="size-8 cursor-pointer p-1 rounded-lg hover:bg-white/20 text-gray-300 transition-colors"
                onClick={handleSearch}
              />

              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-transparent focus:outline-none text-gray-100 placeholder-gray-500 outline-none focus:ring-0 border-none px-3 text-[15px]"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />

              {searchQuery.trim() && (
                <IoClose
                  className="size-8 cursor-pointer p-1 rounded-lg hover:bg-white/20 text-gray-300 transition-colors"
                  onClick={handleClose}
                />
              )}
            </div>

            {searchQuery.trim()
              ? NavPages.filter((item) =>
                  item.name.toLowerCase().includes(searchQuery.toLowerCase())
                ).map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    onClick={handleClose}
                    className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-800/30 cursor-pointer transition-colors"
                  >
                    {item.icon}
                    <p className="text-gray-300 text-[15px]">{item.name}</p>
                  </Link>
                ))
              : NavPages.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    onClick={handleClose}
                    className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-800/30 cursor-pointer transition-colors"
                  >
                    {item.icon}
                    <p className="text-gray-300 text-[15px]">{item.name}</p>
                  </Link>
                ))}

            {searchQuery.trim() &&
              !NavPages.some((item) =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
              ) && (
                <div className="text-center p-4 text-gray-400">
                  Press Enter to search &quot;{searchQuery}&quot;
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderSearchHome;
