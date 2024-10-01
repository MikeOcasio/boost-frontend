"use client";

import { orders } from "@/lib/data";
import OrderCard from "../_components/OrderCard";
import Link from "next/link";
import AdminTabs from "../_components/AdminTabs";

const UserDashboard = () => {
  const user = { name: "Nikhil", isAdmin: true };

  return (
    <div className="space-y-6">
      <h2 className="text-center text-lg font-semibold">
        Welcome, {user.name}
      </h2>

      {/* Admin tab*/}
      {user.isAdmin && <AdminTabs />}

      {/* Recent Orders */}
      <div className="flex flex-col gap-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Recent Orders</h2>
          <Link href="/dashboard/orders">
            <button className="px-3 py-2 transition-all hover:bg-neutral-500/50 text-white rounded-md">
              View All
            </button>
          </Link>
        </div>

        <div className="flex flex-wrap gap-4">
          {orders.map((order, index) => (
            <OrderCard key={index} order={order} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
