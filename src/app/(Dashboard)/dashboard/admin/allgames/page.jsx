"use client";

import Link from "next/link";
import { PlusIcon } from "@heroicons/react/20/solid";
import { fetchAllGames } from "@/lib/actions";
import { useEffect, useState } from "react";
import { BiLoader } from "react-icons/bi";
import { IoWarning } from "react-icons/io5";

import { AdminGameCard } from "../_components/AdminGameCard";
import toast from "react-hot-toast";
import { useUserStore } from "@/store/use-user";
import { SearchFilter } from "@/app/(Home)/games/_components/SearchFilter";
import { FilterButton } from "@/components/FilterButton";

const AllGames = () => {
  const { user } = useUserStore();

  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState({
    mostPopular: false,
    active: false,
    category: "",
    platform: "",
    attribute: "",
    platformName: "",
    categoryName: "",
    attributeName: "",
  });

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

  // Helper function: Normalize strings (remove extra spaces and convert to lowercase)
  const normalize = (str) => str?.toLowerCase().replace(/\s+/g, "").trim();

  // Filter and search logic
  const filteredGames = games
    ?.filter((game) => {
      const term = normalize(searchTerm);
      return (
        !term ||
        normalize(game.name).includes(term) ||
        normalize(game.description).includes(term) ||
        normalize(game.category.name).includes(term) ||
        normalize(game.category.description).includes(term)
      );
    })
    .filter((game) => (filter.mostPopular ? game.most_popular : true))
    .filter((game) => (filter.active ? game.is_active : true))
    .filter((game) =>
      filter.category ? game.category_id === Number(filter.category) : true
    )
    .filter((game) =>
      filter.platform
        ? game.platforms.some(
            (platform) => platform.id === Number(filter.platform)
          )
        : true
    )
    .filter((game) =>
      filter.attribute
        ? game.product_attribute_category_id === Number(filter.attribute)
        : true
    );

  if (!user.role === "admin" || !user.role === "dev")
    return <div>You are not authorized to view this page</div>;

  return (
    <div className="space-y-6 mx-auto max-w-7xl">
      <div className="flex flex-wrap gap-4 justify-between items-center">
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

      {!loading &&
        !error &&
        games &&
        (games.length < 1 ? (
          <p className="w-full">No games found!</p>
        ) : (
          games.length > 0 && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-4">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 min-w-fit p-2 rounded-lg bg-white/10 border border-white/10 hover:border-white/20"
                />

                <SearchFilter filter={filter} setFilter={setFilter} />

                <div className="flex items-center gap-2 w-full flex-wrap">
                  {/* show applied filters */}
                  {Object.keys(filter).length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      {filter.mostPopular && (
                        <FilterButton
                          label="Most Popular"
                          onRemove={() =>
                            setFilter({ ...filter, mostPopular: false })
                          }
                        />
                      )}
                      {filter.active && (
                        <FilterButton
                          label="Active"
                          onRemove={() =>
                            setFilter({ ...filter, active: false })
                          }
                        />
                      )}
                      {filter.category && (
                        <FilterButton
                          label={filter.categoryName}
                          onRemove={() =>
                            setFilter({
                              ...filter,
                              category: "",
                              categoryName: "",
                            })
                          }
                        />
                      )}
                      {filter.platform && (
                        <FilterButton
                          label={filter.platformName}
                          onRemove={() =>
                            setFilter({
                              ...filter,
                              platform: "",
                              platformName: "",
                            })
                          }
                        />
                      )}
                      {filter.attribute && (
                        <FilterButton
                          label={filter.attributeName}
                          onRemove={() =>
                            setFilter({
                              ...filter,
                              attribute: "",
                              attributeName: "",
                            })
                          }
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {!loading &&
                  !error &&
                  (filteredGames.length < 1 ? (
                    <p className="text-center w-full">No games found!</p>
                  ) : (
                    filteredGames?.map(
                      (game) =>
                        game?.is_active && (
                          <AdminGameCard key={game.id} game={game} />
                        )
                    )
                  ))}
              </div>
            </div>
          )
        ))}
    </div>
  );
};

export default AllGames;
