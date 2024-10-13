import { useCartStore } from "@/store/use-cart";
import Image from "next/image";
import { BiMinus, BiPlus } from "react-icons/bi";

export const CheckoutOrderCard = ({ order }) => {
  const { increaseQuantity, decreaseQuantity } = useCartStore();

  if (!order) return null;

  return (
    <div key={order.id} className="flex flex-col gap-1 w-full">
      <div className="flex flex-wrap justify-between bg-white/10 rounded-lg p-2 border border-white/10 hover:border-white/20">
        <div className="flex flex-wrap items-center gap-x-2">
          {order.image && (
            <Image
              src={order.image}
              alt={order.name}
              height={150}
              width={150}
              unoptimized
              className="rounded-md object-contain bg-black/20 p-4"
            />
          )}
          <div className="flex flex-col gap-y-1 justify-between">
            <p className="text-sm font-semibold">
              {order.name}{" "}
              <span className="px-2 py-1 rounded-md bg-black/30">
                {order.platform.name}
              </span>
            </p>

            <div className="flex flex-wrap gap-2 items-center">
              {/* increment and decrement quantity */}
              <button
                onClick={() => decreaseQuantity(order.id)}
                className="p-1 border border-white/10 bg-white/10 hover:border-white/20 rounded-md"
              >
                <BiMinus className="h-5 w-5" />
              </button>

              <p className="text-xs text-gray-300 bg-white/10 px-2 rounded-md">
                {order.quantity}
              </p>

              <button
                onClick={() => increaseQuantity(order.id)}
                className="p-1 border border-white/10 bg-white/10 hover:border-white/20 rounded-md"
              >
                <BiPlus className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <p className="text-lg font-semibold">${order.price * order.quantity}</p>
      </div>
    </div>
  );
};
