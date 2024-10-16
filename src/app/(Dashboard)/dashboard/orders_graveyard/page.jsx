"use client";

import { useUserStore } from "@/store/use-user";
import OrdersGraveyardCard from "../../_components/OrdersGraveyardCard";
import { fetchAllGraveyardOrders } from "@/lib/actions";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiLoader } from "react-icons/bi";
import { IoWarning } from "react-icons/io5";

const OrderGraveyardPage = () => {
  const { user } = useUserStore();

  const [graveyardOrders, setGraveyardOrders] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const loadGraveyardOrders = async () => {
    setLoading(true);
    setError(false);

    try {
      const result = await fetchAllGraveyardOrders();
      if (result.error) {
        setError(true);
        toast.error(result.error);
      } else {
        setGraveyardOrders(result.orders);
      }
    } catch (e) {
      setError(true);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGraveyardOrders();
  }, []);

  return (
    <div className="space-y-4">
      <p>Orders Graveyard</p>

      <p className="text-xs text-white/80">
        You can pick any orders from here as per your requirements.
      </p>

      {loading && <BiLoader className="h-8 w-8 animate-spin mx-auto" />}

      {error && (
        <p className="w-fit bg-red-500/50 p-4 rounded-lg mx-auto flex items-center justify-center gap-2">
          <IoWarning className="h-5 w-5 mr-2" />
          Failed to load orders. Please try again!
          {/* reload */}
          <button
            onClick={loadGraveyardOrders}
            className="p-2 rounded-lg bg-white/10"
          >
            Reload
          </button>
        </p>
      )}

      {(user.role === "admin" ||
        user.role === "dev" ||
        user.role === "skillmaster") &&
        !loading &&
        !error &&
        graveyardOrders?.map((order, index) => (
          <OrdersGraveyardCard key={index} order={order} />
        ))}
    </div>
  );
};

export default OrderGraveyardPage;
