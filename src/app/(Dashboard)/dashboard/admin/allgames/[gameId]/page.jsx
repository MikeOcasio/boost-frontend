"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { BiLoader, BiPencil, BiPlus, BiUpload } from "react-icons/bi";
import { IoWarning } from "react-icons/io5";

import { fetchGameById, updateGame } from "@/lib/actions/products-action";
import { EditGame } from "../../_components/EditGame";
import { SubProductDialog } from "../../_components/SubProductDialog";
import Link from "next/link";
import { FaExternalLinkAlt } from "react-icons/fa";
import { AdminSubProducts } from "../../_components/AdminSubProducts";

const GameEditPage = ({ params }) => {
  const { gameId } = params;
  const router = useRouter();

  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [missingFields, setMissingFields] = useState([]);

  // Sub product dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showSubProducts, setShowSubProducts] = useState(false);

  const fetchGames = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const response = await fetchGameById(gameId);

      if (response.error) {
        setError(true);
        toast.error(response.error);
      } else {
        const platformArr = response?.platforms?.map((platform) => platform.id);

        const dropdownOptions = response?.dropdown_options?.map((option) => {
          try {
            return option && JSON.parse(option);
          } catch (error) {
            console.warn("Failed to parse dropdown option:", option, error);
            return {}; // Default empty object in case of parsing error
          }
        });

        const sliderRanges = response?.slider_range?.map((range) => {
          try {
            return range && JSON.parse(range);
          } catch (error) {
            console.warn("Failed to parse slider range:", range, error);
            return {}; // Default empty object in case of parsing error
          }
        });

        setGame({
          ...response,
          platform_ids: platformArr,
          dropdown_options: dropdownOptions,
          slider_range: sliderRanges,
        });
      }
    } catch (error) {
      setError(true);
      toast.error("Failed to fetch product data.");
    } finally {
      setLoading(false);
    }
  }, [gameId]);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  const validateGame = () => {
    const errors = [];

    if (!game?.name) errors.push("Product name is missing");
    if (!game?.description) errors.push("Product description is missing");
    if (!game?.category_id) errors.push("Product category is missing");
    if (!game?.prod_attr_cats.length)
      errors.push("Select at least one attribute");
    if (game?.is_priority === null) errors.push("Product priority is missing");
    if (!game?.platform_ids.length) errors.push("At least one platform");
    if (game?.is_active === null)
      errors.push("Product active status is missing");
    if (game?.most_popular === null)
      errors.push("Most popular status is missing");
    if (!game?.tag_line) errors.push("Product tag line is empty");
    if (!game?.primary_color) errors.push("Primary color is missing");
    if (!game?.secondary_color) errors.push("Secondary color is missing");

    if (game?.features?.length === 0) {
      errors.push("At least one product feature");
    }
    if (game?.features?.length) {
      game.features.forEach((feature, index) => {
        if (!feature) errors.push(`Feature ${index + 1} is empty`);
      });
    }

    // dropdown and slider are not required but if they are present, they must have at least one option also the values must be valid not empty
    if (game?.is_dropdown && !game?.dropdown_options?.length) {
      errors.push("At least one dropdown option");
    }
    if (game?.is_dropdown && game?.dropdown_options?.length) {
      game.dropdown_options.forEach((option, index) => {
        if (!option.option)
          errors.push(`Dropdown option ${index + 1} is empty`);
        if (!option.price)
          errors.push(`Dropdown option ${index + 1} has no price`);
      });
    }

    if (game?.is_slider && !game?.slider_range?.length) {
      errors.push("At least one slider option");
    }
    if (game?.is_slider && game?.slider_range?.length) {
      game.slider_range.forEach((range, index) => {
        if (!range.min_quantity)
          errors.push(`Slider option ${index + 1} has no min quantity`);
        if (!range.max_quantity)
          errors.push(`Slider option ${index + 1} has no max quantity`);
        if (!range.price)
          errors.push(`Slider option ${index + 1} has no price`);
      });
    }

    setMissingFields(errors);
    return errors.length === 0;
  };

  const handleUpdateGame = async () => {
    if (!validateGame()) return;

    // show warning if there is no price and tax
    if (!game?.price && !game?.tax) {
      const confirmed = confirm(
        "Are you sure you want to create this product without a price and tax? Recommended for folders/warper only."
      );

      if (!confirmed) return;
    }

    // stingfy dropdown and slider ranges object and make the array of stingified objects
    const dropdownOptions = game?.dropdown_options?.map((option) => {
      return JSON.stringify(option);
    });
    const sliderRanges = game?.slider_range?.map((range) => {
      return JSON.stringify(range);
    });

    setLoading(true);
    try {
      const response = await updateGame(
        {
          ...game,
          dropdown_options: dropdownOptions,
          slider_range: sliderRanges,
        },
        gameId
      );

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Product updated successfully!");

        router.push("/dashboard/admin/allgames");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubProduct = () => {
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <h1 className="text-xl font-semibold">Edit Product</h1>

        <button
          onClick={handleUpdateGame}
          disabled={loading}
          className="bg-Gold hover:bg-Gold/80 border border-black rounded-lg p-2 flex items-center justify-center gap-2 w-fit backdrop-blur-sm"
        >
          {loading ? (
            <BiLoader className="h-5 w-5 animate-spin" />
          ) : (
            <BiUpload className="h-5 w-5" />
          )}
          Update Product
        </button>
      </div>

      {loading && <BiLoader className="h-8 w-8 animate-spin mx-auto" />}

      {error && (
        <div className="w-fit bg-red-500/50 p-4 rounded-lg mx-auto flex items-center justify-center gap-2">
          <IoWarning className="h-5 w-5 mr-2" />
          <span>Failed to load Product. Please try again!</span>
          {/* reload */}
          <button
            onClick={() => fetchGames()}
            className="p-2 rounded-lg bg-white/10"
          >
            Reload
          </button>
        </div>
      )}

      {/* Show missing fields if any */}
      {missingFields.length > 0 && (
        <div className="bg-red-100/10 text-red-600 p-4 rounded-lg">
          <h2 className="font-semibold">Please fill the following fields:</h2>
          <ul className="list-disc list-inside">
            {missingFields.map((field, index) => (
              <li key={index}>{field}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Show message if no game found */}
      {!loading && !error && !game && (
        <p className="text-center text-gray-500">
          No product found for the given ID.
        </p>
      )}

      {!loading && !error && game ? (
        <div className="flex flex-col gap-4">
          {/* Add sub product */}
          <div className="flex flex-wrap items-center gap-2">
            {game.parent_id && (
              <>
                <Link
                  href={`/dashboard/admin/allgames/${game.parent_id}`}
                  target="_blank"
                  className="flex flex-wrap justify-center items-center gap-2 rounded-lg p-2 hover:bg-Gold/50 border border-Gold text-Gold hover:text-white flex-1"
                >
                  <BiPencil className="h-5 w-5" />
                  <p className="text-sm">Edit parent</p>
                </Link>

                <Link
                  href={`/products/${game.parent_id}`}
                  target="_blank"
                  className="flex flex-wrap justify-center items-center gap-2 rounded-lg p-2 hover:bg-Gold/50 border border-Gold text-Gold hover:text-white flex-1"
                >
                  <FaExternalLinkAlt className="h-5 w-5" />
                  <p className="text-sm">View parent</p>
                </Link>
              </>
            )}

            {/* add sub product */}
            <button
              onClick={handleSubProduct}
              className="flex flex-wrap justify-center items-center gap-2 rounded-lg p-2 hover:bg-Gold/50 border border-Gold text-Gold hover:text-white flex-1"
            >
              <BiPlus className="h-5 w-5" />
              <p className="text-sm">Add Sub Product</p>
            </button>
          </div>

          {/* sub products List */}
          <AdminSubProducts game={game} />

          <EditGame data={game} setData={setGame} />
        </div>
      ) : (
        !loading &&
        !error && <BiLoader className="h-8 w-8 animate-spin mx-auto" />
      )}

      <SubProductDialog
        dialogOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        dialogData={game}
        fetchGame={fetchGames}
      />
    </div>
  );
};

export default GameEditPage;
