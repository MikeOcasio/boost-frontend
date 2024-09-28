"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { BiLoader, BiUpload } from "react-icons/bi";
import { fetchGameById, updateGame } from "@/lib/actions";
import { EditGame } from "../../_components/EditGame";

const GameEditPage = ({ params }) => {
  const { gameId } = params;
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(false);
  const [missingFields, setMissingFields] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchGame = async () => {
      setLoading(true);
      try {
        const fetchedGame = await fetchGameById(gameId);

        const platformArr = fetchedGame.platforms.map(
          (platform) => platform.id
        );

        setGame({
          ...fetchedGame,
          platform_ids: platformArr,
        });
      } catch (error) {
        toast.error("Failed to fetch game data.");
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [gameId]);

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
    if (!game?.platform_ids.length) errors.push("At least one platform");
    if (game?.is_active === null) errors.push("Game active status");
    if (game?.most_popular === null) errors.push("Most popular status");
    if (!game?.tag_line) errors.push("Game tag line");
    if (!game?.primary_color) errors.push("Primary color");
    if (!game?.secondary_color) errors.push("Secondary color");
    if (game?.features?.length === 0) errors.push("At least one game feature");

    setMissingFields(errors);
    return errors.length === 0;
  };

  const handleUpdateGame = async () => {
    console.log("game id page", gameId, game);
    if (!validateGame()) return;

    setLoading(true);
    try {
      const response = await updateGame(game, gameId);

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Game updated successfully!");
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
        <h1 className="text-xl font-semibold">Edit Game</h1>

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
          Update Game
        </button>
      </div>

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

      {game ? (
        <EditGame data={game} setData={setGame} />
      ) : (
        <BiLoader className="h-8 w-8 animate-spin mx-auto" />
      )}
    </div>
  );
};

export default GameEditPage;
