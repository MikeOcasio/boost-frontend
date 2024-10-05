"use client";

import { useEffect, useState } from "react";
import { AdminOrderCard } from "../_components/AdminOrderCard";
import { fetchAllOrders } from "@/lib/actions";
import { BiLoader } from "react-icons/bi";
import { IoWarning } from "react-icons/io5";
import toast from "react-hot-toast";

const AllOrders = () => {
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const loadOrders = async () => {
    setLoading(true);
    setError(false);

    try {
      const result = await fetchAllOrders();
      if (result.error) {
        setError(true);
        toast.error(result.error);
      } else {
        setOrders(result);
      }
    } catch (e) {
      setError(true);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // loadOrders();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">All Orders</h1>

      {loading && <BiLoader className="h-8 w-8 animate-spin mx-auto" />}

      {error && (
        <p className="w-fit bg-red-500/50 p-4 rounded-lg mx-auto flex items-center justify-center gap-2">
          <IoWarning className="h-5 w-5 mr-2" />
          Failed to load orders. Please try again!
        </p>
      )}

      <div className="flex flex-col gap-4">
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
    </div>
  );
};

export default AllOrders;
