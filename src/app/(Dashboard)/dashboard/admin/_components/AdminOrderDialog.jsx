import { assignOrderToSkillMaster } from "@/lib/actions/orders-action";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { IoClose, IoCopy } from "react-icons/io5";
import { PiGameControllerFill } from "react-icons/pi";

export const AdminOrderDialog = ({ dialogOpen, onClose, order }) => {
  const [skillmasterId, setSkillmasterId] = useState();
  const [loading, setLoading] = useState(false);

  const handleAssignOrder = async () => {
    try {
      setLoading(true);
      const response = await assignOrderToSkillMaster(order.id, skillmasterId);

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Order assigned to skillmaster successfully!");
      }
    } catch (error) {
      toast.error("Failed to assign order to skillmaster. Please try again!");
    } finally {
      setLoading(false);
    }
  };

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
            <div className="flex flex-wrap gap-2 justify-between items-center">
              {/* id */}
              {order.internal_id && (
                <button
                  onClick={(e) => {
                    navigator.clipboard.writeText(order.id);

                    toast.success("Copied to clipboard!");
                  }}
                  className="flex gap-2 items-center rounded-lg bg-black/30 px-2 py-1 hover:bg-black/40 w-fit"
                >
                  <span className="text-sm font-semibold break-all">
                    Order ID: #{order.internal_id}
                  </span>
                  <IoCopy className="h-8 w-8 p-2 hover:bg-white/10 rounded-lg" />
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

            {/* assign order to skillmaster */}
            <div className="flex flex-wrap gap-2 w-full bg-white/10 p-4 rounded-lg border border-white/10 hover:border-white/20">
              <input
                type="text"
                placeholder="Skillmaster ID"
                value={skillmasterId}
                onChange={(e) => setSkillmasterId(e.target.value)}
                className="input-field"
              />

              <button
                onClick={() => handleAssignOrder()}
                disabled={loading}
                className="bg-Gold/80 p-2 rounded-lg hover:bg-Gold/60 disabled:bg-gray-500/20 flex-1"
              >
                {loading ? "Assigning..." : "Assign Order to Skillmaster"}
              </button>
            </div>

            {/* status */}
            <div className="flex flex-wrap gap-2 w-full bg-white/10 p-4 rounded-lg border border-white/10 hover:border-white/20">
              <div className="flex flex-wrap gap-2 bg-black/20 p-2 rounded-lg text-sm flex-1">
                <p>Order Status:</p>
                <p
                  className={clsx(
                    "px-2 rounded-full h-fit",
                    order.state === "assigned" && "bg-yellow-600",
                    order.state === "complete" && "bg-green-600",
                    order.state === "open" && "bg-white/10"
                  )}
                >
                  {order.state}
                </p>
              </div>

              {order.skill_master.gamer_tag && (
                <div className="flex flex-wrap gap-2 bg-black/20 p-2 rounded-lg text-sm flex-1">
                  <p>Assigned Skillmaster:</p>
                  <p
                    className={clsx("px-2 rounded-full border border-white/10")}
                  >
                    {order.skill_master.gamer_tag}
                  </p>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col gap-1 w-full">
              {order.products?.map((product, index) => (
                <Link
                  key={index}
                  href={`/games/${product.product_id}`}
                  target="_blank"
                >
                  <div className="flex flex-wrap justify-between items-center bg-black/20 rounded-lg p-2 hover:bg-black/30">
                    <div className="flex flex-wrap items-center gap-x-2">
                      {product.image && (
                        <Image
                          src={product.image}
                          alt={product.name}
                          height={70}
                          width={70}
                          priority
                          className="rounded-md object-contain bg-white/10 p-2"
                        />
                      )}
                      <div className="flex flex-col gap-y-1">
                        <p className="text-sm font-semibold">{product.name}</p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold">${product.price}</p>
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
              <p className="text-sm flex flex-wrap gap-2 justify-between items-center">
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
