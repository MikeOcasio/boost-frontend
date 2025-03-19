"use client";

import { Suspense } from "react";
import Breadcrumb from "@/template-components/ui/breadcrumb/Breadcrumb";
import { useCallback, useEffect, useState } from "react";
import { BiLoader, BiSearch } from "react-icons/bi";
import { IoClose, IoWarning } from "react-icons/io5";

import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import {
  fetchMostPopularGames,
  fetchSearchProducts,
} from "@/lib/actions/products-action";
import CategoriesTab from "../products/_components/categories-tab";
import PaginationWithIcon from "@/template-components/ui/pagination/PaginationWitIcon";
import { HomeGameCarousel } from "@/components/home/HomeGameCarousel";
import CategoriesSidebar from "../products/_components/categories-sidebar";
import GameCard from "@/components/GameCard";
import useCategoriesStore from "@/store/use-catogries";
import { fetchCategories } from "@/lib/actions/categories-actions";
import BackgroundPattern from "@/components/background-pattern";

// Create a separate component for the search content
const SearchContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState(null);
  const [popularProducts, setPopularProducts] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const {
    setLoading: setStoreLoading,
    setError: setStoreError,
    setCategories: setStoreCategories,
  } = useCategoriesStore();

  const loadCategories = useCallback(async () => {
    if (useCategoriesStore.getState().categories.length > 0) return;

    try {
      setStoreLoading(true);
      const result = await fetchCategories();
      if (result.error) {
        setStoreError(true);
        toast.error(result.error);
        return;
      }
      setStoreCategories(result);
    } catch (error) {
      setStoreError(true);
      toast.error("Failed to load categories");
    } finally {
      setStoreLoading(false);
    }
  }, [setStoreCategories, setStoreError, setStoreLoading]);

  const fetchPopularProducts = useCallback(async () => {
    if (popularProducts?.length > 0) return;

    setIsLoading(true);
    setIsError(false);

    try {
      const result = await fetchMostPopularGames();

      if (result.error) {
        setIsError(true);
        toast.error(result.error);
      } else {
        setPopularProducts(result);
      }
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [popularProducts?.length]);

  useEffect(() => {
    loadCategories();

    if (!searchParams.get("q")) {
      fetchPopularProducts();
    }
  }, [fetchPopularProducts, loadCategories, searchParams]);

  useEffect(() => {
    const query = searchParams.get("q");
    const page = searchParams.get("page");

    if (query) {
      setSearchQuery(query);
      fetchSearchResults(query, page ? Number(page) : 1);
    } else if (!popularProducts?.length) {
      fetchPopularProducts();
    }

    if (page) setCurrentPage(Number(page));
  }, [searchParams, popularProducts, fetchPopularProducts]);

  const handleClose = () => {
    setSearchQuery("");
    setProducts([]);
    router.push("/search", { scroll: false });

    if (!popularProducts?.length) {
      fetchPopularProducts();
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a search term");
      return;
    }

    router.push(`/search?q=${searchQuery}`, { scroll: false });
    fetchSearchResults(searchQuery, 1);
  };

  const fetchSearchResults = async (query, page) => {
    if (!query?.trim()) return;

    setIsLoading(true);
    setIsError(false);

    try {
      const result = await fetchSearchProducts({
        searchTerm: query,
        page: page || 1,
      });

      if (result?.error) {
        toast.error(result.error);
      } else {
        setProducts(result?.products || []);
        setTotalPages(result?.totalPages || 1);
      }
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery.trim()) {
      fetchSearchResults();
    }
  }, [searchQuery]);

  const handlePageChange = (page) => {
    router.push(`/search?q=${searchQuery}&page=${page}`);
  };

  const breadcrumbItems = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: searchParams.get("q") || "Search",
      href: searchParams.get("q")
        ? `/search?q=${searchParams.get("q")}`
        : "/search",
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={breadcrumbItems} variant="chevron" />

      <div>
        <div className="flex gap-4">
          <div className="flex w-full items-center bg-Gold/10 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-2 hover:bg-Gold/20 transition-colors duration-200 mb-4">
            <BiSearch
              className="size-8 cursor-pointer p-1 rounded-lg hover:bg-white/20 text-gray-300 transition-colors"
              onClick={handleSearch}
            />

            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-transparent focus:outline-none text-gray-100 placeholder-gray-500 outline-none focus:ring-0 border-none px-3 text-[15px]"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />

            {searchQuery.trim() && (
              <IoClose
                className="size-8 cursor-pointer p-1 rounded-lg hover:bg-white/20 text-gray-300 transition-colors"
                onClick={handleClose}
              />
            )}
          </div>
        </div>
      </div>

      {isLoading && <BiLoader className="h-8 w-8 animate-spin mx-auto" />}

      {isError && (
        <p className="w-fit bg-red-500/50 p-4 rounded-lg mx-auto flex items-center justify-center gap-2">
          <IoWarning className="h-5 w-5 mr-2" />
          Failed to load products. Please try again!
          {/* reload */}
          <button
            onClick={() => fetchSearchResults}
            className="p-2 rounded-lg bg-white/10"
          >
            Reload
          </button>
        </p>
      )}

      {/* categories tab */}
      <CategoriesTab />

      <div className="flex min-h-screen">
        {/* categories sidebar */}

        <CategoriesSidebar />

        <div className="space-y-6 p-4 pt-0 overflow-hidden flex-1">
          {/* hide most popular tab while searching and filter applied */}
          {!searchQuery && popularProducts?.length > 0 && (
            <div className="bg-Gold/10 pb-4 rounded-lg border border-white/10 hover:border-Gold/20">
              <p className="text-sm font-semibold m-4 mb-0">
                Most Popular products
              </p>

              {!isLoading && !isError && popularProducts?.length < 1 ? (
                <p className="text-center w-full">No products found!</p>
              ) : (
                <HomeGameCarousel data={popularProducts} />
              )}
            </div>
          )}

          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {!isLoading && !isError && products?.length < 1 ? (
              <p className="text-center w-full">No products found!</p>
            ) : (
              products?.map(
                (game) =>
                  game?.is_active && (
                    <GameCard
                      key={game.id}
                      game={game}
                      searchTerm={searchQuery}
                    />
                  )
              )
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
  );
};

// Main page component
const SearchPage = () => {
  return (
    <div className="pt-24 max-w-[1920px] mx-auto min-h-screen space-y-6 p-4 overflow-hidden text-white">
      {/* Background */}
      <BackgroundPattern />

      <h2 className="text-center font-title text-4xl text-white sm:text-5xl">
        Search results
      </h2>

      <Suspense
        fallback={<BiLoader className="h-8 w-8 animate-spin mx-auto" />}
      >
        <SearchContent />
      </Suspense>
    </div>
  );
};

export default SearchPage;
