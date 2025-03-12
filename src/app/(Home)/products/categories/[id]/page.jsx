"use client";

import GameCard from "@/components/GameCard";
import { fetchProductByCategories } from "@/lib/actions/products-action";
import Breadcrumb from "@/template-components/ui/breadcrumb/Breadcrumb";
import PaginationWithIcon from "@/template-components/ui/pagination/PaginationWitIcon";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiLoader } from "react-icons/bi";
import { IoWarning } from "react-icons/io5";

const CategoryGamesPage = ({ params }) => {
  const categoryId = params.id;
  const searchParams = useSearchParams();
  const router = useRouter();

  const [productCategories, setProductCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const page = Number(searchParams.get("page")) || 1;
    setCurrentPage(page);
  }, [searchParams]);

  const loadCategoriesProducts = useCallback(
    async (page) => {
      if (!categoryId) return;

      setLoading(true);

      console.log("fetch product by categories id", page);

      try {
        const result = await fetchProductByCategories({
          categoryId,
          page: page || 1,
        });

        console.log("fetch product by categories id", result);

        if (result.error) {
          setError(true);
          toast.error(result.error);
        } else {
          setProductCategories(result?.products);
          setTotalPages(result?.meta?.total_pages);
        }
      } catch (error) {
        setError(true);
        toast.error("Failed to load badges. Please try again!");
      } finally {
        setLoading(false);
      }
    },
    [categoryId]
  );

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;

    setCurrentPage(page);

    // Update URL with new page
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", page.toString());

    router.push(
      `/products/categories/${categoryId}${
        params.toString() ? `?${params.toString()}` : ""
      }`
    );
  };

  useEffect(() => {
    loadCategoriesProducts(currentPage);
  }, [currentPage, loadCategoriesProducts]);

  const breadcrumbItems = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Products",
      href: "/products",
    },
    {
      label: "Game Categories",
      href: "/products/categories",
    },
    {
      label:
        (productCategories?.length > 0 &&
          productCategories[0].category?.name) ||
        "Products",
      href: `/products/categories/${categoryId}`,
    },
  ];

  return (
    <div className="pt-24 max-w-[1920px] mx-auto min-h-screen space-y-6 p-4 overflow-hidden text-white">
      {/* Background */}
      <div className="fixed top-0 left-0 w-full h-full bg-[url('/dashboard-bg.svg')] bg-repeat bg-contain opacity-5 blur-sm -z-20" />

      <h2 className="text-center text-4xl font-title text-white sm:text-5xl">
        {productCategories?.length > 0 && productCategories[0].category?.name}{" "}
        Products
      </h2>

      {loading && <BiLoader className="h-8 w-8 animate-spin mx-auto" />}

      {error && (
        <p className="w-fit bg-red-500/50 p-4 rounded-lg mx-auto flex items-center justify-center gap-2">
          <IoWarning className="h-5 w-5 mr-2" />
          Failed to load products. Please try again!
          {/* reload */}
          <button
            onClick={() => loadCategoriesProducts()}
            className="p-2 rounded-lg bg-white/10"
          >
            Reload
          </button>
        </p>
      )}

      <Breadcrumb items={breadcrumbItems} variant="chevron" />

      <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {!loading && !error && productCategories.length < 1 ? (
          <p className="text-center w-full">No products found!</p>
        ) : (
          productCategories?.map(
            (game) => game?.is_active && <GameCard key={game.id} game={game} />
          )
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
  );
};

export default CategoryGamesPage;
