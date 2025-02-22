"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { BiLoader } from "react-icons/bi";
import { IoWarning } from "react-icons/io5";

import GameCard from "@/components/GameCard";
import { fetchAllGames } from "@/lib/actions/products-action";
import { SearchFilter } from "./_components/SearchFilter";
import { FilterButton } from "@/components/FilterButton";
import { HomeGameCarousel } from "@/components/home/HomeGameCarousel";

const GamesPage = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mostPopularGames, setMostPopularGames] = useState(null);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState({
    mostPopular: false,
    category: "",
    platform: "",
    attribute: "",
    platformName: "",
    categoryName: "",
    attributeName: "",
    sortBy: "",
    minPrice: "",
    maxPrice: "",
  });

  const loadGames = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchAllGames();

      if (result.error) {
        setError(true);
        toast.error(result.error);
      } else {
        // sorted to latest first
        result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        const popularGames = result.filter(
          (game) => game.is_active && game.most_popular
        );
        setMostPopularGames(popularGames);

        setGames(result);
      }
    } catch (error) {
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
  const filteredGames = useMemo(() => {
    const term = normalize(searchTerm);

    return games
      ?.filter((game) => {
        return (
          !term ||
          normalize(game.name)?.includes(term) ||
          normalize(game.description)?.includes(term) ||
          normalize(game.category.name)?.includes(term) ||
          normalize(game.category.description)?.includes(term) ||
          normalize(String(game.id))?.includes(term) ||
          normalize(game.tag_line)?.includes(term) ||
          game.platforms.some((platform) =>
            normalize(platform.name)?.includes(term)
          ) ||
          game.prod_attr_cats.some((attr) =>
            normalize(attr.name)?.includes(term)
          ) ||
          game.features.some((feature) => normalize(feature)?.includes(term))
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
          ? game.prod_attr_cats.some(
              (item) => item.id === Number(filter.attribute)
            )
          : true
      )
      .filter((game) =>
        filter.minPrice ? game.price >= Number(filter.minPrice) : true
      )
      .filter((game) =>
        filter.maxPrice ? game.price <= Number(filter.maxPrice) : true
      );
  }, [games, searchTerm, filter]);

  // Apply sorting based on filter.sortBy
  const sortedGames = [...filteredGames].sort((a, b) => {
    switch (filter.sortBy) {
      case "latest":
        return new Date(b.created_at) - new Date(a.created_at);
      case "oldest":
        return new Date(a.created_at) - new Date(b.created_at);
      case "priceHighToLow":
        return b.price - a.price;
      case "priceLowToHigh":
        return a.price - b.price;
      default:
        return 0;
    }
  });

  return (
    <div className="pt-24 max-w-7xl mx-auto min-h-screen space-y-6 p-4 overflow-hidden text-white">
      {/* Background */}
      <div className="fixed top-0 left-0 w-full h-full bg-[url('/dashboard-bg.svg')] bg-repeat bg-contain opacity-5 blur-sm -z-20" />

      <h2 className="text-center text-4xl font-title text-white sm:text-5xl">
        Products
      </h2>

      {loading && <BiLoader className="h-8 w-8 animate-spin mx-auto" />}

      {error && (
        <p className="w-fit bg-red-500/50 p-4 rounded-lg mx-auto flex items-center justify-center gap-2">
          <IoWarning className="h-5 w-5 mr-2" />
          Failed to load products. Please try again!
          {/* reload */}
          <button onClick={loadGames} className="p-2 rounded-lg bg-white/10">
            Reload
          </button>
        </p>
      )}

      {/* Search bar */}
      {!loading && !error && games.length < 1 ? (
        <p className="w-full">No products found!</p>
      ) : (
        games.length > 0 && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              <input
                type="text"
                autoFocus
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
                        onRemove={() => setFilter({ ...filter, active: false })}
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
                    {filter.sortBy && (
                      <FilterButton
                        label={filter.sortBy}
                        onRemove={() =>
                          setFilter({
                            ...filter,
                            sortBy: "",
                          })
                        }
                      />
                    )}
                    {filter.minPrice && (
                      <FilterButton
                        label={`Min $${filter.minPrice}`}
                        onRemove={() =>
                          setFilter({
                            ...filter,
                            minPrice: "",
                          })
                        }
                      />
                    )}
                    {filter.maxPrice && (
                      <FilterButton
                        label={`Max $${filter.maxPrice}`}
                        onRemove={() =>
                          setFilter({
                            ...filter,
                            maxPrice: "",
                          })
                        }
                      />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* hide most popular tab while searching and filter applied */}
            {!searchTerm &&
              !Object.values(filter).some(
                (value) => value && value !== "mostPopular"
              ) &&
              mostPopularGames?.length > 0 && (
                <div className="space-y-2 bg-Gold/10 pb-4 rounded-lg border border-white/10 hover:border-Gold/20">
                  <p className="text-sm font-semibold m-4 mb-0">
                    Most Popular products
                  </p>

                  {!loading && !error && mostPopularGames?.length < 1 ? (
                    <p className="text-center w-full">No products found!</p>
                  ) : (
                    <HomeGameCarousel data={mostPopularGames} />
                  )}
                </div>
              )}

            <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
              {!loading && !error && filteredGames.length < 1 ? (
                <p className="text-center w-full">No products found!</p>
              ) : (
                sortedGames?.map(
                  (game) =>
                    game?.is_active &&
                    (searchTerm.length > 0 ? true : !game?.parent_id) && (
                      <GameCard
                        key={game.id}
                        game={game}
                        searchTerm={searchTerm}
                      />
                    )
                )
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default GamesPage;
