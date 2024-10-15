"use client";

import { useEffect, useState } from "react";
import { BiLoader, BiPlus } from "react-icons/bi";
import { IoWarning } from "react-icons/io5";
import toast from "react-hot-toast";

import { AdminOrderCard } from "../_components/AdminOrderCard";
import { fetchAllOrders } from "@/lib/actions/orders-action";
import { NewOrderDialog } from "../_components/NewOrderDialog";

const AllOrders = () => {
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);

  const loadOrders = async () => {
    setLoading(true);
    setError(false);

    try {
      const result = await fetchAllOrders();
      if (result.error) {
        setError(true);
        toast.error(result.error);
      } else {
        setOrders(result?.orders);
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

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <h1 className="text-2xl font-semibold">All Orders</h1>
        <button
          onClick={() => setDialogOpen(true)}
          disabled={loading}
          className="bg-Gold/60 hover:bg-Gold/80 border border-black rounded-lg p-2 flex items-center justify-center gap-2 w-fit mt-6 backdrop-blur-sm disabled:bg-gray-500/20"
        >
          <BiPlus className="h-5 w-5" />
          New Order
        </button>
      </div>

      {loading && <BiLoader className="h-8 w-8 animate-spin mx-auto" />}

      {error && (
        <p className="w-fit bg-red-500/50 p-4 rounded-lg mx-auto flex items-center justify-center gap-2">
          <IoWarning className="h-5 w-5 mr-2" />
          Failed to load orders. Please try again!
        </p>
      )}

      <div className="flex flex-wrap gap-4">
        {orders?.length < 1 ? (
          <p className="text-center w-full">No orders have been created yet!</p>
        ) : (
          !loading &&
          !error &&
          orders &&
          orders?.map((order, index) => (
            <AdminOrderCard key={index} order={order} />
          ))
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
