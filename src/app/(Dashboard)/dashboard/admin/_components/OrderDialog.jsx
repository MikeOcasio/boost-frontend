"use client";

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Field,
  Input,
  Label,
} from "@headlessui/react";
import clsx from "clsx";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoClose, IoCopy } from "react-icons/io5";

import { addOrder, deleteOrder, updateOrder } from "@/lib/actions";
import { BiLoader, BiTrash } from "react-icons/bi";

export const orderDialog = ({
  dialogData,
  dialogOpen,
  onClose,
  loadOrders,
}) => {
  const [order, setOrder] = useState(dialogData || getDefaultOrder());
  const [loading, setLoading] = useState(false);

  function getDefaultOrder() {
    return {
      name: "",
      description: "",
      is_active: true,
    };
  }

  // Effect to update the local state when dialogData changes (e.g., opening dialog for edit)
  useEffect(() => {
    if (dialogData) {
      setOrder(dialogData);
    } else {
      setOrder(getDefaultOrder());
    }
  }, [dialogData]);

  // Function to check if the order data is unchanged
  const isDataUnchanged = () => {
    return (
      order.name === dialogData?.name &&
      order.description === dialogData?.description &&
      order.is_active === dialogData?.is_active
    );
  };

  const handleSubmit = async (orderData) => {
    if (orderData.id && isDataUnchanged()) {
      toast.error("No changes were made.");
      return;
    }

    setLoading(true);
    try {
      if (orderData.id) {
        // Update existing order
        const response = await updateOrder(orderData);

        if (response.error) {
          toast.error(response.error);
        } else {
          toast.success("Order updated successfully!");
        }
      } else {
        // Add new order
        const response = await addOrder(orderData);

        if (response.error) {
          toast.error(response.error);
        } else {
          toast.success("Order added successfully!");
        }
      }

      handleClosed();
    } catch (error) {
      console.log("Error submitting order:", error.message);
      toast.error(error.message);
    } finally {
      loadOrders();
      setLoading(false);
    }
  };

  const handleDelete = async (orderId) => {
    if (!orderId) return;

    const confirmed = confirm(
      "Are you sure you want to delete this order? This action cannot be undone."
    );

    if (!confirmed) return;

    setLoading(true);
    try {
      const response = await deleteOrder(orderId);

      if (response.error) {
        // toast.error(response.error);
        toast.error("Error deleting order!");
      } else {
        toast.success("Order deleted successfully!");
        handleClosed();
      }
    } catch (error) {
      console.log("Error deleting order:", error.message);
      toast.error(error.message);
    } finally {
      loadOrders();
      setLoading(false);
    }
  };

  const handleClosed = () => {
    onClose();
    setOrder(dialogData || getDefaultOrder());
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
        <DialogPanel className="w-full max-w-md rounded-lg bg-Plum/50 backdrop-blur-lg p-6 space-y-4 relative">
          <button
            onClick={handleClosed}
            className="rounded-lg hover:bg-white/10 absolute right-0 top-0 m-4"
          >
            <IoClose className="h-8 w-8" />
          </button>

          <DialogTitle className="text-lg font-semibold">
            {dialogData ? "Update Order" : "Add New Game Order"}
          </DialogTitle>

          <div className="flex flex-col gap-4">
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
                  ID: {order.id}
                </span>
                <IoCopy className="h-8 w-8 ml-2 p-2 hover:bg-white/10 rounded-lg" />
              </button>
            )}

            {/* order Name Field */}
            <Field className="flex flex-col gap-1 w-full">
              <Label className="text-sm">Order Name</Label>
              <Input
                type="text"
                placeholder="Order name"
                autoFocus
                className="input-field"
                value={order.name}
                onChange={(e) => setOrder({ ...order, name: e.target.value })}
              />
            </Field>

            <div className="flex items-center justify-between gap-4">
              {/* Delete Button */}
              {dialogData && (
                <button
                  onClick={() => handleDelete(order.id)}
                  disabled={loading}
                  className="p-2 rounded-lg hover:bg-white/10 disabled:bg-gray-500/20"
                >
                  {loading ? (
                    <BiLoader className="h-5 w-5 animate-spin" />
                  ) : (
                    <BiTrash className="h-5 w-5 text-red-600" />
                  )}
                </button>
              )}

              {/* Submit Button */}
              <button
                onClick={() => handleSubmit(order)}
                disabled={loading || isDataUnchanged()}
                className={clsx(
                  "bg-Gold/80 p-2 rounded-lg hover:bg-Gold/60 disabled:bg-gray-500/20 flex-1",
                  {
                    "cursor-not-allowed": loading || isDataUnchanged(),
                  }
                )}
              >
                {loading
                  ? "Submitting..."
                  : dialogData
                  ? "Update Order"
                  : "Add Order"}
              </button>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
