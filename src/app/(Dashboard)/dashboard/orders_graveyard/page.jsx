"use client";

import { useUserStore } from "@/store/use-user";
import OrdersGraveyardCard from "../../_components/OrdersGraveyardCard";
import { orders } from "@/lib/data";

const OrderGraveyardPage = () => {
  const { user } = useUserStore();

  return (
    <div className="space-y-4">
      <p>Orders Graveyard</p>

      <p className="text-xs text-white/80">
        You can pick any orders from here as per your requirements.
      </p>

      {(user.role === "admin" ||
        user.role === "dev" ||
        user.role === "skillmaster") &&
        orders.map((order, index) => (
          <OrdersGraveyardCard key={index} order={order} />
        ))}
    </div>
  );
};

export default OrderGraveyardPage;
