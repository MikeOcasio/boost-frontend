"use client";

import { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import GameCard from "../GameCard";
import clsx from "clsx";
import { IoWarning } from "react-icons/io5";
import { BiLoader } from "react-icons/bi";
import toast from "react-hot-toast";
import { fetchAllGames } from "@/lib/actions/products-action";

export const HomeGameCarousel = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [centerSlidePercentage, setCenterSlidePercentage] = useState(100); // Default for small screens

  const loadGames = async () => {
    setLoading(true);
    setError(false);

    try {
      const result = await fetchAllGames();
      if (result.error) {
        setError(true);
        toast.error(result.error);
      } else {
        const popularGames = result.filter(
          (game) => game.is_active && game.most_popular
        );
        setData(popularGames);
      }
    } catch (error) {
      setError(true);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGames();

    // Adjust slides displayed based on screen size
    const updateSlidePercentage = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth >= 1024) {
        // Large screens (show 3 cards)
        setCenterSlidePercentage(33.33);
      } else if (screenWidth >= 768) {
        // Medium screens (show 2 cards)
        setCenterSlidePercentage(50);
      } else {
        // Small screens (show 1 card)
        setCenterSlidePercentage(100);
      }
    };

    updateSlidePercentage(); // Initial update
    window.addEventListener("resize", updateSlidePercentage); // Update on resize

    return () => {
      window.removeEventListener("resize", updateSlidePercentage); // Cleanup
    };
  }, []);

  const handleChange = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="mx-auto px-4 lg:max-w-7xl lg:-mt-[110vh] -mt-[90vh]">
      {loading && <BiLoader className="h-8 w-8 animate-spin mx-auto" />}

      {error && (
        <p className="w-fit bg-red-500/50 p-4 rounded-lg mx-auto flex items-center justify-center gap-2">
          <IoWarning className="h-5 w-5 mr-2" />
          Failed to load games. Please try again!
          {/* reload page */}
          <button onClick={loadGames} className="bg-white/10 p-2 rounded-lg">
            Reload
          </button>
        </p>
      )}

      {!loading &&
        !error &&
        (data?.length < 1 ? (
          <p className="w-full">No games found!</p>
        ) : (
          data?.length > 0 && (
            <Carousel
              autoPlay={true}
              infiniteLoop={true}
              emulateTouch={true}
              onChange={handleChange}
              interval={3000}
              showStatus={false}
              showIndicators={false}
              centerMode={true}
              showThumbs={false}
              centerSlidePercentage={centerSlidePercentage}
            >
              {data?.map((game, index) => (
                <div
                  key={game.id}
                  className="flex justify-center w-full h-full"
                >
                  <div
                    className={clsx(
                      "h-full w-full duration-500 ease-in-out scale-90 flex-1",
                      index === currentIndex && "scale-95"
                    )}
                  >
                    <GameCard game={game} />
                  </div>
                </div>
              ))}
            </Carousel>
          )
        ))}
    </div>
  );
};
