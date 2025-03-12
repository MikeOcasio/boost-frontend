"use client";

import useCategoriesStore from "@/store/use-catogries";
import Image from "next/image";
import Link from "next/link";

import React, { useState } from "react";
import { BiLoader } from "react-icons/bi";
import { IoWarning } from "react-icons/io5";

const CategoriesTab = () => {
  const { categories, isLoading, error } = useCategoriesStore();
  const [showAll, setShowAll] = useState(false);
  const initialItems = 7;

  if (isLoading) {
    return <BiLoader className="h-8 w-8 animate-spin mx-auto" />;
  }

  if (error) {
    return (
      <p className="w-fit bg-red-500/50 p-4 rounded-lg mx-auto flex items-center justify-center gap-2">
        <IoWarning className="h-5 w-5 mr-2" />
        Failed to load games. Please reload the page!
      </p>
    );
  }

  const activeCategories = categories.filter((category) => category.is_active);

  const displayedCategories = showAll
    ? activeCategories
    : activeCategories.slice(0, initialItems);

  const remainingCount = activeCategories.length - initialItems;

  return (
    <div className="flex flex-col gap-4">
      <p>Pick your game</p>

      <div className="flex items-center gap-4 w-full flex-wrap">
        {displayedCategories.map((category) => (
          <Link
            key={category.id}
            href={`/products?category_id=${category.id}&category_name=${category.name}`}
            className="group px-4 py-2 bg-black/50  min-w-[250px] rounded-lg flex-1 relative h-[200px] p-4 overflow-hidden"
          >
            <Image
              src={category.image || "/images/shape/grid-01.svg"}
              alt={category.name}
              fill
              className="group-hover:scale-125 transition-all duration-500 absolute top-0 left-0 w-full h-full object-cover"
            />
            <div className="absolute left-0 bottom-0 w-full h-[60%] bg-gradient-to-t from-black to-transparent rounded-lg" />

            <span className="text-xl break-all font-bold text-white absolute bottom-4 left-4 right-4">
              {category.name.length > 20
                ? category.name.slice(0, 20) + "..."
                : category.name}
            </span>
          </Link>
        ))}

        {activeCategories.length > initialItems && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-4 py-2 bg-gray-800/50 hover:bg-gray-800/75 min-w-[250px] rounded-lg flex-1 relative h-[200px] p-4 overflow-hidden"
          >
            <Image
              src="/images/shape/grid-01.svg"
              alt="Show All"
              fill
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
            <div className="absolute left-0 bottom-0 w-full h-[60%] bg-gradient-to-t from-black to-transparent rounded-lg" />
            <span className="text-xl break-all font-bold text-white">
              {showAll ? "Show Less" : `Show All (${remainingCount} more)`}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default CategoriesTab;
