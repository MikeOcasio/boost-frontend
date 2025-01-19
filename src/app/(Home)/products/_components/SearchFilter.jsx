import {
  Popover,
  PopoverBackdrop,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiCross, BiFilter, BiLoader } from "react-icons/bi";
import { IoWarning } from "react-icons/io5";

import { fetchPlatforms } from "@/lib/actions/platforms-action";
import { fetchCategories } from "@/lib/actions/categories-actions";
import { fetchAttribute } from "@/lib/actions/attributes-action";

export const SearchFilter = ({ filter, setFilter }) => {
  const [categories, setCategories] = useState(null);
  const [attribute, setAttribute] = useState(null);
  const [platforms, setPlatforms] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadAttribute = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchAttribute();
      if (result.error) {
        setError(true);
        toast.error(result.error);
      }
      setAttribute(result);
    } catch (error) {
      setError(true);
      toast.error("Failed to load attributes");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadPlatforms = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchPlatforms();
      if (result.error) {
        setError(true);
        toast.error(result.error);
      }
      setPlatforms(result);
    } catch (error) {
      setError(true);
      toast.error("Failed to load platforms");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
    loadAttribute();
    loadPlatforms();
  }, [loadAttribute, loadCategories, loadPlatforms]);

  return (
    <Popover>
      <PopoverButton>
        <BiFilter className="h-10 w-10 p-2 rounded-lg hover:bg-white/10 border border-white/10 -mb-1.5" />
      </PopoverButton>

      <PopoverBackdrop
        transition
        className="fixed h-screen top-0 inset-0 bg-black/50 backdrop-blur-sm z-50"
      />

      <PopoverPanel
        focus
        transition
        className="fixed max-w-sm mx-auto inset-x-4 top-[30%] z-50 origin-top rounded-xl p-4 ring-1 ring-zinc-900/5 bg-zinc-900 ring-zinc-800 overflow-y-auto transition duration-200 ease-in-out [--anchor-gap:var(--spacing-5)] data-[closed]:-translate-y-1 data-[closed]:opacity-0"
      >
        <div className="flex flex-row-reverse items-center justify-between">
          <PopoverButton aria-label="Close menu" className="p-1">
            <BiCross className="h-6 w-6 text-zinc-500 rotate-45" />
          </PopoverButton>

          <h3 className="text-lg font-semibold">Filters</h3>
        </div>

        {loading && <BiLoader className="h-8 w-8 animate-spin mx-auto" />}

        {error && (
          <p className="w-fit bg-red-500/50 p-4 rounded-lg mx-auto flex items-center justify-center gap-2">
            <IoWarning className="h-5 w-5 mr-2" />
            Failed to load data. Please try again!
            {/* reload */}
            <button
              onClick={() => {
                loadCategories();
                loadAttribute();
                loadPlatforms();
              }}
              className="p-2 rounded-lg bg-white/10"
            >
              Reload
            </button>
          </p>
        )}

        {!loading && !error && (
          <div className="flex flex-col gap-4 mt-2">
            <label className="flex items-center space-x-2 border-b border-white/10 pb-2">
              <input
                type="checkbox"
                checked={filter.mostPopular}
                onChange={(e) =>
                  setFilter((prev) => ({
                    ...prev,
                    mostPopular: e.target.checked,
                  }))
                }
                className="form-checkbox"
              />
              <span className="text-white">Most Popular</span>
            </label>

            {/* <label className="flex items-center space-x-2 border-b border-white/10 pb-2">
              <input
                type="checkbox"
                checked={filter.active}
                onChange={(e) =>
                  setFilter((prev) => ({
                    ...prev,
                    active: e.target.checked,
                  }))
                }
                className="form-checkbox"
              />
              <span className="text-white">Active</span>
            </label> */}

            {/* sort by */}
            <select
              value={filter.sortBy}
              onChange={(e) =>
                setFilter((prev) => ({
                  ...prev,
                  sortBy: e.target.value,
                }))
              }
              className="p-2 rounded-lg bg-white/10 border border-white/10 hover:border-white/20"
            >
              <option value="" className="bg-neutral-800" unselectable="on">
                Sort By
              </option>
              <option value="latest" className="bg-neutral-800">
                Latest
              </option>
              <option value="priceHighToLow" className="bg-neutral-800">
                Price: High to Low
              </option>
              <option value="priceLowToHigh" className="bg-neutral-800">
                Price: Low to High
              </option>
              <option value="oldest" className="bg-neutral-800">
                Oldest
              </option>
            </select>

            {/* slider price filter range */}
            <p className="text-xs -mb-3">Filter by price range</p>
            <div className="flex items-center justify-between gap-2">
              <input
                type="number"
                value={filter.minPrice}
                onChange={(e) =>
                  setFilter((prev) => ({
                    ...prev,
                    minPrice: e.target.value,
                  }))
                }
                placeholder="Min Price"
                className="p-2 rounded-lg bg-white/10 border border-white/10 hover:border-white/20 w-full flex-1"
              />

              <input
                type="number"
                value={filter.maxPrice}
                onChange={(e) =>
                  setFilter((prev) => ({
                    ...prev,
                    maxPrice: e.target.value,
                  }))
                }
                placeholder="Max Price"
                className="p-2 rounded-lg bg-white/10 border border-white/10 hover:border-white/20 w-full flex-1"
              />
            </div>

            {/* platforms filter */}
            <select
              value={filter.platform}
              onChange={(e) =>
                setFilter((prev) => ({
                  ...prev,
                  platform: e.target.value,
                  platformName: platforms.find(
                    (platform) => platform.id === Number(e.target.value)
                  )?.name,
                }))
              }
              className="p-2 rounded-lg bg-white/10 border border-white/10 hover:border-white/20"
            >
              <option value="" className="bg-neutral-800" unselectable="on">
                Select Platform
              </option>

              {platforms?.map((platform) => (
                <option
                  key={platform.id}
                  value={platform.id}
                  className="bg-neutral-800"
                >
                  {platform.name}
                </option>
              ))}
            </select>

            {/* categories filter */}
            <select
              value={filter.category}
              onChange={(e) =>
                setFilter((prev) => ({
                  ...prev,
                  category: e.target.value,
                  categoryName: categories.find(
                    (category) => category.id === Number(e.target.value)
                  )?.name,
                }))
              }
              className="p-2 rounded-lg bg-white/10 border border-white/10 hover:border-white/20"
            >
              <option value="" className="bg-neutral-800" unselectable="on">
                Select Category
              </option>
              {categories?.map(
                (category) =>
                  category.is_active && (
                    <option
                      key={category.id}
                      value={category.id}
                      className="bg-neutral-800"
                    >
                      {category.name}
                    </option>
                  )
              )}
            </select>

            {/* attribute filter */}
            <select
              value={filter.attribute}
              onChange={(e) =>
                setFilter((prev) => ({
                  ...prev,
                  attribute: e.target.value,
                  attributeName: attribute.find(
                    (attr) => attr.id === Number(e.target.value)
                  )?.name,
                }))
              }
              className="p-2 rounded-lg bg-white/10 border border-white/10 hover:border-white/20"
            >
              <option value="" className="bg-neutral-800" unselectable="on">
                Select Attribute
              </option>

              {attribute?.map((attr) => (
                <option
                  key={attr.id}
                  value={attr.id}
                  className="bg-neutral-800"
                >
                  {attr.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </PopoverPanel>
    </Popover>
  );
};
