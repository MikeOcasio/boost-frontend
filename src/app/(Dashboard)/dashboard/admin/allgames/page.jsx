"use client";

import { Suspense } from "react";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/20/solid";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BiLoader, BiSearch } from "react-icons/bi";
import { IoWarning } from "react-icons/io5";

import {
  fetchAllGames,
  fetchSearchProducts,
} from "@/lib/actions/products-action";
import { AdminGameCard } from "../_components/AdminGameCard";
import toast from "react-hot-toast";
import { useUserStore } from "@/store/use-user";
import { SearchFilter } from "@/app/(Home)/products/_components/SearchFilter";
import { FilterButton } from "@/components/FilterButton";
import PaginationWithIcon from "@/template-components/ui/pagination/PaginationWitIcon";
import { useRouter, useSearchParams } from "next/navigation";
import { debounce } from "lodash";

// Wrapper to pass searchParams
const AllGamesWrapper = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  return <AllGamesContent searchParams={searchParams} router={router} />;
};

const AllGamesContent = ({ searchParams, router }) => {
  const { user } = useUserStore();

  const [games, setGames] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchMode, setSearchMode] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);

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
    sortBy: "",
  });

  useEffect(() => {
    const page = Number(searchParams.get("page")) || 1;
    setCurrentPage(page);
  }, [searchParams]);

  // Fetch games from API
  const loadGames = useCallback(async (page) => {
    setLoading(true);
    setError(false);

    try {
      const result = await fetchAllGames({ page: page, get_all: true });

      if (result.error) {
        setError(true);
        toast.error(result.error);
      } else {
        // sort to newest first
        const sortedGames = result?.products.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        setGames(sortedGames);
        setTotalPages(result?.meta?.total_pages);
        setTotalProducts(result?.meta?.total_count);
      }
    } catch (e) {
      setError(true);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
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
          game.features.some((feature) => normalize(feature)?.includes(term)) ||
          // child products
          game.children.some((child) =>
            normalize(child.name)?.includes(term)
          ) ||
          game.children.some((child) =>
            normalize(child.description)?.includes(term)
          ) ||
          game.children.some((child) =>
            normalize(String(child.id))?.includes(term)
          ) ||
          game.children.some((child) =>
            normalize(child.tag_line)?.includes(term)
          ) ||
          game.children.some((child) =>
            child.platforms.some((platform) =>
              normalize(platform.name)?.includes(term)
            )
          ) ||
          game.children.some((child) =>
            child.prod_attr_cats.some((attr) =>
              normalize(attr.name)?.includes(term)
            )
          ) ||
          (game.children.length > 0 && "subproducts".includes(term))
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
      );
  }, [games, searchTerm, filter]);

  // Apply sorting based on filter.sortBy

  const sortedGames =
    filteredGames &&
    [...filteredGames].sort((a, b) => {
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

  const debouncedSearch = useMemo(
    () =>
      debounce(async (term, page) => {
        if (term.length > 0) {
          setLoading(true);

          try {
            const result = await fetchSearchProducts({
              searchTerm: term,
              page: page || 1,
            });

            if (result.error) {
              setError(true);
              toast.error(result.error);
            } else {
              setGames(result.products);
              setTotalPages(result?.meta?.total_pages);

              // Update URL with search params
              const params = new URLSearchParams(searchParams.toString());
              params.set("search", term);
              params.set("page", page.toString());

              router.replace(
                `/dashboard/admin/allgames${
                  params.toString() ? `?${params.toString()}` : ""
                }`
              );
            }
          } catch (error) {
            setError(true);
            toast.error("Search error!");
          } finally {
            setLoading(false);
            setSearchMode(false);
          }
        } else {
          // If search term is empty, load all games
          loadGames(currentPage);

          // Remove search param from URL
          const params = new URLSearchParams(searchParams.toString());
          params.delete("search");
          router.replace(
            `/dashboard/admin/allgames${
              params.toString() ? `?${params.toString()}` : ""
            }`
          );
        }
      }, 2000),
    [currentPage, loadGames, router, searchParams]
  );

  useEffect(() => {
    const searchQuery = searchParams.get("search") || "";

    if (searchQuery && searchTerm !== searchQuery) {
      setSearchTerm(searchQuery);
      debouncedSearch(searchQuery, currentPage);
    } else if (!searchQuery) {
      loadGames(currentPage);
    }
    // don't add searchTerm it wont allow to search
  }, [currentPage, loadGames, searchParams, debouncedSearch]); // eslint-disable-line

  // Handle search input change
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setLoading(true);

    // Cancel any scheduled debounce
    debouncedSearch.cancel();

    debouncedSearch(term, 1);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;

    setCurrentPage(page);

    // Update URL with new page
    const params = new URLSearchParams(searchParams.toString());
    const currentSearchTerm = searchParams.get("search");

    params.set("page", page.toString());
    router.replace(
      `/dashboard/admin/allgames${
        params.toString() ? `?${params.toString()}` : ""
      }`
    );

    if (currentSearchTerm) {
      debouncedSearch(currentSearchTerm, page);
    }
  };

  const handleSearchButton = () => {
    debouncedSearch(searchTerm, 1);
    setSearchMode(false);
  };

  if (!user.role === "admin" || !user.role === "dev")
    return <div>You are not authorized to view this page</div>;

  return (
    <div className="space-y-6 mx-auto max-w-7xl">
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <h2 className="text-center text-lg font-semibold">
          All Products ({totalProducts})
        </h2>

        <Link href="/dashboard/admin/allgames/newgame">
          <button className="bg-Gold/60 hover:bg-Gold/80 border border-black rounded-lg p-2 px-4 flex items-center justify-center gap-2 w-fit backdrop-blur-sm">
            <PlusIcon className="mr-2 h-5 w-5" />
            Add New Product
          </button>
        </Link>
      </div>

      {loading && <BiLoader className="h-8 w-8 animate-spin mx-auto" />}

      {error && (
        <p className="w-fit bg-red-500/50 p-4 rounded-lg mx-auto flex items-center justify-center gap-2 flex-wrap text-center">
          <IoWarning className="h-5 w-5 mr-2" />
          Failed to load Products. Please try again!
          {/* reload */}
          <button
            onClick={() => loadGames(currentPage || 1)}
            className="p-2 rounded-lg bg-white/10"
          >
            Reload
          </button>
        </p>
      )}

      {!loading && !error && games?.length < 1 ? (
        <p className="w-full flex items-center justify-center gap-2">
          No games found!
          <Link href="/" className="text-blue-400 hover:underline">
            go home
          </Link>
        </p>
      ) : (
        games.length > 0 && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                onClick={() => setSearchMode(true)}
                onBlur={() => setSearchMode(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setSearchMode(false);

                    if (
                      searchTerm?.trim()?.length > 0 &&
                      searchTerm !== searchParams.get("search")
                    ) {
                      debouncedSearch.cancel(); // Cancel any scheduled debounce
                      debouncedSearch(searchTerm, 1); // execute search immediately
                    }
                  }
                }}
                placeholder="Search products..."
                className="flex-1 min-w-fit p-2 rounded-lg bg-white/10 border border-white/10 hover:border-white/20 z-20"
              />

              {/* cover foreground */}
              {searchMode && (
                <div className="fixed top-0 left-0 w-screen h-screen bg-white/10 backdrop-blur-lg z-10" />
              )}

              {/* search button */}
              {searchMode && (
                <button
                  onClick={handleSearchButton}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 z-20 flex items-center gap-2"
                >
                  <BiSearch className="h-6 w-6" />
                  Search
                </button>
              )}

              {!searchMode && (
                <SearchFilter filter={filter} setFilter={setFilter} />
              )}

              <div className="flex items-center gap-2 w-full flex-wrap z-20">
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
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {!loading && !error && filteredGames?.length < 1 ? (
                <p className="text-center w-full">No games found!</p>
              ) : (
                sortedGames?.map((game) => (
                  <AdminGameCard
                    key={game.id}
                    game={game}
                    searchTerm={searchTerm}
                  />
                ))
              )}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center pt-4">
              <PaginationWithIcon
                totalPages={totalPages}
                initialPage={currentPage}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        )
      )}
    </div>
  );
};

// Update the default export to wrap with Suspense
export default function Page() {
  return (
    <Suspense fallback={<BiLoader className="h-8 w-8 animate-spin mx-auto" />}>
      <AllGamesWrapper />
    </Suspense>
  );
}
