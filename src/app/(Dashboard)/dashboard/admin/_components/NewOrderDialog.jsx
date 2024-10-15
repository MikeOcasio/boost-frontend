"use client";

import { createOrder } from "@/lib/actions/orders-action";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Field,
  Input,
  Label,
} from "@headlessui/react";
import clsx from "clsx";
import { useState } from "react";
import toast from "react-hot-toast";
import { IoAddCircleOutline, IoClose } from "react-icons/io5";

export const NewOrderDialog = ({ dialogOpen, onClose, loadOrders }) => {
  const [orderData, setOrderData] = useState({
    user_id: null,
    state: "",
    platform: null,
    product_ids: [],
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (
      !orderData.user_id ||
      !orderData.state ||
      !orderData.platform ||
      !orderData.product_ids?.length > 0 ||
      !orderData.product_ids?.every((product_id) => product_id.trim())
    ) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const response = await createOrder(orderData);

      if (response.error) {
        toast.error(response.error);
      }

      toast.success("Order added successfully!");
      handleClosed();
    } catch (error) {
      console.log("Error submitting Order:", error.message);
      toast.error(error.message);
    } finally {
      loadOrders();
      setLoading(false);
    }
  };

  const handleClosed = () => {
    onClose();
    setOrderData({
      user_id: null,
      state: null,
      platform: null,
      product_ids: [],
    });
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
            Add New Order
          </DialogTitle>

          <div className="flex flex-col gap-4">
            {/* user id */}
            <Field className="flex flex-col gap-1 w-full">
              <Label className="text-sm">User ID</Label>
              <Input
                type="number"
                placeholder="user id"
                autoFocus
                className="input-field"
                value={orderData.user_id}
                onChange={(e) =>
                  setOrderData({ ...orderData, user_id: e.target.value })
                }
              />
            </Field>

            {/* state Field */}
            <Field className="flex flex-col gap-1 w-full">
              <Label className="text-sm">Order State</Label>
              <Input
                type="text"
                placeholder="order state"
                autoFocus
                className="input-field"
                value={orderData.state}
                onChange={(e) =>
                  setOrderData({ ...orderData, state: e.target.value })
                }
              />
            </Field>

            {/* platform */}
            <Field className="flex flex-col gap-1 w-full">
              <Label className="text-sm">Platform</Label>
              <Input
                type="number"
                placeholder="platform"
                autoFocus
                className="input-field"
                value={orderData.platform}
                onChange={(e) =>
                  setOrderData({ ...orderData, platform: e.target.value })
                }
              />
            </Field>

            {/* product_ids */}
            <Field className="flex flex-col gap-1 w-full">
              <div className="flex items-center gap-4 justify-between">
                <Label className="text-sm">Product IDs</Label>
                {/* add new field for product ids */}
                <button
                  onClick={() =>
                    setOrderData({
                      ...orderData,
                      product_ids: [...orderData.product_ids, ""],
                    })
                  }
                  className="bg-white/10 p-1 rounded-lg border border-white/20 hover:bg-white/20"
                >
                  <IoAddCircleOutline className="h-5 w-5" />
                </button>
              </div>
              {orderData.product_ids?.map((product_id, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 justify-between"
                >
                  <Input
                    type="number"
                    placeholder="product id"
                    autoFocus
                    className="input-field"
                    value={product_id}
                    onChange={(e) =>
                      setOrderData({
                        ...orderData,
                        product_ids: [
                          ...orderData.product_ids?.slice(0, index),
                          e.target.value,
                          ...orderData.product_ids?.slice(index + 1),
                        ],
                      })
                    }
                  />
                  <button
                    onClick={() =>
                      setOrderData({
                        ...orderData,
                        product_ids: [
                          ...orderData.product_ids?.slice(0, index),
                          ...orderData.product_ids?.slice(index + 1),
                        ],
                      })
                    }
                    className="bg-white/10 p-1 rounded-lg border border-white/20 hover:bg-white/20"
                  >
                    <IoClose className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </Field>

            <div className="flex items-center justify-between gap-4">
              {/* Submit Button */}
              <button
                onClick={() => handleSubmit()}
                disabled={
                  loading ||
                  !orderData.user_id?.trim() ||
                  !orderData.state?.trim() ||
                  !orderData.platform?.trim() ||
                  !orderData.product_ids?.length > 0 ||
                  !orderData.product_ids?.every((product_id) =>
                    product_id.trim()
                  )
                }
                className={clsx(
                  "bg-Gold/80 p-2 rounded-lg hover:bg-Gold/60 disabled:bg-gray-500/20 flex-1",
                  {
                    "cursor-not-allowed":
                      loading ||
                      !orderData.user_id?.trim() ||
                      !orderData.state?.trim(),
                  }
                )}
              >
                {loading ? "Submitting..." : "Add Order"}
              </button>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
