"use client";

import Image from "next/image";
import { BiChevronRight, BiPencil } from "react-icons/bi";
import Link from "next/link";
import clsx from "clsx";

export const AdminGameCard = ({ game, key }) => {
  return (
    <div
      key={key}
      className="relative flex flex-col gap-4 p-4 rounded-lg overflow-hidden border border-white/10 hover:border-white/20"
      style={{ backgroundColor: game.secondary_color + 20 }}
    >
      {/* bg image */}
      {!!game.bg_image && (
        <Image
          src={game.bg_image}
          alt={game.name}
          width={200}
          height={200}
          unoptimized
          className="top-0 left-0 h-full object-cover w-full absolute opacity-50 blur-sm -z-10"
        />
      )}

      <div className="flex justify-between items-center flex-wrap-reverse">
        <h3 className="text-lg font-semibold">{game.name}</h3>
        <Link href={`/dashboard/admin/allgames/${game.id}`}>
          <button className="flex items-center gap-2 px-3 py-2 transition-all hover:bg-neutral-500/50 text-white rounded-md">
            <BiPencil />
            Edit
          </button>
        </Link>
      </div>

      <div className="flex flex-wrap gap-4">
        {!!game.image && (
          <Image
            src={game.image}
            alt={game.name}
            width={200}
            height={200}
            unoptimized
            className="h-full object-contain max-w-[200px] w-full bg-gray-500/50 p-4 rounded-md"
            style={{ backgroundColor: game.primary_color + 70 }}
          />
        )}

        <div className="flex-col flex gap-2 flex-1">
          <p className="text-lg break-all">{game.tag_line}</p>

          {/* badge */}
          <div className="flex gap-2 items-center text-xs flex-wrap">
            <p
              className={clsx(
                "font-semibold px-2 rounded-full",
                game.is_active ? "bg-green-600" : "bg-gray-600"
              )}
            >
              {game.is_active ? "Active" : "Inactive"}
            </p>

            {game.most_popular && (
              <p
                className={clsx(
                  "font-semibold px-2 rounded-full",
                  game.most_popular ? "bg-green-600" : "bg-gray-600"
                )}
              >
                {game.most_popular ? "Most Popular" : ""}
              </p>
            )}

            <p
              className={clsx(
                "font-semibold px-2 rounded-full",
                game.is_priority ? "bg-green-600" : "bg-gray-600"
              )}
            >
              {game.is_priority ? "Priority" : "Standard"}
            </p>
          </div>

          <div className="flex flex-wrap justify-between items-center gap-2">
            <p>Tax: {game.tax}</p>

            <p className="text-lg font-semibold text-right flex-1">
              Price: ${game.price}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <p className="text-sm font-semibold bg-white/10 px-2 rounded-md">
          ID: {game.id}
        </p>

        <p className="text-sm font-semibold bg-white/10 px-2 rounded-md">
          Category ID: {game.category_id}
        </p>
        <p className="text-sm font-semibold bg-white/10 px-2 rounded-md">
          Product Attribute Category ID: {game.product_attribute_category_id}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="space-y-2 border rounded-lg border-white/10 p-2 bg-white/10">
          <p className="font-semibold">Features</p>

          {game.features.map((feature, index) => (
            <p
              key={index}
              className="text-sm break-all flex items-center gap-2"
            >
              <BiChevronRight />
              {feature}
            </p>
          ))}
        </div>

        <div className="text-sm break-all border rounded-lg border-white/10 p-2 flex-1 bg-white/10">
          <p className="font-semibold text-base">Description</p>
          <p>{game.description}</p>
        </div>
      </div>
    </div>
  );
};
