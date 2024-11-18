"use client";

import Image from "next/image";
import { BiChevronRight, BiImage, BiPencil } from "react-icons/bi";
import Link from "next/link";
import clsx from "clsx";
import { FaExternalLinkAlt, FaGamepad } from "react-icons/fa";
import { AdminSubProducts } from "./AdminSubProducts";

// Helper function to highlight matching terms
const highlightMatch = (text, searchTerm) => {
  if (!searchTerm) return text; // If no search term, return the original text
  const regex = new RegExp(`(${searchTerm})`, "gi"); // Case-insensitive match
  const parts = text.split(regex); // Split the text into matching and non-matching parts

  return parts.map((part, index) =>
    regex.test(part) ? <mark key={index}>{part}</mark> : part
  );
};

export const AdminGameCard = ({ game, searchTerm }) => {
  return (
    <div
      className="relative flex flex-col gap-4 p-4 rounded-lg overflow-hidden border border-white/10 hover:border-white/20"
      style={{ backgroundColor: game.secondary_color + 20 }}
    >
      {/* Background image */}
      {!!game.bg_image && (
        <Image
          src={game.bg_image}
          alt={game.name}
          width={200}
          height={200}
          priority
          className="top-0 left-0 h-full object-cover w-full absolute opacity-50 blur-sm -z-10"
        />
      )}

      <div className="flex justify-between items-center flex-wrap-reverse">
        <div className="text-xs font-semibold flex items-center gap-2">
          <span>{highlightMatch(game.category.name, searchTerm)} / </span>

          <span className="flex items-center gap-2">
            <FaGamepad className="h-4 w-4" />
            {game.platforms?.map((platform, index) => (
              <span key={index}>
                {highlightMatch(platform.name, searchTerm)}
                {index < game.platforms.length - 1 && ", "}
              </span>
            ))}
          </span>
        </div>

        <Link href={`/dashboard/admin/allgames/${game.id}`}>
          <button className="flex items-center gap-2 px-3 py-2 transition-all hover:bg-white/10 rounded-lg">
            <BiPencil />
            Edit
          </button>
        </Link>
      </div>

      <div className="flex flex-wrap gap-4">
        {!!game.image ? (
          <Image
            src={game.image}
            alt={game.name}
            width={200}
            height={200}
            priority
            className="h-full object-contain max-w-[200px] w-full bg-gray-500/50 p-4 rounded-md"
            style={{ backgroundColor: game.primary_color + 70 }}
          />
        ) : (
          <BiImage className="h-40 w-40 bg-white/10 p-2 rounded-md" />
        )}

        <div className="flex-col flex gap-2 flex-1 min-w-fit">
          <p className="text-lg font-semibold">
            {highlightMatch(game.name, searchTerm)}
          </p>
          <p className="text-sm break-all">
            {highlightMatch(game.tag_line, searchTerm)}
          </p>

          {/* Badge */}
          <div className="flex gap-2 items-center text-xs flex-wrap">
            <p
              className={clsx(
                "font-semibold px-2 rounded-full",
                game.is_active ? "bg-green-600" : "bg-gray-600"
              )}
            >
              {highlightMatch(
                game.is_active ? "Active" : "Inactive",
                searchTerm
              )}
            </p>

            {game.most_popular && (
              <p className="font-semibold px-2 rounded-full bg-Gold">
                Most Popular
              </p>
            )}

            {game.is_priority && (
              <p className="font-semibold px-2 rounded-full bg-blue-600">
                Priority
              </p>
            )}

            {game.children?.length > 0 && (
              <p className="font-semibold px-2 rounded-full bg-orange-600">
                {highlightMatch("Sub Products", searchTerm)}
              </p>
            )}
          </div>

          <div className="flex flex-wrap justify-between items-center gap-2">
            <p>Tax: ${game.tax}</p>

            <p className="text-lg font-semibold text-right flex-1">
              Price: ${game.price}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <p className="text-sm font-semibold bg-white/10 px-2 rounded-md">
          ID: {highlightMatch(game.id.toString(), searchTerm)}
        </p>

        <p className="text-sm font-semibold bg-white/10 px-2 rounded-md">
          Category ID: {highlightMatch(game.category_id.toString(), searchTerm)}
        </p>

        {game.prod_attr_cats?.length > 0 && (
          <p className="text-sm font-semibold bg-white/10 px-2 rounded-md">
            Product Attribute Category:{" "}
            {game.prod_attr_cats.map((item, index) => (
              <span key={index}>
                {highlightMatch(item.name, searchTerm)}
                {index < game.prod_attr_cats.length - 1 && ", "}
              </span>
            ))}
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="space-y-2 border rounded-lg border-white/10 p-2 bg-white/10 flex-1 min-w-fit md:min-w-min">
          <p className="font-semibold">Features</p>

          {game.features.map((feature, index) => (
            <p
              key={index}
              className="text-sm break-all flex items-center gap-2"
            >
              <BiChevronRight />
              {highlightMatch(feature, searchTerm)}
            </p>
          ))}
        </div>

        <div className="text-sm break-all border rounded-lg border-white/10 p-2 flex-1 bg-white/10 min-w-fit md:min-w-min">
          <p className="font-semibold text-base">Description</p>
          <p>{highlightMatch(game.description, searchTerm)}</p>
        </div>
      </div>

      {/* Created At */}
      <div className="flex justify-between items-center flex-wrap gap-2">
        <p className="text-xs font-semibold">
          Created at: {new Date(game.created_at).toLocaleString()}
        </p>

        <Link
          href={`/games/${game.id}`}
          target="_blank"
          className="flex items-center gap-2 px-3 py-2 transition-all hover:bg-white/10 rounded-lg border border-white/10"
        >
          <FaExternalLinkAlt className="h-4 w-4" />
          Visit Game
        </Link>
      </div>

      {/* sub products */}

      {game.children?.length > 0 && (
        <p className="text-sm font-semibold border-t pt-2 border-white/20">
          Sub Products
        </p>
      )}
      <AdminSubProducts
        game={game}
        highlightMatch={highlightMatch}
        searchTerm={searchTerm}
      />
    </div>
  );
};
