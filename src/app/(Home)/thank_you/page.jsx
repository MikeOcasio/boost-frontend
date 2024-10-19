"use client";

import { fetchOrderById } from "@/lib/actions/orders-action";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BiLoader, BiReceipt } from "react-icons/bi";
import { IoWarning } from "react-icons/io5";
import { PiGameControllerFill } from "react-icons/pi";

const PaymentConfirmation = () => {
  const params = useSearchParams().get("order_id");

  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const loadOrderData = async () => {
    setLoading(true);
    setError(false);

    try {
      const result = await fetchOrderById(params);
      if (result.error) {
        setError(true);
        toast.error(result.error);
      } else {
        setOrderData(result);
      }
    } catch (error) {
      setError(true);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, []);

  return (
    <div className="pt-24 max-w-7xl mx-auto min-h-screen flex flex-col items-center justify-center gap-6 p-4 overflow-hidden">
      {loading && <BiLoader className="h-8 w-8 animate-spin mx-auto" />}

      {error && (
        <p className="w-fit bg-red-500/50 p-4 rounded-lg mx-auto flex items-center justify-center gap-2">
          <IoWarning className="h-5 w-5 mr-2" />
          Failed to load order details. Please try again!
          {/* reload */}
          <button
            onClick={loadOrderData}
            className="p-2 rounded-lg bg-white/10"
          >
            Reload
          </button>
        </p>
      )}

      {!loading && !error && orderData && (
        <>
          <div className="space-y-4 border rounded-lg border-white/10 bg-Gold/10 p-4 py-6 md:px-12 mx-auto">
            <h2 className="text-center text-4xl font-title sm:text-5xl">
              Thank you for your purchase!
            </h2>

            <p className="text-center text-white/80 font-semibold max-w-lg mx-auto">
              Your order has been successfully placed. Skillmaster will assign
              to your order shortly.
            </p>

            <p className="font-semibold">
              Order ID: #{orderData.order.internal_id}
            </p>

            <div className="flex flex-col gap-1">
              {orderData?.order?.products?.map((product, index) => (
                <div
                  key={index}
                  className="flex flex-wrap justify-between items-center bg-black/20 rounded-lg p-2 hover:bg-black/30"
                >
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
              ))}
            </div>

            <div className="flex flex-col gap-y-2">
              {/* Assigned Skill Master */}
              {orderData.skill_master.gamer_tag && (
                <div className="flex flex-wrap gap-2 text-sm items-center">
                  <span>Assigned Skill Master:</span>
                  <span className="font-semibold px-1 rounded-md border border-white/10">
                    {order.skill_master.gamer_tag}
                  </span>
                </div>
              )}

              {/* Platform */}
              <div className="flex flex-wrap gap-2 text-sm items-center">
                <span>Platform:</span>
                <span className="font-semibold px-1 rounded-md border border-white/10 flex gap-2 items-center">
                  <PiGameControllerFill className="h-5 w-5" />{" "}
                  <span>{orderData.order.platform?.name}</span>
                </span>
              </div>

              {/* Order Status */}
              <div className="flex flex-wrap gap-2 text-sm items-center">
                <span>Order status:</span>
                <span
                  className={clsx(
                    "font-semibold px-1 rounded-md border border-white/10",

                    orderData.order.state === "in_progress" && "bg-purple-500",
                    orderData.order.state === "delayed" && "bg-yellow-500",
                    orderData.order.state === "disputed" && "bg-red-500",
                    orderData.order.state === "assigned" && "bg-blue-500",
                    orderData.order.state === "re_assigned" && "bg-blue-500",
                    orderData.order.state === "complete" && "bg-green-500"
                  )}
                >
                  {orderData.order.state}
                </span>
              </div>

              {/* tax & promotion */}
              <div className="flex flex-col gap-2 border border-white/10 p-4 rounded-lg">
                <p className="text-sm flex flex-wrap gap-2 justify-between items-center border-b pb-2 border-white/10">
                  <span>Price</span>
                  <span>
                    $
                    {orderData.order.products
                      .reduce((acc, curr) => acc + Number(curr.price), 0)
                      .toFixed(2)}
                  </span>
                </p>
                {orderData.order.promotion_id && (
                  <p className="text-sm flex flex-wrap gap-2 justify-between items-center pb-2 border-b border-white/10">
                    Promotion
                    <span>{orderData.order.promotion_id}</span>
                  </p>
                )}
                <p className="text-sm flex flex-wrap gap-2 justify-between items-center">
                  Tax
                  <span>
                    $
                    {orderData.order.products
                      .reduce((acc, curr) => acc + Number(curr.tax), 0)
                      .toFixed(2)}
                  </span>
                </p>
              </div>

              <div className="flex flex-wrap gap-4 justify-between items-center">
                <p className="text-sm">
                  Order Date:{" "}
                  {new Date(orderData.order.created_at).toLocaleString()}
                </p>
                <p className="text-lg font-semibold">
                  Price: ${orderData.order.total_price}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 items-center w-full max-w-xl">
            <Link
              href="/games"
              className="bg-white/10 p-2 rounded-lg hover:bg-white/20 flex-1 flex items-center gap-2 justify-center min-w-fit"
            >
              <PiGameControllerFill className="h-5 w-5" />
              <p className="text-sm">Browse more games</p>
            </Link>

            <Link
              href="/dashboard/orders"
              className="bg-white/10 p-2 rounded-lg hover:bg-white/20 flex-1 flex items-center gap-2 justify-center min-w-fit"
            >
              <BiReceipt className="h-5 w-5" />
              <p className="text-sm">See all orders</p>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentConfirmation;
