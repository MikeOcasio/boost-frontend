"use client";

import Link from "next/link";
import { BiLoader } from "react-icons/bi";

import { orders } from "@/lib/data";
import OrderCard from "../_components/OrderCard";
import AdminTabs from "../_components/AdminTabs";
import { useUserStore } from "@/store/use-user";

const UserDashboard = () => {
  const { user } = useUserStore();

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
      </h2>

      {/* Admin tab*/}
      {(user.role === "admin" || user.role === "dev") && <AdminTabs />}

      {/* Recent Orders */}
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
    </div>
  );
};

export default UserDashboard;
