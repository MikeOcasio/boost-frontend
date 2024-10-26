import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { IoClose, IoCopy } from "react-icons/io5";

import { acceptGraveyardOrder } from "@/lib/actions/orders-action";
import { PiGameControllerFill } from "react-icons/pi";
import { useUserStore } from "@/store/use-user";
import { BiImage } from "react-icons/bi";

export const OrderGraveyardDialog = ({
  dialogOpen,
  onClose,
  order,
  groupedProducts,
  loadGraveyardOrders,
  loadOrders,
}) => {
  const [loading, setLoading] = useState(false);

  const { user } = useUserStore();

  const handleAcceptOrder = async () => {
    if (user?.role === "admin" || user?.role === "dev") {
      const confirmed = confirm(
        "Are you sure, you want to assign this order to your self?"
      );

      if (!confirmed) return;
    }

    try {
      setLoading(true);
      const response = await acceptGraveyardOrder(order?.id);

      if (response.error) {
        toast.error(response.error);
      } else {
        loadOrders();
        onClose();
        toast.success("Order accepted!");
      }
    } catch (error) {
      toast.error("Failed to accept order. Please try again!");
    } finally {
      setLoading(false);
      loadGraveyardOrders();
    }
  };

  return (
    <Dialog
      open={dialogOpen}
      onClose={onClose}
      as="div"
      className="relative z-50 text-white"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-2xl rounded-lg bg-Gold/20 backdrop-blur-lg p-6 space-y-4 relative">
          <button
            onClick={() => onClose()}
            className="rounded-lg hover:bg-white/10 absolute right-0 top-0 m-4"
          >
            <IoClose className="h-8 w-8" />
          </button>

          <DialogTitle className="text-lg font-semibold">
            Order Details
          </DialogTitle>

          <span className="text-xs text-white/80">
            You can pick the order by accepting it. and order gonna assign to
            you.
          </span>

          <div className="flex flex-col gap-4 overflow-y-auto max-h-[80vh] no-scrollbar">
            <div className="flex flex-wrap justify-between items-center gap-2">
              {/* id */}
              {order.internal_id && (
                <button
                  onClick={(e) => {
                    navigator.clipboard.writeText(order.internal_id);

                    toast.success("Copied to clipboard!");
                  }}
                  className="flex gap-2 items-center rounded-lg bg-black/30 px-2 py-1 hover:bg-black/40 w-fit"
                >
                  <span className="text-sm font-semibold break-all">
                    Order ID: #{order.internal_id}
                  </span>
                  <IoCopy className="h-8 w-8 ml-2 p-2 hover:bg-white/10 rounded-lg" />
                </button>
              )}

              {/* Platform */}
              <div className="flex flex-wrap gap-2 text-sm items-center">
                <span className="font-semibold px-1 rounded-md border border-white/10 flex gap-2 items-center">
                  <PiGameControllerFill className="h-5 w-5" />{" "}
                  <span>{order.platform?.name}</span>
                </span>
              </div>
            </div>

            {/* Accept Order */}
            <div className="flex flex-wrap gap-2 w-full bg-white/10 p-4 rounded-lg border border-white/10 hover:border-white/20">
              <button
                onClick={handleAcceptOrder}
                disabled={loading}
                className="w-full bg-Gold p-2 rounded-full"
              >
                {loading ? "Accepting..." : "Accept Order"}
              </button>
            </div>

            {/* status */}
            <div className="flex flex-wrap gap-2 w-full bg-white/10 p-4 rounded-lg border border-white/10 hover:border-white/20">
              <div className="flex flex-wrap gap-2 bg-black/20 p-2 rounded-lg text-sm flex-1">
                <p>Order Status:</p>
                <p
                  className={clsx(
                    "font-semibold px-1 rounded-md border border-white/10",

                    order.state === "in_progress" && "bg-purple-500",
                    order.state === "delayed" && "bg-yellow-500",
                    order.state === "disputed" && "bg-red-500",
                    order.state === "assigned" && "bg-blue-500",
                    order.state === "re_assigned" && "bg-blue-500",
                    order.state === "complete" && "bg-green-500"
                  )}
                >
                  {order.state}
                </p>
              </div>

              {/* platform */}

              <div className="flex flex-wrap gap-2 bg-black/20 p-2 rounded-lg text-sm flex-1">
                <span>Platform:</span>
                <span className="font-semibold px-1 rounded-md border border-white/10 flex gap-2 items-center">
                  <PiGameControllerFill className="h-5 w-5" />{" "}
                  <span>{order.platform?.name}</span>
                </span>
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col gap-1 w-full">
              {groupedProducts?.map((product, index) => (
                <Link
                  key={index}
                  href={`/games/${product.product_id}`}
                  target="_blank"
                >
                  <div className="flex gap-4 flex-wrap justify-between items-center bg-black/20 rounded-lg p-2 hover:bg-black/30">
                    <div className="flex flex-wrap items-center gap-x-2">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          height={70}
                          width={70}
                          priority
                          className="rounded-md object-contain bg-white/10 p-2"
                        />
                      ) : (
                        <BiImage className="h-16 w-16 bg-white/10 p-2 rounded-md" />
                      )}
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-semibold">{product.name}</p>
                        <p className="text-sm">Qty: {product.quantity}</p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold">
                      ${(product.price * product.quantity).toFixed(2)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* tax & promotion */}
            <div className="flex flex-col gap-2 border border-white/10 p-4 rounded-lg">
              <p className="text-sm flex flex-wrap gap-2 justify-between items-center border-b pb-2 border-white/10">
                <span>Price</span>
                <span>
                  $
                  {order.products
                    .reduce((acc, curr) => acc + Number(curr.price), 0)
                    .toFixed(2)}
                </span>
              </p>
              {order.promotion_id && (
                <p className="text-sm flex flex-wrap gap-2 justify-between items-center pb-2 border-b border-white/10">
                  Promotion
                  <span>{order.promotion_id}</span>
                </p>
              )}
              <p className="text-sm flex flex-wrap gap-2 justify-between items-center ">
                Tax
                <span>
                  $
                  {order.products
                    .reduce((acc, curr) => acc + Number(curr.tax), 0)
                    .toFixed(2)}
                </span>
              </p>
            </div>

            {/* data and price */}
            <div className="flex flex-wrap gap-4 justify-between items-center">
              {/* Date */}
              <p className="text-sm text-gray-300">
                Order Date: {new Date(order.created_at).toLocaleString()}
              </p>

              {/* totol_price */}
              <p className="text-lg">Total Price: ${order.total_price}</p>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
