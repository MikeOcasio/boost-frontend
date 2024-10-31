"use client";

import { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import GameCard from "../GameCard";
import clsx from "clsx";

export const HomeGameCarousel = ({ data }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [centerSlidePercentage, setCenterSlidePercentage] = useState(100); // Default for small screens

  useEffect(() => {
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
    <div className="h-fit">
      {data?.length && (
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
            <div key={game.id} className="flex justify-center w-full h-full">
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
      )}
    </div>
  );
};
