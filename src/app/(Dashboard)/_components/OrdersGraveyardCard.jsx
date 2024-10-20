"use client";

import Image from "next/image";
import React, { useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { OrderGraveyardDialog } from "./OrderGraveyardDialog";
import clsx from "clsx";
import { PiGameControllerFill } from "react-icons/pi";
import { BiImage } from "react-icons/bi";

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

  return (
    <div
      onClick={() => setDialogOpen(true)}
      className="space-y-4 rounded-lg border border-white/10 p-4 bg-Gold/20 hover:border-white/20 backdrop-blur-lg flex-1 min-w-fit"
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
                <p className="text-sm">Qty: {product.quantity}</p>
              </div>
            </div>
            <p className="text-sm font-semibold">
              ${(product.price * product.quantity).toFixed(2)}
            </p>
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
            Order Date: {new Date(order.created_at).toLocaleString()}
          </p>

          {/* totol_price */}
          <p className="text-lg">Price: ${order.total_price}</p>
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
