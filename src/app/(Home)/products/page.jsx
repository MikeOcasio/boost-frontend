"use client";

import { Suspense } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { BiLoader, BiSearch } from "react-icons/bi";
import { IoWarning } from "react-icons/io5";

import GameCard from "@/components/GameCard";
import {
  fetchAllGames,
  fetchSearchProducts,
} from "@/lib/actions/products-action";
import { SearchFilter } from "./_components/SearchFilter";
import { FilterButton } from "@/components/FilterButton";
import { HomeGameCarousel } from "@/components/home/HomeGameCarousel";
import PaginationWithIcon from "@/template-components/ui/pagination/PaginationWitIcon";
import { useRouter, useSearchParams } from "next/navigation";
import { debounce } from "lodash";
import Link from "next/link";
import CategoriesTab from "./_components/categories-tab";
import CategoriesSidebar from "./_components/categories-sidebar";
import Breadcrumb from "@/template-components/ui/breadcrumb/Breadcrumb";
import BackgroundPattern from "@/components/background-pattern";

// Wrapper to pass searchParams
const GamesPageWrapper = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  return <GamesPage searchParams={searchParams} router={router} />;
};

const GamesPage = ({ searchParams, router }) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [mostPopularGames, setMostPopularGames] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchMode, setSearchMode] = useState(false);

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

  useEffect(() => {
    const page = Number(searchParams.get("page")) || 1;
    setCurrentPage(page);
  }, [searchParams]);

  const loadGames = useCallback(async (page) => {
    setLoading(true);
    setError(false);

    try {
      const result = await fetchAllGames({ page });

      if (result.error) {
        setError(true);
        toast.error(result.error);
      } else {
        const products = result.products.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        setMostPopularGames(
          products.filter((game) => game.is_active && game.most_popular)
        );
        setGames(products);
        setTotalPages(result?.meta?.total_pages);
      }
    } catch (error) {
      // console.error("Failed to load products:", error);

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
          game.features.some((feature) => normalize(feature)?.includes(term))
        );
      })
      .filter((game) => (filter.mostPopular ? game.most_popular : true))
      .filter((game) => (filter.active ? game.is_active : true))
      .filter((game) => {
        if (filter.category) {
          const params = new URLSearchParams(searchParams.toString());
          params.set("category_id", filter.category);
          params.set("category_name", filter.categoryName);
          router.replace(`/products?${params.toString()}`);
          return game.category_id === Number(filter.category);
        } else {
          return true;
        }
      })
      .filter((game) => {
        if (filter.platform) {
          const params = new URLSearchParams(searchParams.toString());
          params.set("platform_id", filter.platform);
          params.set("platform_name", filter.platformName);
          router.replace(`/products?${params.toString()}`);
          return game.platforms.some(
            (platform) => platform.id === Number(filter.platform)
          );
        } else {
          return true;
        }
      })
      .filter((game) => {
        if (filter.attribute) {
          const params = new URLSearchParams(searchParams.toString());
          params.set("attribute_id", filter.attribute);
          params.set("attribute_name", filter.attributeName);
          router.replace(`/products?${params.toString()}`);
          return game.prod_attr_cats.some(
            (item) => item.id === Number(filter.attribute)
          );
        } else {
          return true;
        }
      })
      .filter((game) =>
        filter.minPrice ? game.price >= Number(filter.minPrice) : true
      )
      .filter((game) =>
        filter.maxPrice ? game.price <= Number(filter.maxPrice) : true
      );
  }, [searchTerm, games, filter, searchParams, router]);

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

  const debouncedSearch = useMemo(
    () =>
      debounce(async (func_params) => {
        const {
          term,
          page,
          category_id,
          platform_id,
          attribute_id,
          attribute_name,
          platform_name,
          category_name,
        } = func_params;

        const normalizedTerm = term?.trim();

        if (
          !page &&
          !normalizedTerm &&
          !category_id &&
          !platform_id &&
          !attribute_id
        ) {
          setLoading(false);
          loadGames(currentPage);

          const params = new URLSearchParams(searchParams.toString());
          params.delete("search");
          router.replace(
            `/products${params.toString() ? `?${params.toString()}` : ""}`
          );
          return;
        }

        // Update URL first
        const params = new URLSearchParams(searchParams.toString());
        if (normalizedTerm) params.set("search", normalizedTerm);
        if (page) params.set("page", String(page));
        if (category_id) params.set("category_id", category_id);
        if (platform_id) params.set("platform_id", platform_id);
        if (attribute_id) params.set("attribute_id", attribute_id);
        if (category_name) params.set("category_name", category_name);
        if (platform_name) params.set("platform_name", platform_name);
        if (attribute_name) params.set("attribute_name", attribute_name);

        try {
          // Replace URL without triggering a new search
          await router.replace(
            `/products${params.toString() ? `?${params.toString()}` : ""}`
          );

          const result = await fetchSearchProducts({
            searchTerm: normalizedTerm || "",
            page: page || 1,
            category_id,
            platform_id,
            attribute_id,
          });

          console.log("result", result);

          if (result.error) {
            setError(true);
            toast.error(result.error);
          } else {
            setGames(result.products);
            setTotalPages(result?.meta?.total_pages);
          }
        } catch (error) {
          setError(true);
          toast.error("Search error!");
        } finally {
          setLoading(false);
          setSearchMode(false);
        }
      }, 800),
    [currentPage, loadGames, router, searchParams]
  );

  // Update the useEffect to handle URL params on load
  useEffect(() => {
    const loadWithParams = async () => {
      const searchQuery = searchParams.get("search") || "";
      const category_id = searchParams.get("category_id") || "";
      const category_name = searchParams.get("category_name") || "";
      const platform_id = searchParams.get("platform_id") || "";
      const platform_name = searchParams.get("platform_name") || "";
      const attribute_id = searchParams.get("attribute_id") || "";
      const attribute_name = searchParams.get("attribute_name") || "";

      if (searchQuery && searchTerm !== searchQuery) {
        setSearchTerm(searchQuery);
      }

      // Update filter state with URL params
      setFilter((prev) => ({
        ...prev,
        category: category_id,
        categoryName: category_name,
        platform: platform_id,
        platformName: platform_name,
        attribute: attribute_id,
        attributeName: attribute_name,
      }));

      if (
        searchQuery ||
        category_id ||
        platform_id ||
        attribute_id ||
        currentPage > 1
      ) {
        await debouncedSearch({
          term: searchQuery,
          page: currentPage,
          category_id,
          platform_id,
          attribute_id,
          category_name,
          platform_name,
          attribute_name,
        });
      } else if (
        !searchQuery &&
        !category_id &&
        !platform_id &&
        !attribute_id
      ) {
        router.replace(`/products`);
        await loadGames(currentPage);
      }
    };

    loadWithParams();
    // don't add searchTerm it wont allow to search
  }, [currentPage, loadGames, debouncedSearch, router]); // eslint-disable-line

  // Handle search input change
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    // Only show loading and trigger search for non-empty terms
    if (term?.trim()) {
      setLoading(true);

      // Get current filter values
      const { category, platform, attribute } = filter;

      // Cancel any pending debounced searches
      debouncedSearch.cancel();

      // Trigger new search with current filters
      debouncedSearch({
        term,
        page: 1,
        category_id: category,
        platform_id: platform,
        attribute_id: attribute,
      });
    } else {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("search");
      router.replace(
        `/products${params.toString() ? `?${params.toString()}` : ""}`
      );
      // Cancel any pending searches for empty terms
      debouncedSearch.cancel();
      loadGames(currentPage);
    }
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;

    setCurrentPage(page);

    // Update URL with new page
    const params = new URLSearchParams(searchParams.toString());
    const currentSearchTerm = searchParams.get("search");
    const {
      category,
      platform,
      attribute,
      categoryName,
      platformName,
      attributeName,
    } = filter;

    params.set("page", page.toString());
    category && params.set("category_id", category);
    platform && params.set("platform_id", platform);
    attribute && params.set("attribute_id", attribute);
    categoryName && params.set("category_name", categoryName);
    platformName && params.set("platform_name", platformName);
    attributeName && params.set("attribute_name", attributeName);

    router.push(`/products${params.toString() ? `?${params.toString()}` : ""}`);

    debouncedSearch({
      term: currentSearchTerm || "",
      page,
      category_id: category,
      platform_id: platform,
      attribute_id: attribute,
    });
  };

  const handleSearchButton = () => {
    const { category, platform, attribute } = filter;

    debouncedSearch({
      term: searchTerm,
      page: 1,
      category_id: category,
      platform_id: platform,
      attribute_id: attribute,
    });
    setSearchMode(false);
  };

  const breadcrumbItems = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Products",
      href: "/products",
    },
  ];

  return (
    <div className="pt-24 max-w-[1920px] mx-auto min-h-screen space-y-6 p-4 overflow-hidden text-white">
      {/* Background */}
      <BackgroundPattern />

      <h2 className="text-center text-4xl font-title text-white sm:text-5xl">
        Products
      </h2>

      <Breadcrumb items={breadcrumbItems} variant="chevron" />

      {loading && <BiLoader className="h-8 w-8 animate-spin mx-auto" />}

      {error && (
        <p className="w-fit bg-red-500/50 p-4 rounded-lg mx-auto flex items-center justify-center gap-2">
          <IoWarning className="h-5 w-5 mr-2" />
          Failed to load products. Please try again!
          {/* reload */}
          <button
            onClick={() => loadGames(currentPage)}
            className="p-2 rounded-lg bg-white/10"
          >
            Reload
          </button>
        </p>
      )}

      {/* Search bar */}
      {!loading && !error && games.length < 1 ? (
        <p className="w-full flex items-center justify-center gap-2">
          No products found!
          <Link href="/" className="text-blue-400 hover:underline">
            go home
          </Link>
        </p>
      ) : (
        games.length > 0 && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              {/* Search bar */}
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

                      debouncedSearch({
                        term: searchTerm,
                        page: 1,
                        category_id: filter.category,
                        platform_id: filter.platform,
                        attribute_id: filter.attribute,
                      }); // execute search immediately
                    }
                  }
                }}
                placeholder="Search products..."
                className="flex-1 min-w-fit p-2 z-20 rounded-lg bg-white/10 border border-white/10 hover:border-white/20"
              />

              {/* cover foreground when search */}
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

              {/* Filters */}
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
                        onRemove={() => {
                          setFilter({
                            ...filter,
                            category: "",
                            categoryName: "",
                          });

                          const params = new URLSearchParams(
                            searchParams.toString()
                          );
                          params.delete("category_id");
                          params.delete("category_name");
                          router.replace(
                            `/products${
                              params.toString() ? `?${params.toString()}` : ""
                            }`
                          );
                        }}
                      />
                    )}
                    {filter.platform && (
                      <FilterButton
                        label={filter.platformName}
                        onRemove={() => {
                          setFilter({
                            ...filter,
                            platform: "",
                            platformName: "",
                          });
                          const params = new URLSearchParams(
                            searchParams.toString()
                          );
                          params.delete("platform_id");
                          params.delete("platform_name");
                          router.replace(
                            `/products${
                              params.toString() ? `?${params.toString()}` : ""
                            }`
                          );
                        }}
                      />
                    )}
                    {filter.attribute && (
                      <FilterButton
                        label={filter.attributeName}
                        onRemove={() => {
                          setFilter({
                            ...filter,
                            attribute: "",
                            attributeName: "",
                          });
                          const params = new URLSearchParams(
                            searchParams.toString()
                          );
                          params.delete("attribute_id");
                          params.delete("attribute_name");
                          router.replace(
                            `/products${
                              params.toString() ? `?${params.toString()}` : ""
                            }`
                          );
                        }}
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

            {/* categories tab */}
            <CategoriesTab />

            <div className="flex min-h-screen">
              {/* categories sidebar */}

              <CategoriesSidebar />

              <div className="space-y-6 p-4 pt-0 overflow-hidden flex-1">
                {/* hide most popular tab while searching and filter applied */}
                {!searchTerm &&
                  !Object.values(filter).some(
                    (value) => value && value !== "mostPopular"
                  ) &&
                  mostPopularGames?.length > 0 && (
                    <div className="bg-Gold/10 pb-4 rounded-lg border border-white/10 hover:border-Gold/20">
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

                <div className="grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                  {!loading && !error && filteredGames.length < 1 ? (
                    <p className="text-center w-full">No products found!</p>
                  ) : (
                    sortedGames?.map((game) => {
                      const parentProducts = sortedGames.filter(
                        (g) => !g?.parent_id
                      );
                      const showAllProducts = parentProducts?.length < 5;

                      return (
                        game?.is_active &&
                        (searchTerm.length > 0 ||
                          showAllProducts ||
                          !game?.parent_id) && (
                          <GameCard
                            key={game.id}
                            game={game}
                            searchTerm={searchTerm}
                          />
                        )
                      );
                    })
                  )}
                </div>
              </div>
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
      <GamesPageWrapper />
    </Suspense>
  );
}
