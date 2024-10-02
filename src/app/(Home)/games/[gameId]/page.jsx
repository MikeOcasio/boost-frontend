"use client";

import { CheckIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BiLoader } from "react-icons/bi";
import toast from "react-hot-toast";
import { IoWarning } from "react-icons/io5";
import { useRouter } from "next/navigation";

import { fetchGameById } from "@/lib/actions";
import Badges from "../_components/Badges";

const GamePage = ({ params }) => {
  const router = useRouter();

  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const loadGame = async () => {
    setLoading(true);
    setError(false);

    try {
      const result = await fetchGameById(params.gameId);
      if (result.error) {
        setError(true);
        toast.error(result.error);
        router.push("/games");
      } else {
        setGame(result);
      }
    } catch (error) {
      setError(true);
      toast.error("Failed to load game. Please try again!");
      router.push("/games");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGame();
  }, []);

  return (
    <div className="mt-24 max-w-7xl mx-auto min-h-screen p-4">
      {loading && <BiLoader className="h-8 w-8 animate-spin mx-auto" />}

      {error && (
        <p className="w-fit bg-red-500/50 p-4 rounded-lg mx-auto flex items-center justify-center gap-2">
          <IoWarning className="h-5 w-5 mr-2" />
          Failed to load Game. Please try again!
        </p>
      )}

      {game?.length < 1 ? (
        <p className="w-fit bg-red-500/50 p-4 rounded-lg mx-auto flex items-center justify-center gap-2">
          <IoWarning className="h-5 w-5 mr-2" />
          No Games Available. Please try again!
        </p>
      ) : (
        !loading &&
        !error &&
        game && (
          <div className="space-y-6">
            {/* Background Image */}
            <div className="left-0 fixed top-0 -z-10 h-full w-full">
              {game.bg_image && (
                <Image
                  src={game.bg_image}
                  alt={game.name}
                  fill
                  unoptimized
                  className="h-full w-full fixed top-0 object-cover -z-10 blur-sm"
                />
              )}
              <div className="absolute inset-0 bg-black opacity-40 -z-10" />
            </div>

            {/* boost game */}
            <h2 className="text-center text-4xl font-title text-white sm:text-5xl dark:text-white">
              Boost Your Game
            </h2>

            {/* product details */}
            <div className="flex flex-col lg:flex-row gap-6 justify-center p-8 rounded-xl bg-cover bg-center">
              <div
                className="relative z-10 bg-black/50 rounded-xl h-fit p-8 backdrop-blur-sm"
                style={{ backgroundColor: game.primary_color + 80 }}
              >
                <Image
                  src={game.image}
                  alt={game.name}
                  quality={100}
                  width={200}
                  height={200}
                  className="h-full w-full max-w-[200px] object-contain mx-auto"
                />
              </div>
              <div className="relative z-10 flex flex-col gap-4">
                <h3 className="text-2xl font-bold">{game.name}</h3>
                <p className="text-lg text-gray-300">{game.tag_line}</p>
                <p className="text-sm font-medium max-w-2xl">
                  {game.description}
                </p>

                <ul role="list" className="space-y-3">
                  {game.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-green-500"
                        aria-hidden="true"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                {!!game.is_active ? (
                  <button
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: game.secondary_color + 80 }}
                  >
                    Add to cart
                  </button>
                ) : (
                  <p className="text-md mx-4 cursor-wait rounded-md bg-white/20 py-2 text-center italic">
                    Coming Soon
                  </p>
                )}
              </div>
            </div>

            <hr className="border-white/10 w-full" />

            {/* game badges */}
            <div className="flex flex-col gap-y-12">
              <Badges categoryId={game.category_id} />

              <hr className="border-white/10 w-full" />

              <Badges attributeId={game.product_attribute_category_id} />
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default GamePage;
