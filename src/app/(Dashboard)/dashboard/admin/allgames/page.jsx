"use client";

import Link from "next/link";
import { PlusIcon } from "@heroicons/react/20/solid";
import { fetchAllGames } from "@/lib/actions";
import { useEffect, useState } from "react";
import { BiLoader } from "react-icons/bi";
import { IoWarning } from "react-icons/io5";

import { AdminGameCard } from "../_components/AdminGameCard";
import toast from "react-hot-toast";

const AllGames = () => {
  const user = { name: "Nikhil", isAdmin: true };

  const [games, setGames] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // Fetch games from API
  const loadGames = async () => {
    setLoading(true);
    setError(false);

    try {
      const result = await fetchAllGames();

      if (result.error) {
        setError(true);
        toast.error(result.error);
      } else {
        setGames(result);
      }
    } catch (e) {
      setError(true);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGames();
  }, []);

  if (!user.isAdmin) return <div>You are not authorized to view this page</div>;

  return (
    <div className="space-y-6 mx-auto max-w-7xl p-4 pt-0">
      <div className="flex gap-4 justify-between items-center">
        <h2 className="text-center text-lg font-semibold">All Products</h2>

        <Link href="/dashboard/admin/allgames/newgame">
          <button className="bg-Gold/60 hover:bg-Gold/80 border border-black rounded-lg p-2 px-4 flex items-center justify-center gap-2 w-fit backdrop-blur-sm">
            <PlusIcon className="mr-2 h-5 w-5" />
            Add New Product
          </button>
        </Link>
      </div>

      {loading && <BiLoader className="h-8 w-8 animate-spin mx-auto" />}

      {error && (
        <p className="w-fit bg-red-500/50 p-4 rounded-lg mx-auto flex items-center justify-center gap-2">
          <IoWarning className="h-5 w-5 mr-2" />
          Failed to load Products. Please try again!
        </p>
      )}

      <div className="flex flex-col gap-4">
        {games?.length < 1 ? (
          <p className="text-center w-full">No Products have been added yet!</p>
        ) : (
          !loading &&
          !error &&
          games?.map((game, index) => <AdminGameCard key={index} game={game} />)
        )}
      </div>
    </div>
  );
};

export default AllGames;
