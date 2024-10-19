import {
  assignOrderToSkillMaster,
  updateOrderStatus,
} from "@/lib/actions/orders-action";
import { fetchAllSkillmasters } from "@/lib/actions/user-actions";
import { adminOrderStatus, orderStatus } from "@/lib/data";
import { useUserStore } from "@/store/use-user";
import { Dialog, DialogPanel, DialogTitle, Select } from "@headlessui/react";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiImage } from "react-icons/bi";
import { IoClose, IoCopy } from "react-icons/io5";
import { PiGameControllerFill } from "react-icons/pi";

export const AdminOrderDialog = ({
  dialogOpen,
  onClose,
  order,
  loadOrders,
}) => {
  const { user } = useUserStore();

  const [skillmasterId, setSkillmasterId] = useState();
  const [loading, setLoading] = useState(false);
  const [currentOrderState, setCurrentOrderState] = useState(order?.state);
  const [skillmasters, setSkillmasters] = useState(null);

  const handleAssignOrder = async () => {
    try {
      setLoading(true);
      const response = await assignOrderToSkillMaster(order.id, skillmasterId);

      if (response.error) {
        toast.error(response.error);
      } else {
        onClose();
        toast.success("Order assigned to skillmaster successfully!");
      }
    } catch (error) {
      toast.error("Failed to assign order to skillmaster. Please try again!");
    } finally {
      setCurrentOrderState(order?.state);
      setSkillmasterId("");
      setLoading(false);
      loadOrders();
      onClose();
    }
  };

  const handleUpdateState = async () => {
    if (!order?.id) return;

    const confirmed = confirm(
      "Are you sure you want to update the order status?"
    );

    if (!confirmed) return;

    try {
      setLoading(true);
      const response = await updateOrderStatus(order?.id, currentOrderState);

      if (response.error) {
        toast.error(response.error);
      } else {
        onClose();
        toast.success("Order status updated successfully!");
      }
    } catch (error) {
      toast.error("Failed to update order status. Please try again!");
    } finally {
      setCurrentOrderState(order?.state);
      setSkillmasterId("");
      setLoading(false);
      loadOrders();
      onClose();
    }
  };

  const getSkillmasters = async () => {
    try {
      setLoading(true);

      const result = await fetchAllSkillmasters();
      if (result.error) {
        toast.error(result.error);
      } else {
        setSkillmasters(result);
      }
    } catch (error) {
      toast.error("Failed to load skillmasters. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSkillmasters();
  }, []);

  return (
    <Dialog
      open={dialogOpen}
      onClose={onClose}
      as="div"
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-3xl rounded-lg bg-Plum/50 backdrop-blur-lg p-6 space-y-4 relative">
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

            {/* update order status */}
            {(user.role === "admin" ||
              user.role === "dev" ||
              user.role === "skillmaster") &&
              order.state !== currentOrderState && (
                <div className="flex flex-wrap gap-2 w-full bg-white/10 p-4 rounded-lg border border-white/10 hover:border-white/20">
                  <button
                    onClick={handleUpdateState}
                    disabled={loading}
                    className="w-full bg-Gold p-2 rounded-full"
                  >
                    {loading ? "Accepting..." : "Update Order Status"}
                  </button>
                </div>
              )}

            {/* status */}
            <div className="flex flex-wrap gap-2 w-full bg-white/10 p-4 rounded-lg border border-white/10 hover:border-white/20">
              <div className="flex flex-wrap gap-2 bg-black/20 p-2 rounded-lg text-sm flex-1">
                <p>Order Status:</p>
                <p
                  className={clsx(
                    "px-2 rounded-full h-fit border border-white/10",
                    currentOrderState === "in_progress" && "bg-purple-500",
                    currentOrderState === "delayed" && "bg-yellow-500",
                    currentOrderState === "disputed" && "bg-red-500",
                    currentOrderState === "assigned" && "bg-blue-500",
                    currentOrderState === "re_assigned" && "bg-blue-500",
                    currentOrderState === "complete" && "bg-green-500"
                  )}
                >
                  {currentOrderState}
                </p>

                <Select
                  value={currentOrderState}
                  onChange={(e) => {
                    setCurrentOrderState(e.target.value);
                  }}
                  className="block w-full rounded-lg bg-black/20 hover:bg-black/30 py-1.5 px-3 flex-1 min-w-fit"
                >
                  {(user.role === "admin" || user.role === "dev") &&
                    adminOrderStatus.map((item, index) => (
                      <option
                        key={index}
                        value={item.value}
                        className={clsx("bg-neutral-800")}
                      >
                        {item.name}
                      </option>
                    ))}
                </Select>
              </div>

              {order.skill_master.gamer_tag && (
                <div className="flex flex-wrap gap-2 bg-black/20 p-2 rounded-lg text-sm flex-1">
                  <p>Assigned Skillmaster:</p>
                  <p
                    className={clsx(
                      "px-2 rounded-full border border-white/10 h-fit"
                    )}
                  >
                    {order.skill_master.gamer_tag}
                  </p>
                </div>
              )}
            </div>

            {/* assign order to skillmaster */}
            <div className="flex flex-wrap gap-2 w-full bg-white/10 p-4 rounded-lg border border-white/10 hover:border-white/20">
              {skillmasters?.length > 0 && (
                <select
                  value={skillmasterId}
                  onChange={(e) => setSkillmasterId(e.target.value)}
                  className="block w-full rounded-lg bg-black/20 hover:bg-black/30 py-1.5 px-3 flex-1 min-w-fit"
                >
                  <option value="" className="bg-neutral-800" unselectable="on">
                    Select Skillmaster
                  </option>

                  {skillmasters.map((skillmaster) => (
                    <option
                      key={skillmaster.id}
                      value={skillmaster.id}
                      className="bg-neutral-800"
                    >
                      ID: {skillmaster.id} |{" "}
                      {skillmaster.gamer_tag ||
                        skillmaster.first_name +
                          " " +
                          skillmaster.last_name}{" "}
                      | {skillmaster.email}
                    </option>
                  ))}
                </select>
              )}

              <button
                onClick={() => handleAssignOrder()}
                disabled={loading || !skillmasterId}
                className="bg-Gold/80 p-2 rounded-lg hover:bg-Gold/60 disabled:bg-gray-500/20 flex-1"
              >
                {loading ? "Assigning..." : "Assign Order to Skillmaster"}
              </button>
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
