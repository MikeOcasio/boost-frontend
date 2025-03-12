"use client";

import { useEffect, useMemo, useState } from "react";
import { BiLoader, BiPencil, BiPlus } from "react-icons/bi";
import toast from "react-hot-toast";
import { IoWarning } from "react-icons/io5";
import clsx from "clsx";

import { CategoryDialog } from "../_components/CategoryDialog";
import { fetchCategories } from "@/lib/actions/categories-actions";
import Image from "next/image";

// Helper function to highlight matching terms
const highlightMatch = (text, searchTerm) => {
  if (!searchTerm) return text; // If no search term, return the original text
  const regex = new RegExp(`(${searchTerm})`, "gi"); // Case-insensitive match
  const parts = text.split(regex); // Split the text into matching and non-matching parts

  return parts.map((part, index) =>
    regex.test(part) ? <mark key={index}>{part}</mark> : part
  );
};

const GameCategoriesPage = () => {
  const [categories, setCategories] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [dialogData, setDialogData] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  // Fetch categories from API
  const loadCategories = async () => {
    setLoading(true);
    setError(false);

    try {
      const result = await fetchCategories();

      if (result.error) {
        setError(true);
        toast.error(result.error);
      } else {
        // sort to newest first
        const sortedCategories = result.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        setCategories(sortedCategories);
      }
    } catch (e) {
      setError(true);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Open dialog for new category
  const newCategory = () => {
    setDialogData(null);
    setDialogOpen(true);
  };

  // Open dialog to edit an existing category
  const editCategory = (category) => {
    setDialogData(category);
    setDialogOpen(true);
  };

  // Helper function: Normalize strings (remove extra spaces and convert to lowercase)
  const normalize = (str) => str?.toLowerCase().replace(/\s+/g, "").trim();

  // Filter and search logic
  const filteredCategories = useMemo(() => {
    const term = normalize(searchTerm);

    return categories?.filter((category) => {
      return (
        !term ||
        normalize(category.name).includes(term) ||
        normalize(category.description).includes(term) ||
        normalize(String(category.id)).includes(term)
      );
    });
  }, [categories, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <h1 className="text-xl font-semibold">
          All Games ({categories?.length})
        </h1>

        <button
          onClick={newCategory}
          disabled={loading}
          className="bg-Gold/60 hover:bg-Gold/80 border border-black rounded-lg p-2 flex items-center justify-center gap-2 w-fit mt-6 backdrop-blur-sm disabled:bg-gray-500/20"
        >
          <BiPlus className="h-5 w-5" />
          New Category
        </button>
      </div>

      {loading && <BiLoader className="h-8 w-8 animate-spin mx-auto" />}

      {error && (
        <p className="w-fit bg-red-500/50 p-4 rounded-lg mx-auto flex items-center justify-center gap-2">
          <IoWarning className="h-5 w-5 mr-2" />
          Failed to load categories. Please try again!
          {/* reload */}
          <button
            onClick={loadCategories}
            className="p-2 rounded-lg bg-white/10"
          >
            Reload
          </button>
        </p>
      )}

      {!loading && !error && categories?.length < 1 ? (
        <p className="text-center w-full">No users have been added yet!</p>
      ) : (
        categories?.length > 0 && (
          <>
            <div className="flex flex-wrap items-center gap-6">
              <input
                type="text"
                autoFocus
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search users..."
                className="flex-1 min-w-fit p-2 rounded-lg bg-white/10 border border-white/10 hover:border-white/20"
              />
            </div>

            <div className="flex flex-wrap gap-6 justify-between items-center">
              {!loading && !error && categories?.length < 1 ? (
                <p className="text-center w-full">
                  No categories have been added yet!
                </p>
              ) : (
                filteredCategories?.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => editCategory(category)}
                    className="flex justify-between items-end flex-1 min-w-fit flex-wrap-reverse rounded-2xl p-4 bg-gray-500/20 hover:bg-gray-500/30 relative overflow-hidden group"
                  >
                    <Image
                      src={category.image || "/images/shape/grid-01.svg"}
                      alt={category.name}
                      fill
                      className="absolute top-0 left-0 w-full h-full object-cover -z-20 opacity-70 group-hover:scale-125 transition-all duration-500"
                    />
                    <div className="absolute left-0 bottom-0 w-full h-[100%] bg-gradient-to-t from-black to-transparent rounded-lg -z-10" />

                    <div className="flex flex-col gap-2 items-start">
                      <p className="text-lg font-semibold break-all">
                        {highlightMatch(category.name, searchTerm)}
                      </p>
                      <p
                        className={clsx(
                          "text-xs font-semibold px-2 rounded-full",
                          category.is_active ? "bg-green-500" : "bg-gray-500"
                        )}
                      >
                        {category.is_active ? "Active" : "Inactive"}
                      </p>
                      {category.description && (
                        <p className="break-all text-sm">
                          {highlightMatch(category.description, searchTerm)}
                        </p>
                      )}

                      {/* created at */}
                      <p className="text-xs font-semibold">
                        Created at:{" "}
                        {category.created_at
                          ? new Intl.DateTimeFormat("en-US", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            }).format(new Date(category.created_at))
                          : "Not set"}
                      </p>
                    </div>
                    <BiPencil className="h-8 w-8 ml-auto hover:bg-white/10 rounded-lg p-2" />
                  </button>
                ))
              )}
            </div>
          </>
        )
      )}

      {/* Dialog Component */}
      <CategoryDialog
        dialogData={dialogData}
        dialogOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        loadCategories={loadCategories}
      />
    </div>
  );
};

export default GameCategoriesPage;
