"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiLoader } from "react-icons/bi";
import { IoWarning } from "react-icons/io5";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import GameCard from "@/components/GameCard";
import { fetchAllGames } from "@/lib/actions/products-action";
import { HomeGameCarousel } from "@/components/home/HomeGameCarousel";
import PaginationWithIcon from "@/template-components/ui/pagination/PaginationWitIcon";
import CategoriesTab from "./_components/categories-tab";
import CategoriesSidebar from "./_components/categories-sidebar";
import Breadcrumb from "@/template-components/ui/breadcrumb/Breadcrumb";
import BackgroundPattern from "@/components/background-pattern";
import useCategoriesStore from "@/store/use-catogries";
import { fetchCategories } from "@/lib/actions/categories-actions";

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

  const {
    setLoading: setStoreLoading,
    setError: setStoreError,
    setCategories: setStoreCategories,
    categories,
  } = useCategoriesStore();

  const loadCategories = useCallback(async () => {
    if (categories.length > 0) return;

    try {
      setStoreLoading(true);
      const result = await fetchCategories();
      if (result.error) {
        setStoreError(true);
        toast.error(result.error);
      } else {
        setStoreCategories(result);
      }
    } catch (error) {
      setStoreError(true);
      toast.error("Failed to load categories");
    } finally {
      setStoreLoading(false);
    }
  }, [categories.length, setStoreCategories, setStoreError, setStoreLoading]);

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
      setError(true);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const page = Number(searchParams.get("page")) || 1;

    setCurrentPage(page);
    loadGames(page);

    loadCategories();
  }, [loadCategories, loadGames, searchParams]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;

    setCurrentPage(page);
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());

    router.push(`/products${params.toString() ? `?${params.toString()}` : ""}`);
    loadGames(page);
  };

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
  ];

  return (
    <div className="pt-24 max-w-[1920px] mx-auto min-h-screen space-y-6 p-4 overflow-hidden text-white">
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
          <button
            onClick={() => loadGames(currentPage)}
            className="p-2 rounded-lg bg-white/10"
          >
            Reload
          </button>
        </p>
      )}

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
            <CategoriesTab />

            <div className="flex min-h-screen">
              <CategoriesSidebar />

              <div className="space-y-6 p-4 pt-0 overflow-hidden flex-1">
                {mostPopularGames?.length > 0 && (
                  <div className="bg-Gold/10 pb-4 rounded-lg border border-white/10 hover:border-Gold/20">
                    <p className="text-sm font-semibold m-4 mb-0">
                      Most Popular products
                    </p>
                    <HomeGameCarousel data={mostPopularGames} />
                  </div>
                )}

                <div className="grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                  {games.map(
                    (game) =>
                      game?.is_active && <GameCard key={game.id} game={game} />
                  )}
                </div>
              </div>
            </div>

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

export default function Page() {
  return (
    <Suspense fallback={<BiLoader className="h-8 w-8 animate-spin mx-auto" />}>
      <GamesPageWrapper />
    </Suspense>
  );
}
