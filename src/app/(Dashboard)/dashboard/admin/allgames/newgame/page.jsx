"use client";

import { PlusIcon } from "@heroicons/react/20/solid";
import { EditGame } from "../../_components/EditGame";
import { useState } from "react";
import toast from "react-hot-toast";
import { BiLoader } from "react-icons/bi";

const NewGamePage = () => {
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(false);

  
  const handleCreateGame = async () => {
    if (
      !game.name ||
      !game.description ||
      !game.price ||
      !game.image ||
      !game.category_id ||
      !game.product_attribute_category_id ||
      !game.order_id ||
      !game.cart_id ||
      !game.is_priority ||
      !game.tax ||
      !game.platform ||
      !game.is_active ||
      !game.most_popular ||
      !game.tag_line ||
      !game.bg_image ||
      !game.primary_color ||
      !game.secondary_color ||
      !game.features.length
    ) {
      toast.error("Please fill all the required data properly!");
      return;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <h1 className="text-xl font-semibold">Add New Game</h1>

        <button
          onClick={handleCreateGame}
          className="bg-Gold/60 hover:bg-Gold/80 border border-black rounded-lg p-2 flex items-center justify-center gap-2 w-fit mt-6 backdrop-blur-sm"
        >
          {loading ? (
            <BiLoader className="h-5 w-5 animate-spin" />
          ) : (
            <PlusIcon className="h-5 w-5" />
          )}
          Add Game
        </button>
      </div>

      <EditGame data={game} setData={setGame} />
    </div>
  );
};

export default NewGamePage;
