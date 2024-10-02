import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { IoClose, IoCopy } from "react-icons/io5";

export const OrderDialog = ({ dialogOpen, onClose, order }) => {
  return (
    <Dialog
      open={dialogOpen}
      onClose={onClose}
      as="div"
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-xl rounded-lg bg-Plum/50 backdrop-blur-lg p-6 space-y-4 relative">
          <button
            onClick={() => onClose()}
            className="rounded-lg hover:bg-white/10 absolute right-0 top-0 m-4"
          >
            <IoClose className="h-8 w-8" />
          </button>

          <DialogTitle className="text-lg font-semibold">
            Order Details
          </DialogTitle>

          <div className="flex flex-col gap-4 overflow-y-auto max-h-[80vh] no-scrollbar">
            {/* id */}
            {order.id && (
              <button
                onClick={(e) => {
                  navigator.clipboard.writeText(order.id);

                  toast.success("Copied to clipboard!");
                }}
                className="flex gap-2 items-center rounded-lg bg-black/30 px-2 py-1 hover:bg-black/40 w-fit"
              >
                <span className="text-sm font-semibold break-all">
                  Order ID: #{order.id}
                </span>
                <IoCopy className="h-8 w-8 ml-2 p-2 hover:bg-white/10 rounded-lg" />
              </button>
            )}

            {/* status */}
            <div className="flex flex-wrap gap-2 w-full bg-white/10 p-4 rounded-lg border border-white/10 hover:border-white/20">
              <div className="flex flex-wrap gap-2 bg-black/20 p-2 rounded-lg text-sm flex-1">
                <p>Order Status:</p>
                <p
                  className={clsx(
                    "px-2 rounded-full",
                    order.order_status.toLowerCase() === "pending"
                      ? "bg-yellow-500/80 text-white"
                      : "bg-green-500/80 text-white"
                  )}
                >
                  {order.order_status}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 bg-black/20 p-2 rounded-lg text-sm flex-1">
                <p>Payment Status:</p>
                <p
                  className={clsx(
                    "px-2 rounded-full",
                    order.payment_status === "pending"
                      ? "bg-yellow-500/80 text-white"
                      : "bg-green-500/80 text-white"
                  )}
                >
                  {order.payment_status}
                </p>
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col gap-1 w-full">
              {order.product.map((product, index) => (
                <Link href={`/games/${product.product_id}`} target="_blank">
                  <div
                    key={index}
                    className="flex flex-wrap justify-between items-center bg-black/20 rounded-lg p-2 hover:bg-black/30"
                  >
                    <div className="flex flex-wrap items-center gap-x-2">
                      <Image
                        src={product.image_url}
                        alt={product.product_name}
                        height={70}
                        width={70}
                        unoptimized
                        className="rounded-md object-contain bg-white/10 p-2"
                      />
                      <div className="flex flex-col gap-y-1">
                        <p className="text-sm font-semibold">
                          {product.product_name} / {product.platform}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          <p className="text-xs text-gray-300 bg-white/10 px-1 rounded-md">
                            Skill Master: {product.skill_master_id}
                          </p>
                          <p className="text-xs text-gray-300 bg-white/10 px-1 rounded-md">
                            Qty: {product.quantity}
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm font-semibold">
                      ${product.price * product.quantity}
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
                  {order.product.reduce(
                    (acc, curr) => acc + Number(curr.price * curr.quantity),
                    0
                  )}
                </span>
              </p>
              <p className="text-sm flex flex-wrap gap-2 justify-between items-center pb-2 border-b border-white/10">
                Tax
                <span>${order.tax}</span>
              </p>
              <p className="text-sm flex flex-wrap gap-2 justify-between items-center">
                Promotion
                <span>{order.promotion_id}</span>
              </p>
            </div>

            {/* data and price */}
            <div className="flex flex-wrap gap-4 justify-between items-center">
              {/* Date */}
              <p className="text-sm text-gray-300">Order Date: {order.date}</p>

              {/* totol_price */}
              <p className="text-lg">Total Price: ${order.total_price}</p>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
