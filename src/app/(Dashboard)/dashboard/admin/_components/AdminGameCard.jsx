"use client";

import { useGameEdit } from "@/store/use-game-edit";
import Image from "next/image";
import { BiPencil } from "react-icons/bi";
import GameDialog from "./GameDialog";
import Link from "next/link";

export const AdminGameCard = ({ game, key }) => {
  const editGame = useGameEdit();

  return (
    <div
      key={key}
      className="relative flex flex-col gap-4 p-4 rounded-lg overflow-hidden"
      style={{ backgroundColor: game.primaryColor + 50 }}
    >
      {/* Game Dialog */}
      <GameDialog game={game} />

      {/* bg image */}
      <Image
        src={game.bgImage}
        alt={game.altText}
        width={200}
        height={200}
        unoptimized
        className="top-0 left-0 h-full object-cover w-full absolute opacity-50 blur-sm -z-10"
      />

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
        <Image
          src={game.image}
          alt={game.altText}
          width={200}
          height={200}
          unoptimized
          className="h-full object-contain max-w-[200px] w-full bg-gray-500/50 p-4 rounded-md"
          style={{ backgroundColor: game.primaryColor + 80 }}
        />
        <div className="flex-col flex gap-2">
          <p className="text-lg break-all">{game.tagLine}</p>

          {/* badge */}
          <div className="flex gap-2 items-center">
            <p className="text-sm font-semibold bg-gray-500/50 px-2 rounded-full">
              {game.mostPopular ? "Most Popular" : ""}
            </p>
            <p className="text-sm font-semibold bg-gray-500/50 px-2 rounded-full">
              {game.isActive ? "Active" : "Coming Soon"}
            </p>
          </div>

          <p className="text-sm break-all">{game.description}</p>
        </div>
      </div>
    </div>
  );
};
