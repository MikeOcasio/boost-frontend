"use client";

import { PlusIcon } from "@heroicons/react/20/solid";
import { EditGame } from "../../_components/EditGame";
import { useState } from "react";
import toast from "react-hot-toast";
import { BiLoader } from "react-icons/bi";
import { addGame } from "@/lib/actions";
import { useRouter } from "next/navigation";

const NewGamePage = () => {
  const router = useRouter();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(false);
  const [missingFields, setMissingFields] = useState([]);

  const validateGame = () => {
    const errors = [];

    if (!game?.name) errors.push("Game name");
    if (!game?.description) errors.push("Game description");
    if (!game?.price) errors.push("Game price");
    if (!game?.category_id) errors.push("Game category");
    if (!game?.product_attribute_category_id)
      errors.push("Product attribute category");
    if (game?.is_priority === null) errors.push("Game priority");
    if (!game?.tax) errors.push("Game tax");
    if (game?.is_active === null) errors.push("Game active status");
    if (game?.most_popular === null) errors.push("Most popular status");
    if (!game?.tag_line) errors.push("Game tag line");
    if (!game?.primary_color) errors.push("Primary color");
    if (!game?.secondary_color) errors.push("Secondary color");
    if (game?.features?.length === 0) errors.push("At least one game feature");
    if (!game?.platform_ids.length) errors.push("At least one platform");

    setMissingFields(errors);

    return errors.length === 0; // Return true if no errors
  };

  const handleCreateGame = async () => {
    if (!validateGame()) return;

    setLoading(true);
    try {
      const response = await addGame(game);

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Game added successfully!");
        setGame(null);
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
        <h1 className="text-xl font-semibold">Add New Game</h1>

        <button
          onClick={handleCreateGame}
          disabled={loading}
          className="bg-Gold/60 hover:bg-Gold/80 border border-black rounded-lg p-2 flex items-center justify-center gap-2 w-fit backdrop-blur-sm"
        >
          {loading ? (
            <BiLoader className="h-5 w-5 animate-spin" />
          ) : (
            <PlusIcon className="h-5 w-5" />
          )}
          Add Game
        </button>
      </div>

      {/* Render missing fields below the form */}
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

      <EditGame data={game} setData={setGame} />
    </div>
  );
};

export default NewGamePage;
