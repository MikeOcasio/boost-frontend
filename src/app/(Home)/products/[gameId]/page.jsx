"use client";

import { CheckIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BiLoader, BiMinus, BiPlus, BiTrash } from "react-icons/bi";
import toast from "react-hot-toast";
import { IoWarning } from "react-icons/io5";
import { useRouter } from "next/navigation";

import { fetchGameById } from "@/lib/actions/products-action";
import Badges from "../_components/Badges";
import { useCartStore } from "@/store/use-cart";
import { SliderQty } from "../_components/SliderQty";
import { SubProductsList } from "../_components/SubProductsList";
import Breadcrumb from "@/template-components/ui/breadcrumb/Breadcrumb";
import TrustBox from "@/components/TrustBox";
import Head from "next/head";
import Script from "next/script";

const GamePage = ({ params }) => {
  const router = useRouter();

  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [selectedDropdown, setSelectedDropdown] = useState("");
  const [selectedDropdown2, setSelectedDropdown2] = useState("");
  const [selectedDropdownRange, setSelectedDropdownRange] = useState([]);
  const [selectedSliderRange, setSelectedSliderRange] = useState([]);

  const {
    cartItems,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCartStore();

  useEffect(() => {
    if (game && game.platforms) {
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
        router.push("/products");
      } else {
        if (result.is_dropdown) {
          result.dropdown_options = result.dropdown_options.map((option) => {
            try {
              return JSON.parse(option);
            } catch (error) {
              console.warn("Failed to parse dropdown option:", option, error);
              return {}; // Default empty object in case of parsing error
            }
          });
        }

        if (result.is_slider) {
          result.slider_range = result.slider_range.map((range) => {
            try {
              return JSON.parse(range);
            } catch (error) {
              console.warn("Failed to parse slider range:", range, error);
              return {}; // Default empty object in case of parsing error
            }
          });
        }

        // sort dropdown options by price if dropdown
        if (result.is_dropdown) {
          result.dropdown_options.sort((a, b) => a.price - b.price);
        }

        setGame(result);
      }
    } catch (error) {
      setError(true);
      toast.error("Failed to load game. Please try again!");
      router.push("/products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGame();
  }, []);

  const handleAddToCart = () => {
    if (!game || !game.is_active) return;

    if (
      (game.is_dropdown || game.is_slider) &&
      (!selectedDropdown2 || !selectedDropdown)
    ) {
      toast.error("Please select dropdown options.");
      return;
    }

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
      dropdown_options: selectedDropdownRange,
      starting_point:
        game.dropdown_options[Number(selectedDropdown)] ||
        selectedSliderRange[0],
      ending_point:
        game.dropdown_options[Number(selectedDropdown2)] ||
        selectedSliderRange[selectedSliderRange.length - 1],
      is_dropdown: game.is_dropdown,
      is_slider: game.is_slider,
      slider_range: selectedSliderRange,
    };

    addToCart(product);
  };

  const setDropdownRange = () => {
    const range = game?.dropdown_options.slice(
      Number(selectedDropdown),
      Number(selectedDropdown2) + 1
    );
    setSelectedDropdownRange(range);

    console.log("range", selectedDropdownRange);
  };

  const setSliderRange = () => {
    const range = game?.slider_range.reduce((acc, item) => {
      const { min_quantity, max_quantity, price } = item;

      // Find values within the selected range
      for (let i = min_quantity; i <= max_quantity; i++) {
        if (i >= selectedDropdown && i <= selectedDropdown2) {
          acc.push({ index: i, price });
        }
      }
      return acc;
    }, []);

    setSelectedSliderRange(range);
  };

  // render cart data
  useEffect(() => {
    if (game && cartItem) {
      // starting index
      if (cartItem.is_dropdown) {
        const startingIndex = game.dropdown_options.findIndex(
          (option) => option.option === cartItem.starting_point.option
        );

        // ending index
        const endingIndex = game.dropdown_options?.findIndex(
          (option) => option.option === cartItem.ending_point.option
        );

        setSelectedDropdown(startingIndex);
        setSelectedDropdown2(endingIndex);
        setDropdownRange();
      }

      if (cartItem.is_slider) {
        setSelectedDropdown(cartItem.slider_range[0].index);
        setSelectedDropdown2(
          cartItem.slider_range[cartItem.slider_range.length - 1].index
        );
        setSelectedSliderRange(cartItem.slider_range);
      }
    } else {
      setSelectedDropdown("");
      setSelectedDropdown2("");
      setSelectedSliderRange([]);
      setDropdownRange();
    }
  }, [cartItem, game]);

  const handleDropdownChange = (e) => {
    if (
      game?.dropdown_options?.length - 1 !== Number(e.target.value) ||
      selectedDropdown === ""
    ) {
      setSelectedDropdown2("");
      setSelectedDropdownRange([]);
    }
    setSelectedDropdown(e.target.value);
  };

  const handleDropdown2Change = (e) => {
    if (selectedDropdown2 === "") {
      setSelectedDropdownRange([]);
    }
    setSelectedDropdown2(e.target.value);
  };

  // set drop down range
  useEffect(() => {
    if (selectedDropdown && selectedDropdown2 && game?.dropdown_options) {
      setDropdownRange();
    }
  }, [selectedDropdown, selectedDropdown2, game?.dropdown_options]);

  // set slider range
  useEffect(() => {
    if (selectedDropdown && selectedDropdown2 && game.slider_range) {
      setSliderRange();
    }
  }, [selectedDropdown, selectedDropdown2, game?.slider_range]);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    {
      label: game?.category?.name,
      href: `/products/?search=${game?.category?.name}`,
    },
    ...(game?.parent_id
      ? [
          {
            label: game.parent_name || "Parent Product",
            href: `/products/${game?.parent_id}`,
          },
        ]
      : []),
    { label: game?.name, href: `/products/${game?.id}` },
  ];

  console.log("game data", game);

  return (
    <div className="pt-24 max-w-7xl mx-auto min-h-screen p-4">
      {loading && <BiLoader className="h-8 w-8 animate-spin mx-auto" />}

      {error && (
        <p className="w-fit bg-red-500/50 p-4 rounded-lg mx-auto flex items-center justify-center gap-2">
          <IoWarning className="h-5 w-5 mr-2" />
          Failed to load Game. Please try again!
          {/* reload */}
          <button onClick={loadGame} className="p-2 rounded-lg bg-white/10">
            Reload
          </button>
        </p>
      )}

      {game?.length < 1 ? (
        <p className="w-fit bg-red-500/50 p-4 rounded-lg mx-auto flex items-center justify-center gap-2">
          <IoWarning className="h-5 w-5 mr-2" />
          No products available. Please try again!
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
            <h2 className="text-center text-4xl font-title text-white sm:text-5xl">
              Boost Your Game
            </h2>

            {/* product details */}
            <div className="flex flex-col lg:flex-row gap-6 justify-center rounded-xl bg-cover bg-center">
              <div
                className="relative z-10 bg-black/50 rounded-xl h-fit p-4 backdrop-blur-sm"
                style={{ backgroundColor: game.primary_color + 80 }}
              >
                <Image
                  src={game.image || "/game/empty-image.gif"}
                  alt={game.name}
                  width={200}
                  height={200}
                  priority
                  className="w-full h-auto max-w-[200px] object-contain mx-auto rounded-lg"
                />
              </div>

              <div className="relative z-10 flex flex-col gap-4 flex-1 max-w-3xl">
                <Breadcrumb items={breadcrumbItems} variant="chevron" />

                {/* <p className="text-xs -mb-4 font-semibold">
                  {game.category.name}
                </p> */}

                <h3 className="text-2xl font-bold">{game.name}</h3>
                <p className="text-lg text-white/80">{game.tag_line}</p>
                <p className="text-sm font-medium max-w-2xl">
                  {game.description}
                </p>

                <ul role="list" className="space-y-2 ms-2">
                  {game.features.map((feature, index) => (
                    <li key={index} className="flex gap-x-3">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-green-500"
                        aria-hidden="true"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                {game.price && game.tax && (
                  <>
                    {/* dropdown */}
                    {game.is_dropdown && (
                      <>
                        <p className="text-xs -mb-2">
                          Select starting point and where you want to reach in
                          the game.
                        </p>
                        <div className="flex flex-wrap gap-2 items-center justify-between bg-white/10 border border-white/10 hover:border-white/20 rounded-lg p-2">
                          <select
                            disabled={cartItem?.quantity > 0}
                            value={selectedDropdown}
                            onChange={handleDropdownChange}
                            className="p-2 rounded-lg bg-white/10 border border-white/10 hover:border-white/20 flex-1"
                          >
                            <option value="" className="bg-neutral-800">
                              Starting from?
                            </option>

                            {game.dropdown_options.map((option, index) => (
                              <option
                                key={index}
                                value={index}
                                className="bg-neutral-800"
                              >
                                {option.option}
                              </option>
                            ))}
                          </select>

                          {String(selectedDropdown) &&
                            game?.dropdown_options?.length - 1 !==
                              Number(selectedDropdown) && (
                              <select
                                disabled={
                                  cartItem?.quantity > 0 ||
                                  game?.dropdown_options?.length - 1 ===
                                    Number(selectedDropdown)
                                }
                                value={selectedDropdown2}
                                onChange={handleDropdown2Change}
                                className="p-2 rounded-lg bg-white/10 border border-white/10 hover:border-white/20 flex-1"
                              >
                                <option value="" className="bg-neutral-800">
                                  Where you want to reach?
                                </option>
                                {game.dropdown_options.map(
                                  (option, index) =>
                                    index > selectedDropdown && (
                                      <option
                                        key={index}
                                        value={index}
                                        className="bg-neutral-800"
                                      >
                                        {option.option}
                                      </option>
                                    )
                                )}
                              </select>
                            )}
                        </div>
                      </>
                    )}

                    {game?.is_slider && (
                      <>
                        <p className="text-xs -mb-2">
                          Select the starting point and select the range of the
                          slider where you want to boost.
                        </p>

                        <div className="flex flex-wrap gap-2 items-center justify-between bg-white/10 border border-white/10 hover:border-white/20 rounded-lg p-4">
                          {cartItem ? (
                            (selectedDropdown || selectedDropdown2) && (
                              <SliderQty
                                min={game.slider_range[0].min_quantity}
                                max={
                                  game.slider_range[
                                    game.slider_range.length - 1
                                  ].max_quantity
                                }
                                selectedMin={
                                  selectedDropdown ||
                                  game.slider_range[0].min_quantity
                                }
                                selectedMax={
                                  selectedDropdown2 ||
                                  Math.ceil(
                                    game.slider_range[
                                      game.slider_range.length - 1
                                    ].max_quantity / 2
                                  )
                                }
                                cartItem={cartItem}
                                onChange={({ min, max }) => {
                                  setSelectedDropdown(min);
                                  setSelectedDropdown2(max);
                                }}
                              />
                            )
                          ) : (
                            <SliderQty
                              min={game.slider_range[0].min_quantity}
                              max={
                                game.slider_range[game.slider_range.length - 1]
                                  .max_quantity
                              }
                              selectedMin={
                                selectedDropdown ||
                                game.slider_range[0].min_quantity
                              }
                              selectedMax={
                                selectedDropdown2 ||
                                Math.ceil(
                                  game.slider_range[
                                    game.slider_range.length - 1
                                  ].max_quantity / 2
                                )
                              }
                              onChange={({ min, max }) => {
                                setSelectedDropdown(min);
                                setSelectedDropdown2(max);
                              }}
                            />
                          )}
                        </div>
                      </>
                    )}

                    {/* platform dropdown */}
                    <div className="flex flex-wrap justify-between gap-2 items-center">
                      {/* price */}
                      <p>Price: </p>
                      <div className="flex items-center gap-2 text-2xl flex-1">
                        <span className="font-bold text-green-500">
                          ${/* dropdown price */}
                          {game?.is_dropdown &&
                            (selectedDropdownRange?.length > 0
                              ? selectedDropdownRange
                                  .reduce((acc, curr) => acc + curr.price, 0)
                                  .toFixed(2)
                              : game.price)}
                          {/* slider price */}
                          {game?.is_slider &&
                            (selectedSliderRange?.length > 0
                              ? selectedSliderRange
                                  .reduce((acc, curr) => acc + curr.price, 0)
                                  .toFixed(2)
                              : game.price)}
                          {/* game price */}
                          {!game?.is_slider && !game?.is_dropdown && game.price}
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
                            {!(game.is_slider || game.is_dropdown) && (
                              <>
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
                              </>
                            )}

                            {(game.is_dropdown || game.is_slider) && (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => removeFromCart(game.id)}
                                  className="p-1 border border-white/10 bg-white/10 hover:border-white/20 rounded-md"
                                >
                                  <BiTrash className="h-5 w-5 text-red-600" />
                                </button>
                              </div>
                            )}

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
                  </>
                )}

                {/* Trustpilot Widget */}
                {/* <div
                  className="trustpilot-widget"
                  data-locale="en-US"
                  // data-template-id="5419b6a8b0d04a076446a9ad"
                  // data-businessunit-id="Se8Pwtz3B7Secf3w"
                  // data-style-height="24px"
                  // data-style-width="100%"
                  // data-theme="light"
                  data-template-id="5419b6ffb0d04a076446a9af"
                  data-businessunit-id="5c9df8263ff4c4000185ea05"
                  data-style-height="24px"
                  data-sku="PBC2"
                  data-no-reviews="hide"
                  data-scroll-to-list="true"
                >
                  <a
                    href="https://www.trustpilot.com/review/ravenboost.com"
                    target="_blank"
                    rel="noopener"
                  >
                    Trustpilot
                  </a>
                </div>

                <Script
                  type="text/javascript"
                  src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
                  async
                ></Script>

                <TrustBox /> */}
              </div>
            </div>

            {/* sub products list */}
            {game.children?.length > 0 && <SubProductsList game={game} />}

            {/* game badges */}
            <div className="flex flex-col gap-y-12">
              <Badges
                categoryId={game.category_id}
                categoryName={game.category?.name}
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
