import useCategoriesStore from "@/store/use-catogries";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import React from "react";
import { BiLoader } from "react-icons/bi";
import { IoWarning } from "react-icons/io5";

const CategoriesSidebar = () => {
  const { categories, isLoading, error } = useCategoriesStore();

  if (isLoading) {
    return (
      <BiLoader className="h-8 w-8 animate-spin mx-auto hidden xl:block" />
    );
  }

  if (error) {
    return (
      <p className="w-fit bg-red-500/50 p-4 rounded-lg mx-auto items-center justify-center gap-2 hidden xl:flex">
        <IoWarning className="h-5 w-5 mr-2" />
        Failed to load games. Please reload the page!
      </p>
    );
  }

  if (categories.length > 0) {
    return (
      <div className="space-y-2 p-4 bg-Plum/50 rounded-lg min-w-fit h-fit sticky top-0 left-0 hidden xl:block overflow-y-auto">
        {categories.map(
          (category) =>
            category.is_active && (
              <Link
                key={category.id}
                href={`/products/categories/${category.id}`}
                className="group w-full flex items-center justify-between p-3 gap-6 hover:rounded-lg hover:bg-Gold/50 transition-all border-white/10 border-b last:border-none max-w-60"
              >
                <span className="break-all">{category.name}</span>
                <ChevronRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-all" />
              </Link>
            )
        )}
      </div>
    );
  }
};

export default CategoriesSidebar;
