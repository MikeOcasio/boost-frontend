import OrderCard from "@/components/OrderCard";
import { orders } from "@/lib/data";

const AllOrdersPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">All Orders</h1>

      <div className="flex flex-col gap-4">
        {orders.map((order, index) => (
          <OrderCard key={index} order={order} />
        ))}
      </div>
    </div>
  );
};

export default AllOrdersPage;
