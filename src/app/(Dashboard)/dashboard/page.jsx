"use client";

import Link from "next/link";
import { BiLoader } from "react-icons/bi";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoWarning } from "react-icons/io5";

import OrdersGraveyardCard from "../_components/OrdersGraveyardCard";
import AdminTabs from "../_components/AdminTabs";
import { useUserStore } from "@/store/use-user";
import OrderCard from "@/components/OrderCard";
import { fetchAllOrders } from "@/lib/actions/orders-action";

const UserDashboard = () => {
  const { user } = useUserStore();

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

  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        User details loading, please be patient...
        <BiLoader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-center text-lg font-semibold">
        Welcome, {user?.first_name} {user?.last_name}
        {(user?.role === "dev" ||
          user?.role === "admin" ||
          user?.role === "skillmaster") && (
          <span className="px-2 py-1 rounded-md bg-white/10 ml-2 text-xs">
            {user.role}
          </span>
        )}
      </h2>

      {/* Admin tab*/}
      {(user.role === "admin" || user.role === "dev") && <AdminTabs />}

      {/* Orders graveyard */}
      {(user.role === "admin" ||
        user.role === "dev" ||
        user.role === "skillmaster") && (
        <>
          <div className="flex flex-col gap-y-4">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <h2 className="text-lg font-semibold">Orders Graveyard</h2>

              <Link href="/dashboard/orders_graveyard">
                <button className="px-3 py-2 transition-all hover:bg-white/10 text-white rounded-lg border border-white/10">
                  View All
                </button>
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            {orders?.map((order, index) => (
              <OrdersGraveyardCard key={index} order={order} />
            ))}
          </div>
        </>
      )}

      {loading && <BiLoader className="h-8 w-8 animate-spin mx-auto" />}

      {error && (
        <p className="w-fit bg-red-500/50 p-4 rounded-lg mx-auto flex items-center justify-center gap-2">
          <IoWarning className="h-5 w-5 mr-2" />
          Failed to load orders. Please try again!
          {/* reload */}
          <button onClick={loadOrders} className="p-2 rounded-lg bg-white/10">
            Reload
          </button>
        </p>
      )}

      {/* Recent Orders */}
      {!loading && !error && orders?.length > 0 ? (
        <div className="flex flex-col gap-y-4">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <h2 className="text-lg font-semibold">Recent Orders</h2>

            <Link href="/dashboard/orders">
              <button className="px-3 py-2 transition-all hover:bg-white/10 text-white rounded-lg border border-white/10">
                View All
              </button>
            </Link>
          </div>

          <div className="space-y-4">
            {orders.map((order, index) => (
              <OrderCard key={index} order={order} />
            ))}
          </div>
        </div>
      ) : (
        !loading && (
          <p className="text-center w-full">No orders have been created yet!</p>
        )
      )}
    </div>
  );
};

export default UserDashboard;
