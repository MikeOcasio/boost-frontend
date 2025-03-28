"use client";

import { fetchOrderById } from "@/lib/actions/orders-action";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiImage, BiLoader, BiReceipt } from "react-icons/bi";
import { BsDiscord } from "react-icons/bs";
import { IoIosArrowRoundForward } from "react-icons/io";
import { IoWarning } from "react-icons/io5";
import { PiGameControllerFill } from "react-icons/pi";

const ThankyouPage = () => {
  const router = useRouter();
  const searchParam = useSearchParams();
  const params = searchParam.get("order_id");

  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [ordersInfo, setOrdersInfo] = useState(null);

  const loadOrderData = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const result = await fetchOrderById(params);

      if (result.error) {
        setError(true);
        toast.error(result.error);
        router.push("/products");
      } else {
        // Group products by their ID and sum the quantities

        const groupedProducts = result.order.products.reduce((acc, product) => {
          const existingProduct = acc.find((p) => p.id === product.id);

          if (existingProduct) {
            existingProduct.quantity += product.quantity || 1;
          } else {
            acc.push({ ...product, quantity: product.quantity || 1 });
          }

          return acc;
        }, []);

        setOrderData({
          ...result,
          order: { ...result.order, products: groupedProducts },
        });
      }
    } catch (error) {
      setError(true);
      toast.error(true);
      router.push("/products");
    } finally {
      setLoading(false);
    }
  }, [router, params]);

  useEffect(() => {
    loadOrderData();
  }, [loadOrderData]);

  const [promoData, setPromoData] = useState(null);

  useEffect(() => {
    orderData?.order?.promo_data &&
      setPromoData(JSON.parse(orderData?.order?.promo_data));

    orderData?.order?.order_data &&
      setOrdersInfo(
        orderData?.order?.order_data.map((order) => JSON.parse(order))
      );
  }, [orderData]);

  // console.log("orderData", orderData);

  return (
    <div className="pt-24 max-w-[1920px] mx-auto min-h-screen flex flex-col items-center justify-center gap-6 p-4">
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

            <p className="text-center text-white/80 font-semibold max-w-md mx-auto text-xs">
              Your order has been successfully placed. A Skillmaster will be
              assigned to your order shortly.
            </p>

            <p className="font-semibold">
              Order ID: #{orderData.order.internal_id}
            </p>

            <div className="flex flex-col gap-1">
              {orderData?.order?.products?.map((product, index) => (
                <Link
                  key={index}
                  target="_blank"
                  href={`/products/${product.id}`}
                  className="flex flex-wrap justify-between items-center bg-black/20 rounded-lg p-2 hover:bg-black/30 border border-white/10 gap-2 w-full"
                >
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
                      <p className="text-sm font-semibold">
                        Qty:{" "}
                        {(ordersInfo?.length > 0 &&
                          ordersInfo[index]?.item_qty) ||
                          product.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold">
                    $
                    {(ordersInfo?.length > 0 && ordersInfo[index]?.price) ||
                      (product.price * product.quantity).toFixed(2)}
                  </p>

                  {ordersInfo?.length > 0 &&
                    ordersInfo[index]?.starting_point && (
                      <div className="flex flex-wrap gap-2 text-sm items-center w-full border-t border-white/10 pt-2">
                        <p className="text-sm flex flex-wrap gap-2 justify-between">
                          {product.name}:
                          <span className="flex flex-wrap gap-2 items-center flex-1 min-w-fit">
                            <span className="bg-white/10 px-2 rounded">
                              {ordersInfo[index]?.starting_point?.index ||
                                ordersInfo[index]?.starting_point?.option}
                            </span>
                            <IoIosArrowRoundForward className="h-4 w-4" />
                            <span className="bg-white/10 px-2 rounded">
                              {ordersInfo[index]?.ending_point?.index ||
                                ordersInfo[index]?.ending_point?.option}
                            </span>
                          </span>
                        </p>
                      </div>
                    )}
                </Link>
              ))}
            </div>

            <div className="flex flex-col gap-y-2">
              {/* Assigned Skill Master */}
              {orderData?.skill_master.gamer_tag && (
                <div className="flex flex-wrap gap-2 text-sm items-center">
                  <span>Assigned Skill Master:</span>
                  <span className="font-semibold px-1 rounded-md border border-white/10">
                    {orderData?.skill_master.gamer_tag}
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
                    {(ordersInfo?.length > 0 &&
                      ordersInfo
                        .reduce(
                          (acc, curr) =>
                            acc + Number(curr.price * curr.quantity),
                          0
                        )
                        .toFixed(2)) ||
                      orderData.order.products
                        .reduce(
                          (acc, curr) =>
                            acc + Number(curr.price * curr.quantity),
                          0
                        )
                        .toFixed(2)}
                  </span>
                </p>

                {promoData?.id && (
                  <p className="text-sm flex flex-wrap gap-2 justify-between items-center pb-2 border-b border-white/10">
                    Discount
                    <span>{promoData.discount_percentage}% OFF</span>
                  </p>
                )}

                <p className="text-sm flex flex-wrap gap-2 justify-between items-center">
                  Tax
                  <span>
                    $
                    {(ordersInfo?.length > 0 &&
                      ordersInfo.reduce(
                        (acc, curr) =>
                          curr.tax && curr.item_qty
                            ? acc +
                              Number(curr.tax * curr.item_qty || curr.quantity)
                            : 0,
                        0
                      )) ||
                      orderData.order.products
                        .reduce(
                          (acc, curr) =>
                            curr.tax && curr.quantity
                              ? acc + Number(curr.tax * curr.quantity)
                              : 0,
                          0
                        )
                        .toFixed(2)}
                  </span>
                </p>
              </div>

              <div className="flex flex-wrap gap-4 justify-between items-center">
                <p className="text-sm">
                  Order Date:{" "}
                  {orderData.order.created_at
                    ? new Intl.DateTimeFormat("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(new Date(orderData.order.created_at))
                    : "Not set"}
                </p>
                <p className="text-lg font-semibold">
                  Price: $
                  {promoData?.id
                    ? (
                        orderData.order.total_price -
                        (orderData.order.total_price *
                          promoData.discount_percentage) /
                          100
                      ).toFixed(2)
                    : Number(orderData.order.total_price).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 items-center w-full max-w-xl">
            <Link
              href="/products"
              className="bg-white/10 p-2 rounded-lg hover:bg-white/20 flex-1 flex items-center gap-2 justify-center min-w-fit"
            >
              <PiGameControllerFill className="h-5 w-5" />
              <p className="text-sm">Browse more products</p>
            </Link>

            <Link
              href="/dashboard/orders"
              className="bg-white/10 p-2 rounded-lg hover:bg-white/20 flex-1 flex items-center gap-2 justify-center min-w-fit"
            >
              <BiReceipt className="h-5 w-5" />
              <p className="text-sm">See all orders</p>
            </Link>

            <p className="text-center text-sm w-full text-white/80">
              Get in touch with you skill masters
            </p>

            <Link
              href="https://discord.gg/Wr9n9EynKQ"
              target="_blank"
              className="bg-purple-500/50 py-2 px-4 rounded-full mx-auto flex items-center justify-center gap-4 w-full"
            >
              <BsDiscord className="text-4xl" />
              <p className="text-center text-lg font-bold">Join Discord</p>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default ThankyouPage;
