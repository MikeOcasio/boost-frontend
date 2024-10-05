"use client";

import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { BiLoader } from "react-icons/bi";
import { IoWarning } from "react-icons/io5";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

import {
  fetchProductByAttribute,
  fetchProductByCategories,
} from "@/lib/actions";
import RelatedGameCard from "./RelatedGameCard";

const Badges = ({
  categoryId,
  attributeId,
  primary_color,
  secondary_color,
  currentGameId,
}) => {
  const [productCategories, setProductCategories] = useState([]);
  const [productAttribute, setProductAttribute] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const scrollContainerRef = useRef(null);

  const loadCategories = async () => {
    try {
      const result = await fetchProductByCategories(categoryId);
      if (result.error) {
        setError(true);
        toast.error(result.error);
      } else {
        // Filter out the current game from the categories list
        const filteredCategories = result.filter(
          (game) => game.id !== currentGameId
        );

        setProductCategories(filteredCategories);
      }
    } catch (error) {
      setError(true);
      toast.error("Failed to load badges. Please try again!");
    }
  };

  const loadAttribute = async () => {
    try {
      const result = await fetchProductByAttribute(attributeId);
      if (result.error) {
        setError(true);
        toast.error(result.error);
      } else {
        // Filter out the current game from the attributes list
        const filteredAttributes = result.filter(
          (game) => game.id !== currentGameId
        );

        setProductAttribute(filteredAttributes);
      }
    } catch (error) {
      setError(true);
      toast.error("Failed to load badges. Please try again!");
    }
  };

  const loadRelatedGames = async () => {
    setLoading(true);
    setError(false);

    if (categoryId) loadCategories();

    if (attributeId) loadAttribute();

    setLoading(false);
  };

  useEffect(() => {
    loadRelatedGames();
  }, []);

  // Scroll left function
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  // Scroll right function
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-6 relative">
      {loading && <BiLoader className="h-8 w-8 animate-spin mx-auto" />}

      {error && (
        <p className="w-fit bg-red-500/50 p-4 rounded-lg mx-auto flex items-center justify-center gap-2">
          <IoWarning className="h-5 w-5 mr-2" />
          Failed to load {categoryId ? "categories" : "attributes"}. Please try
          again!
        </p>
      )}

      {!loading &&
        !error &&
        (productCategories?.length > 0 || productAttribute?.length > 0) && (
          <div className="space-y-4 border-t border-white/10 pt-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <h3 className="text-lg font-semibold">
                {categoryId ? "Recommendations" : "Similar Products"}
              </h3>

              <div className="flex items-center gap-4 w-fit">
                {/* Left Scroll Button */}
                <button
                  onClick={scrollLeft}
                  className="z-10 bg-white/10 border-white/10 border rounded-full p-2 hover:border-white/20"
                >
                  <MdChevronLeft className="h-6 w-6" />
                </button>

                {/* Right Scroll Button */}
                <button
                  onClick={scrollRight}
                  className="z-10 bg-white/10 border-white/10 border rounded-full p-2 hover:border-white/20"
                >
                  <MdChevronRight className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Scrollable Game Cards */}
            <div
              ref={scrollContainerRef}
              className="flex h-full gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar"
            >
              {categoryId
                ? productCategories?.map((game, index) => (
                    <RelatedGameCard
                      key={game.id}
                      index={index}
                      game={game}
                      primary_color={primary_color}
                      secondary_color={secondary_color}
                    />
                  ))
                : productAttribute?.map((game, index) => (
                    <RelatedGameCard
                      key={game.id}
                      index={index}
                      game={game}
                      primary_color={primary_color}
                      secondary_color={secondary_color}
                    />
                  ))}
            </div>
          </div>
        )}
    </div>
  );
};

export default Badges;
