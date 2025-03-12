"use client";

import { fetchCategories } from "@/lib/actions/categories-actions";
import useCategoriesStore from "@/store/use-catogries";
import React, { useCallback, useEffect } from "react";
import toast from "react-hot-toast";

import CategoriesTab from "../_components/categories-tab";
import Breadcrumb from "@/template-components/ui/breadcrumb/Breadcrumb";

const CategoriesPage = () => {
  const { setLoading, setError, setCategories } = useCategoriesStore();

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchCategories();

      if (result.error) {
        setError(true);
        toast.error(result.error);
      }
      setCategories(result);
    } catch (error) {
      setError(true);
      setStoreError(true);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setCategories]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const breadcrumbItems = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "products",
      href: "/products",
    },
    {
      label: "Game Categories",
      href: "/products/categories",
    },
  ];

  return (
    <div className="pt-24 max-w-[1920px] mx-auto min-h-screen space-y-6 p-4 overflow-hidden text-white">
      {/* Background */}
      <div className="fixed top-0 left-0 w-full h-full bg-[url('/dashboard-bg.svg')] bg-repeat bg-contain opacity-5 blur-sm -z-20" />

      <h2 className="text-center text-4xl font-title text-white sm:text-5xl">
        Games
      </h2>

      <Breadcrumb items={breadcrumbItems} variant="chevron" />

      {/* categories tab */}
      <CategoriesTab showAllCategories={true} />
    </div>
  );
};

export default CategoriesPage;
