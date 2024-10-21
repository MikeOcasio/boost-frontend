"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { BiLoader, BiUpload } from "react-icons/bi";
import { IoWarning } from "react-icons/io5";

import { fetchGameById, updateGame } from "@/lib/actions/products-action";
import { EditGame } from "../../_components/EditGame";

const GameEditPage = ({ params }) => {
  const { gameId } = params;
  const router = useRouter();

  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [missingFields, setMissingFields] = useState([]);

  const fetchGames = async () => {
    setLoading(true);
    setError(false);

    try {
      const response = await fetchGameById(gameId);

      if (response.error) {
        setError(true);
        toast.error(response.error);
      } else {
        const platformArr = response.platforms.map((platform) => platform.id);

        setGame({
          ...response,
          platform_ids: platformArr,
        });
      }
    } catch (error) {
      setError(true);
      toast.error("Failed to fetch product data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const validateGame = () => {
    const errors = [];

    if (!game?.name) errors.push("Product name");
    if (!game?.description) errors.push("Product description");
    if (!game?.price) errors.push("Product price");
    if (!game?.category_id) errors.push("Product category");
    if (!game?.prod_attr_cats.length) errors.push("Product attribute category");
    if (game?.is_priority === null) errors.push("Product priority");
    if (!game?.tax) errors.push("Product tax");
    if (!game?.platform_ids.length) errors.push("At least one platform");
    if (game?.is_active === null) errors.push("Product active status");
    if (game?.most_popular === null) errors.push("Most popular status");
    if (!game?.tag_line) errors.push("Product tag line");
    if (!game?.primary_color) errors.push("Primary color");
    if (!game?.secondary_color) errors.push("Secondary color");
    if (game?.features?.length === 0)
      errors.push("At least one product feature");

    setMissingFields(errors);
    return errors.length === 0;
  };

  const handleUpdateGame = async () => {
    if (!validateGame()) return;

    setLoading(true);
    try {
      const response = await updateGame(game, gameId);

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

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <h1 className="text-xl font-semibold">Edit Product</h1>

        <button
          onClick={handleUpdateGame}
          disabled={loading}
          className="bg-Gold/60 hover:bg-Gold/80 border border-black rounded-lg p-2 flex items-center justify-center gap-2 w-fit backdrop-blur-sm"
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
        <EditGame data={game} setData={setGame} />
      ) : (
        !loading &&
        !error && <BiLoader className="h-8 w-8 animate-spin mx-auto" />
      )}
    </div>
  );
};

export default GameEditPage;
