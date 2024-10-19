"use client";

import { CheckIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BiLoader, BiMinus, BiPlus } from "react-icons/bi";
import toast from "react-hot-toast";
import { IoWarning } from "react-icons/io5";
import { useRouter } from "next/navigation";

import { fetchGameById } from "@/lib/actions/products-action";
import Badges from "../_components/Badges";
import { useCartStore } from "@/store/use-cart";

const GamePage = ({ params }) => {
  const router = useRouter();

  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(null);

  const { cartItems, addToCart, increaseQuantity, decreaseQuantity } =
    useCartStore();

  useEffect(() => {
    if (game) {
      setSelectedPlatform(game?.platforms[0].id);
    }
  }, [game]);

  const cartItem = game && cartItems.find((item) => item.id === game.id);

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

  const handleAddToCart = () => {
    if (!game) return;

    // only add to cart if game is active
    if (!game.is_active) return;

    const platform_obj = game?.platforms.find(
      (platform) => platform.id === Number(selectedPlatform)
    );

    const product = {
      id: game.id,
      name: game.name,
      price: game.price,
      tax: game.tax,
      platform: platform_obj,
      image: game.image,
      is_active: game.is_active,
      category_id: game.category_id,
      prod_attr_cats: game.prod_attr_cats,
    };

    addToCart(product);
  };

  return (
    <div className="pt-24 max-w-7xl mx-auto min-h-screen p-4">
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
                  priority
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
            <div className="flex flex-col lg:flex-row gap-6 justify-center rounded-xl bg-cover bg-center">
              <div
                className="relative z-10 bg-black/50 rounded-xl h-fit p-8 backdrop-blur-sm"
                style={{ backgroundColor: game.primary_color + 80 }}
              >
                <Image
                  src={game.image || "/game/empty-image.gif"}
                  alt={game.name}
                  quality={100}
                  width={200}
                  height={200}
                  className="w-full max-w-[200px] object-contain mx-auto rounded-md"
                />
              </div>

              <div className="relative z-10 flex flex-col gap-4">
                <p className="text-xs -mb-4 font-semibold">
                  {game.category.name}
                </p>

                <h3 className="text-2xl font-bold">{game.name}</h3>
                <p className="text-lg text-white/80">{game.tag_line}</p>
                <p className="text-sm font-medium max-w-2xl">
                  {game.description}
                </p>

                <ul role="list" className="space-y-2 ms-2">
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

                {/* platform dropdown */}
                <div className="flex flex-wrap justify-between gap-2 items-center">
                  {/* price */}
                  <div className="flex items-center gap-2 text-2xl">
                    <p>Price: </p>
                    <span className="font-bold text-green-500">
                      ${game.price}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 items-center">
                    <p>Platform: </p>
                    <select
                      disabled={cartItem?.quantity > 0}
                      value={selectedPlatform}
                      onChange={(e) => setSelectedPlatform(e.target.value)}
                      className="px-2 py-1 rounded-lg bg-white/10 border border-white/10 hover:border-white/20"
                    >
                      {game.platforms.map((platform) => (
                        <option
                          key={platform.id}
                          value={platform.id}
                          className="bg-neutral-800"
                        >
                          {platform.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {!!game.is_active ? (
                  <div>
                    {cartItem ? (
                      <div className="flex items-center gap-4 w-full">
                        <button
                          onClick={() => decreaseQuantity(game.id)}
                          className="p-2 border border-white/10 bg-white/10 hover:border-white/20 rounded-lg"
                        >
                          <BiMinus className="h-6 w-6" />
                        </button>

                        <span className="text-lg font-bold">
                          {cartItem.quantity}
                        </span>

                        <button
                          onClick={() => increaseQuantity(game.id)}
                          className="p-2 border border-white/10 bg-white/10 hover:border-white/20 rounded-lg"
                        >
                          <BiPlus className="h-6 w-6" />
                        </button>

                        <Link href="/checkout" className="flex-1">
                          <button className="p-2 rounded-lg bg-Gold/90 w-full">
                            Checkout
                          </button>
                        </Link>
                      </div>
                    ) : (
                      <button
                        onClick={handleAddToCart}
                        className="p-2 rounded-lg bg-Gold/90 w-full"
                      >
                        Add to cart
                      </button>
                    )}
                  </div>
                ) : (
                  <p className="text-md mx-4 cursor-wait rounded-md bg-white/20 py-2 text-center italic">
                    Coming Soon
                  </p>
                )}
              </div>
            </div>

            {/* game badges */}
            <div className="flex flex-col gap-y-12">
              <Badges
                categoryId={game.category_id}
                primary_color={game.primary_color}
                secondary_color={game.secondary_color}
                currentGameId={game.id}
              />

              <Badges
                attributeId={game.prod_attr_cats}
                primary_color={game.primary_color}
                secondary_color={game.secondary_color}
                currentGameId={game.id}
              />
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default GamePage;
