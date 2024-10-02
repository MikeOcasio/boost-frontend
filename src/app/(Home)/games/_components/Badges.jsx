"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiLoader } from "react-icons/bi";
import { IoWarning } from "react-icons/io5";

import {
  fetchProductByAttribute,
  fetchProductByCategories,
} from "@/lib/actions";
import RelatedGameCard from "./RelatedGameCard";

const Badges = ({ categoryId, attributeId }) => {
  const [productCategories, setProductCategories] = useState([]);
  const [productAttribute, setProductAttribute] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const loadCategories = async () => {
    try {
      const result = await fetchProductByCategories(categoryId);
      if (result.error) {
        setError(true);
        toast.error(result.error);
      } else {
        setProductCategories(result);
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
        setProductAttribute(result);
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

  return (
    <div className="space-y-6">
      {loading && <BiLoader className="h-8 w-8 animate-spin mx-auto" />}

      {error && (
        <p className="w-fit bg-red-500/50 p-4 rounded-lg mx-auto flex items-center justify-center gap-2">
          <IoWarning className="h-5 w-5 mr-2" />
          Failed to load {categoryId ? "categories" : "attributes"}. Please try
          again!
        </p>
      )}
      {!loading && !error && (
        <div className="space-y-4 ">
          <h3 className="text-lg font-semibold">
            {categoryId ? "Recommendations" : "Similar Products"}
          </h3>

          <div className="gap-12 flex items-center max-w-[500px] mx-auto">
            {categoryId
              ? productCategories?.map((game) => (
                  <RelatedGameCard key={game.id} game={game} />
                ))
              : productAttribute?.map((game) => (
                  <RelatedGameCard key={game.id} game={game} />
                ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Badges;
