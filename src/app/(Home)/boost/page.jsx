import GameCard from "@/components/GameCard";
import { games } from "@/lib/data";

const BoostPage = () => {
  return (
    <div className="mt-24 max-w-7xl mx-auto min-h-screen space-y-6 p-4">
      <h2 className="text-center text-4xl font-title text-white sm:text-5xl dark:text-white">
        Boost your game
      </h2>

      <div className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
        {games.map((game) => (
          <GameCard key={game.id} game={game} boost />
        ))}
      </div>
    </div>
  );
};

export default BoostPage;
