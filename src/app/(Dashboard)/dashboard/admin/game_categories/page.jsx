"use client";

import { useEffect, useState } from "react";
import { BiLoader, BiPencil, BiPlus } from "react-icons/bi";
import toast from "react-hot-toast";
import { IoWarning } from "react-icons/io5";
import clsx from "clsx";

import { CategoryDialog } from "../_components/CategoryDialog";
import { fetchCategories } from "@/lib/actions";

const GameCategoriesPage = () => {
  const [categories, setCategories] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [dialogData, setDialogData] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

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
        setCategories(result);
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

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <h1 className="text-xl font-semibold">All Game Categories</h1>

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
        </p>
      )}

      <div className="flex flex-wrap gap-4 justify-between items-center">
        {categories?.length < 1 ? (
          <p className="text-center w-full">
            No categories have been added yet!
          </p>
        ) : (
          !loading &&
          !error &&
          categories?.map((category, index) => (
            <button
              key={index}
              onClick={() => editCategory(category)}
              className="flex justify-between items-end flex-1 min-w-fit flex-wrap-reverse rounded-lg p-2 px-4 bg-gray-500/20 hover:bg-gray-500/30"
            >
              <div className="flex flex-col gap-2 items-start">
                <p className="text-lg font-semibold break-all">
                  {category.name}
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
                  <p className="break-all text-sm">{category.description}</p>
                )}
              </div>
              <BiPencil className="h-8 w-8 ml-2 hover:bg-white/10 rounded-lg p-2" />
            </button>
          ))
        )}
      </div>

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
