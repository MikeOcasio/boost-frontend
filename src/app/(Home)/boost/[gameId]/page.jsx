import { games } from "@/lib/data";

const BoostGame = ({ params }) => {
  const gameId = params.gameId;

  const game = games.find((game) => game.id === gameId);

  return (
    <div className="mt-24 max-w-7xl mx-auto min-h-screen space-y-6 p-4">
      {gameId}
    </div>
  );
};

export default BoostGame;
