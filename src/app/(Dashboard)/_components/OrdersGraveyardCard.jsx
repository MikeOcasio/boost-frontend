"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { OrderGraveyardDialog } from "./OrderGraveyardDialog";
import clsx from "clsx";
import { PiGameControllerFill } from "react-icons/pi";
import { BiImage } from "react-icons/bi";
import { useUserStore } from "@/store/use-user";
import { IoIosArrowRoundForward } from "react-icons/io";

// Group similar products and sum their quantities
const groupProducts = (products) => {
  return products.reduce((acc, product) => {
    const existingProduct = acc.find((p) => p.id === product.id);

    if (existingProduct) {
      existingProduct.quantity += Number(product.quantity) || 1; // Ensure quantity is a number
    } else {
      acc.push({ ...product, quantity: Number(product.quantity) || 1 }); // Ensure quantity is a number
    }

    return acc;
  }, []);
};

const OrdersGraveyardCard = ({ order, loadGraveyardOrders, loadOrders }) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const onClose = () => {
    setDialogOpen(false);
  };

  const groupedProducts = groupProducts(order.products);

  const [promoData, setPromoData] = useState(null);
  const [ordersInfo, setOrdersInfo] = useState(null);

  useEffect(() => {
    order?.promo_data && setPromoData(JSON.parse(order?.promo_data));

    order?.order_data &&
      setOrdersInfo(order?.order_data.map((data) => JSON.parse(data)));
  }, [order]);

  const { user } = useUserStore();

  return (
    <div
      onClick={() => setDialogOpen(true)}
      className="space-y-4 rounded-2xl border border-white/10 p-4 bg-Gold/20 hover:border-white/20 backdrop-blur-lg flex-1 min-w-fit"
    >
      <div className="flex justify-between items-center gap-2 flex-wrap-reverse">
        <h3 className="text-lg font-semibold">Order #{order?.internal_id}</h3>

        <button
          onClick={() => setDialogOpen(true)}
          className="p-2 rounded-lg hover:bg-white/10"
        >
          <FaExternalLinkAlt className="h-5 w-5" />
        </button>
      </div>

      {/* Product Info */}
      <div className="flex flex-col gap-1 w-full">
        {groupedProducts?.map((product, index) => (
          <div
            key={index}
            className="flex flex-wrap gap-4 justify-between items-center bg-black/20 rounded-lg p-2 hover:bg-black/30"
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
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold">{product.name}</p>
                <p className="text-sm">
                  Qty:{" "}
                  {(ordersInfo?.length > 0 && ordersInfo[index]?.item_qty) ||
                    product.quantity}
                </p>
              </div>
            </div>
            {(user.role === "admin" || user.role === "dev") && (
              <p className="text-sm font-semibold">
                $
                {(ordersInfo?.length > 0 && ordersInfo[index]?.price) ||
                  (product.price * product.quantity).toFixed(2)}
              </p>
            )}

            {ordersInfo?.length > 0 && ordersInfo[index]?.starting_point && (
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
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-y-2">
        {/* Platform */}
        <div className="flex flex-wrap gap-2 text-sm items-center">
          <span>Platform:</span>
          <span className="font-semibold px-1 rounded-md border border-white/10 flex gap-2 items-center">
            <PiGameControllerFill className="h-5 w-5" />{" "}
            <span>{order.platform?.name}</span>
          </span>
        </div>

        {/* Order Status */}
        <p className="text-sm">
          Order status:{" "}
          <span
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
          </span>
        </p>

        <div className="flex flex-wrap gap-4 justify-between items-center">
          {/* Date */}
          <p className="text-sm text-gray-300">
            Order Date:
            {order.created_at
              ? new Intl.DateTimeFormat("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(order.created_at))
              : "Not set"}
          </p>

          {/* totol_price */}
          {(user.role === "admin" || user.role === "dev") && (
            <p className="text-lg">
              Price: $
              {promoData?.id
                ? (
                    order.total_price -
                    (order.total_price * promoData?.discount_percentage) / 100
                  ).toFixed(2)
                : Number(order.total_price).toFixed(2)}
            </p>
          )}
        </div>

        <OrderGraveyardDialog
          dialogOpen={dialogOpen}
          onClose={onClose}
          order={order}
          groupedProducts={groupedProducts}
          loadGraveyardOrders={loadGraveyardOrders}
          loadOrders={loadOrders}
        />
      </div>
    </div>
  );
};

export default OrdersGraveyardCard;
