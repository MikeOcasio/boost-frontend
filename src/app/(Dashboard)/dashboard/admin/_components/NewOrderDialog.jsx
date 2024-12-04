"use client";

import { createOrder } from "@/lib/actions/orders-action";
import { fetchAllGames } from "@/lib/actions/products-action";
import { fetchAllUsers } from "@/lib/actions/user-actions";
import { adminOrderStatus } from "@/lib/data";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Field,
  Label,
  Select,
} from "@headlessui/react";
import clsx from "clsx";
import { useEffect, useState } from "react";
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
  const [allUsers, setAllUsers] = useState(null);
  const [allProducts, setAllProducts] = useState(null);
  const [allPlatforms, setAllPlatforms] = useState(null);
  const [filterProducts, setFilterProducts] = useState(null);

  const loadUsers = async () => {
    try {
      setLoading(true);

      const response = await fetchAllUsers();

      if (response.error) {
        toast.error(response.error);
      } else {
        setAllUsers(response);
      }
    } catch (error) {
      // console.log("Error loading users:", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);

      const response = await fetchAllGames();

      if (response.error) {
        toast.error(response.error);
      } else {
        setAllProducts(response);
      }
    } catch (error) {
      // console.log("Error loading products:", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    loadProducts();
  }, []);

  const handleSubmit = async () => {
    const { user_id, state, platform, product_ids } = orderData;

    if (!user_id || !state || !platform || product_ids.length === 0) {
      toast.error("All fields are required.");

      return;
    }

    const data = {
      order: { user_id, state, platform },
      product_ids,
    };

    try {
      setLoading(true);
      const response = await createOrder(data);

      if (response.error) {
        toast.error(JSON.stringify(response.error));
      } else {
        toast.success("Order added successfully!");
        handleClosed();
      }
    } catch (error) {
      // console.log("Error submitting Order:", error.message);
      toast.error(error.message);
    } finally {
      loadOrders();
      setLoading(false);
    }
  };

  const handleClosed = () => {
    onClose();
    setOrderData({ user_id: null, state: "", platform: null, product_ids: [] });
    setFilterProducts([]);
  };

  const handlePlatformChange = (e) => {
    const platformId = Number(e.target.value);

    setOrderData((prev) => ({
      ...prev,
      platform: platformId,
      product_ids: [],
    }));

    const filtered = allProducts.filter((item) =>
      item.platforms.some((plat) => plat.id === platformId)
    );

    setFilterProducts(filtered);
  };

  const handleUserChange = (e) => {
    const userId = Number(e.target.value);
    const selectedUser = allUsers.find((user) => user.id === userId);

    setOrderData((prev) => ({
      ...prev,
      user_id: userId,
      platform: null,
      product_ids: [],
    }));

    if (selectedUser) {
      setAllPlatforms(selectedUser.platforms || []);
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
        <DialogPanel className="w-full max-w-2xl rounded-lg bg-Plum/50 backdrop-blur-lg p-6 space-y-4 relative">
          <button
            onClick={handleClosed}
            className="rounded-lg hover:bg-white/10 absolute right-0 top-0 m-4"
          >
            <IoClose className="h-8 w-8" />
          </button>

          <DialogTitle className="text-lg font-semibold">
            Add New Order
          </DialogTitle>

          <span className="text-xs text-white/80">
            To create an new order you need to select UserId then order status
            (Open - recommended) then select platform and add product. You can
            add multiple products.
          </span>

          <div className="flex flex-col gap-4 overflow-y-auto max-h-[80vh] no-scrollbar">
            {/* user id */}
            <Field className="flex flex-col gap-1 w-full">
              <Label className="text-sm">User ID</Label>

              <Select
                disabled={loading}
                value={orderData.user_id || ""}
                onChange={handleUserChange}
                className="block w-full rounded-lg bg-white/10 hover:bg-white/30 p-2"
              >
                <option value="" className={clsx("bg-neutral-800")}>
                  Select User
                </option>

                {allUsers?.map(
                  (item, index) =>
                    !item.deleted_at &&
                    item.role === "customer" && (
                      <option
                        key={index}
                        value={item.id}
                        className={clsx("bg-neutral-800 flex flex-col gap-1")}
                      >
                        ID: {item.id} | {item.role} | {item.first_name}{" "}
                        {item.last_name} | {item.email}
                      </option>
                    )
                )}
              </Select>
            </Field>

            {/* state Field */}
            <Field className="flex flex-col gap-1 w-full">
              <Label className="text-sm">Order State</Label>

              <Select
                disabled={loading}
                value={orderData.state || ""}
                onChange={(e) =>
                  setOrderData({ ...orderData, state: e.target.value })
                }
                className=" block w-full rounded-lg bg-white/10 hover:bg-white/30 p-2"
              >
                <option value={0} className={clsx("bg-neutral-800")}>
                  Select State
                </option>

                {adminOrderStatus.map((item, index) => (
                  <option
                    key={index}
                    value={item.value}
                    className={clsx("bg-neutral-800")}
                  >
                    {item.name}
                  </option>
                ))}
              </Select>
            </Field>

            {/* platform */}
            <Field className="flex flex-col gap-1 w-full">
              <Label className="text-sm">Platform</Label>
              <Select
                disabled={loading}
                value={orderData.platform || ""}
                className=" block w-full rounded-lg bg-white/10 hover:bg-white/30 p-2"
                onChange={handlePlatformChange}
              >
                <option value="" className={clsx("bg-neutral-800")}>
                  Select Platform
                </option>

                {allPlatforms?.map((item, index) => (
                  <option
                    key={index}
                    value={item.id}
                    className={clsx("bg-neutral-800")}
                  >
                    {item.name}
                  </option>
                ))}
              </Select>
            </Field>

            {/* product_ids */}
            <Field className="flex flex-col gap-1 w-full">
              <div className="flex items-center gap-4 justify-between">
                <Label className="text-sm">Product IDs</Label>
                {/* add new field for product ids */}
                <button
                  disabled={loading || !orderData.platform}
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
                  <Select
                    disabled={loading || !orderData.platform}
                    value={product_id}
                    className=" block w-full rounded-lg bg-white/10 hover:bg-white/30 p-2"
                    onChange={(e) =>
                      setOrderData((prev) => {
                        const newProductIds = [...prev.product_ids];
                        newProductIds[index] = Number(e.target.value);
                        return { ...prev, product_ids: newProductIds };
                      })
                    }
                  >
                    <option value="" className={clsx("bg-neutral-800")}>
                      Select Product
                    </option>

                    {filterProducts?.map((item, index) => (
                      <option
                        key={index}
                        value={item.id}
                        className={clsx("bg-neutral-800")}
                      >
                        ID: {item.id} | {item.name} | ${item.price}
                      </option>
                    ))}
                  </Select>

                  <button
                    disabled={loading}
                    onClick={() =>
                      setOrderData((prev) => ({
                        ...prev,
                        product_ids: prev.product_ids.filter(
                          (_, i) => i !== index
                        ),
                      }))
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
                onClick={handleSubmit}
                disabled={
                  loading ||
                  !orderData.user_id ||
                  !orderData.state ||
                  !orderData.platform ||
                  !orderData.product_ids?.length
                }
                className={clsx(
                  "bg-Gold/80 p-2 rounded-lg hover:bg-Gold/60 disabled:bg-gray-500/20 flex-1",
                  {
                    "cursor-not-allowed":
                      loading ||
                      !orderData.user_id ||
                      !orderData.state ||
                      !orderData.platform ||
                      !orderData.product_ids?.length,
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
