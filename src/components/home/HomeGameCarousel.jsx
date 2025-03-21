"use client";

import { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import GameCard from "../GameCard";

export const HomeGameCarousel = ({ data }) => {
  const [centerSlidePercentage, setCenterSlidePercentage] = useState(45); // Default for small screens

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

  return (
    <div>
      {data?.length && (
        <Carousel
          autoPlay={true}
          infiniteLoop={data.length > 1}
          emulateTouch={true}
          interval={3000}
          showStatus={false}
          showIndicators={false}
          centerMode={true}
          showThumbs={false}
          showArrows={false}
          centerSlidePercentage={centerSlidePercentage}
        >
          {data?.map((game) => (
            <div key={game.id} className="scale-90">
              <GameCard game={game} />
            </div>
          ))}
        </Carousel>
      )}
    </div>
  );
};
