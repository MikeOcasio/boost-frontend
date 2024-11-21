"use client";

import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BiImage, BiPencil } from "react-icons/bi";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { FaExternalLinkAlt, FaGamepad } from "react-icons/fa";

export const AdminSubProducts = ({ game, highlightMatch, searchTerm }) => {
  const [showSubProducts, setShowSubProducts] = useState(false);

  useEffect(() => {
    if (searchTerm && searchTerm !== "") {
      setShowSubProducts(true);
    } else {
      setShowSubProducts(false);
    }
  }, [searchTerm]);

  return (
    game?.children?.length > 0 && (
      <div className="flex flex-col gap-2 p-3 rounded-lg border border-white/10 bg-white/5">
        <button
          onClick={() => setShowSubProducts(!showSubProducts)}
          className="border border-white/10 rounded-lg p-2 flex items-center gap-1 w-fit hover:bg-white/10"
        >
          {showSubProducts ? (
            <p className="flex items-center gap-2">
              <BsEyeSlash className="h-5 w-5" />
              Hide
            </p>
          ) : (
            <p className="flex items-center gap-2">
              <BsEye className="h-5 w-5" />
              Show
            </p>
          )}
          Sub Products
        </button>

        {showSubProducts &&
          game?.children?.map((child) => (
            <div
              key={child.id}
              className="flex flex-col gap-2 p-3 transition-all bg-CardPlum rounded-lg border border-white/10"
            >
              <div className="text-xs font-semibold flex items-center gap-2">
                <span>
                  {highlightMatch
                    ? highlightMatch(child.category?.name, searchTerm)
                    : child.category?.name}{" "}
                  /{" "}
                </span>

                <span className="flex items-center gap-1">
                  <FaGamepad className="h-4 w-4" />
                  {child.platforms?.map((platform, index) => (
                    <span key={index}>
                      {highlightMatch
                        ? highlightMatch(platform.name, searchTerm)
                        : platform.name}
                      {index < child.platforms.length - 1 && ", "}
                    </span>
                  ))}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                {!!child.image ? (
                  <Image
                    src={child.image}
                    alt={child.name}
                    width={200}
                    height={200}
                    priority
                    className="h-full object-contain max-w-[200px] w-full bg-gray-500/50 p-4 rounded-md"
                    style={{ backgroundColor: child.primary_color + 70 }}
                  />
                ) : (
                  <BiImage className="h-40 w-40 bg-white/10 p-2 rounded-md" />
                )}

                <div className="flex flex-col w-full gap-2">
                  {/* id */}
                  <p className="flex gap-2 items-center rounded-lg border border-white/10 bg-white/10 py-1 px-2 w-fit text-xs">
                    ID :{" "}
                    {highlightMatch
                      ? highlightMatch(child.id.toString(), searchTerm)
                      : child.id.toString()}
                  </p>

                  <div className="font-medium">
                    {highlightMatch
                      ? highlightMatch(child.name, searchTerm)
                      : child.name}
                  </div>

                  {/* badge */}
                  <div className="flex gap-2 items-center text-xs flex-wrap">
                    <p
                      className={clsx(
                        "font-semibold px-2 rounded-full",
                        child.is_active ? "bg-green-600" : "bg-gray-600"
                      )}
                    >
                      {child.is_active ? "Active" : "Inactive"}
                    </p>

                    {child.most_popular && (
                      <p className="font-semibold px-2 rounded-full bg-Gold">
                        Most Popular
                      </p>
                    )}

                    {child.is_priority && (
                      <p className="font-semibold px-2 rounded-full bg-blue-600">
                        Priority
                      </p>
                    )}

                    {child.children?.length > 0 && (
                      <p className="font-semibold px-2 rounded-full bg-orange-600">
                        Sub Products
                      </p>
                    )}
                  </div>

                  {/* tag_line */}
                  <div className="text-xs text-white/80">
                    <span className="font-semibold text-white">
                      Tag Line :{" "}
                    </span>
                    {highlightMatch
                      ? highlightMatch(
                          child.tag_line?.substring(0, 150),
                          searchTerm
                        )
                      : child.tag_line?.substring(0, 150)}
                    {child.tag_line.length > 150 && "..."}
                  </div>

                  {child.price && child.tax && (
                    <div className="flex flex-wrap justify-between items-center gap-2">
                      <p>Tax: ${child.tax}</p>

                      <p className="text-lg font-semibold text-right flex-1">
                        Price: ${child.price}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* attributes */}
              {child.prod_attr_cats?.length > 0 && (
                <p className="text-sm font-semibold bg-white/10 px-2 rounded-md w-fit">
                  Product Attribute Category:{" "}
                  {child.prod_attr_cats.map((item, index) => (
                    <span key={index}>
                      {highlightMatch
                        ? highlightMatch(item.name, searchTerm)
                        : item.name}
                      {index < child.prod_attr_cats.length - 1 && ", "}
                    </span>
                  ))}
                </p>
              )}

              {/* description */}
              <div className="text-xs text-white/80">
                <span className="font-semibold text-white">Description : </span>
                {highlightMatch
                  ? highlightMatch(
                      child.description?.substring(0, 150),
                      searchTerm
                    )
                  : child.description?.substring(0, 150)}
                {child.description.length > 150 && "..."}
              </div>

              <p className="text-xs font-semibold">
                Created at:{" "}
                {game.created_at
                  ? new Intl.DateTimeFormat("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(new Date(game.created_at))
                  : "Not set"}
              </p>

              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/games/${child.id}`}
                  target="_blank"
                  className="flex items-center gap-2 px-3 py-2 transition-all hover:bg-white/10 rounded-lg border border-white/10 flex-1 min-w-fit justify-center"
                >
                  <FaExternalLinkAlt className="h-4 w-4" />
                  Visit Product
                </Link>

                <Link
                  href={`/dashboard/admin/allgames/${child.id}`}
                  className="flex items-center gap-2 px-3 py-2 transition-all hover:bg-white/10 rounded-lg border border-white/10 flex-1 min-w-fit justify-center"
                >
                  <BiPencil className="h-4 w-4" />
                  Edit Product
                </Link>
              </div>
            </div>
          ))}
      </div>
    )
  );
};
