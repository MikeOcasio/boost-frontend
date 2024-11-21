"use client";

import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { BiLoader, BiPencil, BiPlus } from "react-icons/bi";
import { IoWarning } from "react-icons/io5";

import { PromotionDialog } from "../_components/PromotionDialog";
import { fetchAllPromotions } from "@/lib/actions/promotions-action";

// Helper function to highlight matching terms
const highlightMatch = (text, searchTerm) => {
  if (!searchTerm) return text; // If no search term, return the original text
  const regex = new RegExp(`(${searchTerm})`, "gi"); // Case-insensitive match
  const parts = text.split(regex); // Split the text into matching and non-matching parts

  return parts.map((part, index) =>
    regex.test(part) ? <mark key={index}>{part}</mark> : part
  );
};

const PromotionsPage = () => {
  const [promotions, setPromotions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [dialogData, setDialogData] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const loadPromotions = async () => {
    setLoading(true);
    setError(false);

    try {
      const response = await fetchAllPromotions();

      if (response.error) {
        setError(true);
        toast.error(result.error);
      } else {
        // sort Promotions by created_at
        const sortedPromotions = response.sort((a, b) => {
          return new Date(b.created_at) - new Date(a.created_at);
        });

        setPromotions(sortedPromotions);
      }
    } catch (error) {
      toast.error("Failed to load promotions. Please try again!");
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPromotions();
  }, []);

  // Helper function: Normalize strings (remove extra spaces and convert to lowercase)
  const normalize = (str) => str?.toLowerCase().replace(/\s+/g, "").trim();

  // Filter and search logic
  const filteredPromotions = useMemo(() => {
    const term = normalize(searchTerm);

    return promotions?.filter((promotion) => {
      return (
        !term ||
        normalize(String(promotion.id)).includes(term) ||
        normalize(String(promotion.code)).includes(term) ||
        normalize(String(promotion.discount_percentage)).includes(term)
      );
    });
  }, [promotions, searchTerm]);

  const editPromotion = (promotion) => {
    setDialogData(promotion);
    setDialogOpen(true);
  };

  const newPromotion = () => {
    setDialogData(null);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <h1 className="text-xl font-semibold">
          All promotions ({promotions?.length})
        </h1>

        <button
          onClick={newPromotion}
          disabled={loading}
          className="bg-Gold/60 hover:bg-Gold/80 border border-black rounded-lg p-2 flex items-center justify-center gap-2 w-fit mt-6 backdrop-blur-sm disabled:bg-gray-500/20"
        >
          <BiPlus className="h-5 w-5" />
          New Promotion
        </button>
      </div>

      {loading && <BiLoader className="h-8 w-8 animate-spin mx-auto" />}

      {error && (
        <p className="w-fit bg-red-500/50 p-4 rounded-lg mx-auto flex items-center justify-center gap-2">
          <IoWarning className="h-5 w-5 mr-2" />
          Failed to load promotions. Please try again!
          {/* reload */}
          <button
            onClick={loadPromotions}
            className="p-2 rounded-lg bg-white/10"
          >
            Reload
          </button>
        </p>
      )}

      {!loading && !error && promotions?.length < 1 ? (
        <p className="text-center w-full">No promotions have been added yet!</p>
      ) : (
        promotions?.length > 0 && (
          <>
            <div className="flex flex-wrap items-center gap-4">
              <input
                type="text"
                autoFocus
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search promotions..."
                className="flex-1 min-w-fit p-2 rounded-lg bg-white/10 border border-white/10 hover:border-white/20"
              />
            </div>

            <div className="flex flex-wrap gap-4 justify-between">
              {!loading && !error && promotions?.length < 1 ? (
                <p className="text-center w-full">
                  No promotions have been added yet!
                </p>
              ) : (
                filteredPromotions?.map((promo, index) => (
                  <button
                    key={index}
                    onClick={() => editPromotion(promo)}
                    className="flex justify-between items-end flex-1 min-w-fit flex-wrap-reverse rounded-lg p-2 px-4 bg-gray-500/20 hover:bg-gray-500/30"
                  >
                    <div className="space-y-2 text-start">
                      <p className="text-xs font-semibold">
                        Promotions ID:{" "}
                        {highlightMatch(String(promo.id), searchTerm)}
                      </p>

                      <p className="text-xs font-semibold">
                        Code:{" "}
                        <code className="border border-white/10 rounded-md px-2 py-1 bg-white/5">
                          {highlightMatch(promo.code, searchTerm)}
                        </code>
                      </p>

                      <p className="text-xs font-semibold">
                        Discount percentage:{" "}
                        {highlightMatch(promo.discount_percentage, searchTerm)}%
                      </p>

                      <div className="flex flex-col gap-2 border border-white/10 rounded-lg p-2 bg-white/5">
                        <p className="text-xs font-semibold">
                          From (Start Date) :{" "}
                          {promo.start_date
                            ? new Intl.DateTimeFormat("en-US", {
                                dateStyle: "medium",
                                timeStyle: "short",
                              }).format(new Date(promo.start_date))
                            : "Not set"}
                        </p>

                        <p className="text-xs font-semibold">
                          Till (End Date) :{" "}
                          {promo.end_date
                            ? new Intl.DateTimeFormat("en-US", {
                                dateStyle: "medium",
                                timeStyle: "short",
                              }).format(new Date(promo.end_date))
                            : "Not set"}
                        </p>
                      </div>

                      {/* created at */}
                      <p className="text-xs font-semibold">
                        Created at:{" "}
                        {promo.created_at
                          ? new Intl.DateTimeFormat("en-US", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            }).format(new Date(promo.created_at))
                          : "Not set"}
                      </p>
                    </div>
                    <BiPencil className="h-8 w-8 ml-2 hover:bg-white/10 rounded-lg p-2" />
                  </button>
                ))
              )}
            </div>
          </>
        )
      )}

      {/* Dialog Component */}
      <PromotionDialog
        dialogData={dialogData}
        dialogOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        loadPromotions={loadPromotions}
      />
    </div>
  );
};

export default PromotionsPage;
