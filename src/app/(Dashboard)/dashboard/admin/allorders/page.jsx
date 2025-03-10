"use client";

import { useEffect, useMemo, useState } from "react";
import { BiLoader, BiPlus } from "react-icons/bi";
import { IoWarning } from "react-icons/io5";
import toast from "react-hot-toast";

import { AdminOrderCard } from "../_components/AdminOrderCard";
import { fetchAllOrders } from "@/lib/actions/orders-action";
import { NewOrderDialog } from "../_components/NewOrderDialog";
import { useUserStore } from "@/store/use-user";
import { FilterButton } from "@/components/FilterButton";
import { OrderSearchFilter } from "@/app/(Dashboard)/_components/OrderSearchFilter";
import { fetchAllSkillmasters } from "@/lib/actions/skillmasters-action";

const AllOrders = () => {
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState({
    category: "",
    platform: "",
    attribute: "",
    platformName: "",
    categoryName: "",
    attributeName: "",
    state: "",
    sortBy: "",
  });

  const [skillmasters, setSkillmasters] = useState(null);

  const { user } = useUserStore();

  const loadOrders = async () => {
    setLoading(true);
    setError(false);

    try {
      const result = await fetchAllOrders();

      if (result.error) {
        setError(true);
        toast.error(result.error);
      } else {
        // sort orders in order of open first
        const sortedOrders = result?.orders.sort((a, b) => {
          const aState = a.state;
          const bState = b.state;
          if (aState === "disputed") return -1;
          if (bState === "disputed") return 1;
          if (aState === "delayed") return -1;
          if (bState === "delayed") return 1;
          if (aState === "in_progress") return -1;
          if (bState === "in_progress") return 1;
          if (aState === "assigned") return -1;
          if (bState === "assigned") return 1;
          if (aState === "complete") return -1;
          if (bState === "complete") return 1;
          return 0;
        });

        setOrders(sortedOrders);
      }
    } catch (e) {
      setError(true);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // Helper function: Normalize strings (handles non-string values safely)
  const normalize = (str) =>
    typeof str === "string" ? str.toLowerCase().replace(/\s+/g, "").trim() : "";

  // Filter and search logic
  const filteredOrders = useMemo(() => {
    const term = normalize(searchTerm);

    return orders
      ?.filter((order) => {
        return (
          !term ||
          normalize(order.internal_id).includes(term) ||
          normalize(order.state).includes(term) ||
          normalize(order.platform?.name).includes(term) ||
          normalize(order.platform?.id).includes(term) ||
          normalize(order.skill_master?.id).includes(term) ||
          normalize(order.skill_master?.gamer_tag).includes(term) ||
          normalize(order.total_price).includes(term) ||
          normalize(String(order.id)).includes(term) ||
          order.products?.some((product) =>
            normalize(product.name).includes(term)
          )
        );
      })
      .filter((order) =>
        filter.category ? order.category_id === Number(filter.category) : true
      )
      .filter((order) =>
        filter.platform ? order.platform.id === Number(filter.platform) : true
      )
      .filter((order) => (filter.state ? order.state === filter.state : true));
  }, [orders, searchTerm, filter]);

  // Apply sorting based on filter.sortBy
  const sortedOrders =
    filteredOrders &&
    [...filteredOrders].sort((a, b) => {
      switch (filter.sortBy) {
        case "latest":
          return new Date(b.created_at) - new Date(a.created_at);
        case "oldest":
          return new Date(a.created_at) - new Date(b.created_at);
        case "priceHighToLow":
          return b.total_price - a.total_price;
        case "priceLowToHigh":
          return a.total_price - b.total_price;
        default:
          return 0;
      }
    });

  const getSkillmasters = async () => {
    try {
      setLoading(true);

      const result = await fetchAllSkillmasters();
      if (result.error) {
        toast.error(result.error);
      } else {
        setSkillmasters(result);
      }
    } catch (error) {
      toast.error("Failed to load skillmasters. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSkillmasters();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <h1 className="text-2xl font-semibold">
          All Orders ({orders?.length})
        </h1>
        {(user?.role === "admin" || user?.role === "dev") && (
          <button
            onClick={() => setDialogOpen(true)}
            disabled={loading}
            className="bg-Gold/60 hover:bg-Gold/80 border border-black rounded-lg p-2 flex items-center justify-center gap-2 w-fit mt-6 backdrop-blur-sm disabled:bg-gray-500/20"
          >
            <BiPlus className="h-5 w-5" />
            New Order
          </button>
        )}
      </div>

      {loading && <BiLoader className="h-8 w-8 animate-spin mx-auto" />}

      {error && (
        <p className="w-fit bg-red-500/50 p-4 rounded-lg mx-auto flex items-center justify-center gap-2">
          <IoWarning className="h-5 w-5 mr-2" />
          Failed to load orders. Please try again!
          {/* reload */}
          <button
            onClick={() => {
              loadOrders();
              getSkillmasters();
            }}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
          >
            Reload
          </button>
        </p>
      )}

      <div className="flex flex-col gap-4">
        {orders?.length < 1 ? (
          <p className="text-center w-full">No orders have been created yet!</p>
        ) : (
          !loading &&
          !error &&
          orders && (
            <>
              <div className="flex flex-wrap items-center gap-4">
                <input
                  type="text"
                  autoFocus
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search users..."
                  className="flex-1 min-w-fit p-2 rounded-lg bg-white/10 border border-white/10 hover:border-white/20"
                />

                <OrderSearchFilter filter={filter} setFilter={setFilter} />

                <div className="flex items-center gap-2 w-full flex-wrap">
                  {/* show applied filters */}
                  {Object.keys(filter).length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
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
                      {filter.state && (
                        <FilterButton
                          label={filter.state}
                          onRemove={() =>
                            setFilter({
                              ...filter,
                              state: "",
                            })
                          }
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-6">
                {sortedOrders?.map((order, index) => (
                  <AdminOrderCard
                    key={index}
                    order={order}
                    loadOrders={loadOrders}
                    searchTerm={searchTerm}
                    skillmasters={skillmasters}
                  />
                ))}
              </div>
            </>
          )
        )}
      </div>

      {/* new order dialog */}
      <NewOrderDialog
        dialogOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        loadOrders={loadOrders}
      />
    </div>
  );
};

export default AllOrders;
