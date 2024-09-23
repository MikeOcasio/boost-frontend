import { games } from "@/lib/data";
import { AdminGameCard } from "../_components/AdminGameCard";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/20/solid";

const AllGames = () => {
  const user = { name: "Nikhil", isAdmin: true };
  if (!user.isAdmin) return <div>You are not authorized to view this page</div>;

  return (
    <div className="space-y-6 mx-auto max-w-7xl p-4 pt-0">
      <h2 className="text-center text-lg font-semibold">All Games</h2>

      <Link href="/dashboard/admin/allgames/newgame">
        <button className="bg-Gold/60 hover:bg-Gold/80 border border-black rounded-lg p-4 flex items-center justify-center gap-2 w-full mt-6 backdrop-blur-sm">
          <PlusIcon className="mr-2 h-5 w-5" />
          Add New Game
        </button>
      </Link>

      <div className="flex flex-col gap-4">
        {games.map((game, index) => (
          <AdminGameCard key={index} game={game} />
        ))}
      </div>
    </div>
  );
};

export default AllGames;
