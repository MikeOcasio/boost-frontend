"use client";

import Image from "next/image";
import React, { useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { OrderGraveyardDialog } from "./OrderGraveyardDialog";

const OrdersGraveyardCard = ({ key, order }) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const onClose = () => {
    setDialogOpen(false);
  };

  return (
    <div
      key={key}
      className="space-y-4 rounded-lg border border-white/10 p-4 bg-Gold/20 hover:border-white/20 backdrop-blur-lg"
    >
      <div className="flex justify-between items-center gap-2 flex-wrap-reverse">
        <h3 className="text-lg font-semibold">Order #{order?.order_id}</h3>

        <button
          onClick={() => setDialogOpen(true)}
          className="p-2 rounded-lg hover:bg-white/10"
        >
          <FaExternalLinkAlt className="h-5 w-5" />
        </button>
      </div>

      {/* Product Info */}
      <div className="flex flex-col gap-1 w-full">
        {order?.product?.map((product, index) => (
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
        ))}
      </div>

      <div className="flex flex-col gap-y-2">
        <div className="flex flex-wrap gap-4">
          {/* Order Status */}
          <p className="text-sm">
            Order status:{" "}
            <span className="font-semibold bg-yellow-500/80 px-1 rounded-md">
              {order.order_status}
            </span>
          </p>

          {/* Payment Status */}
          <p className="text-sm">
            Payment status:{" "}
            <span className="font-semibold bg-green-500/80 px-1 rounded-md">
              {order.payment_status}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap gap-4 justify-between items-center">
          {/* Date */}
          <p className="text-sm text-gray-300">Order Date: {order.date}</p>

          {/* totol_price */}
          <p className="text-lg">Total Price: ${order.total_price}</p>
        </div>

        <OrderGraveyardDialog
          dialogOpen={dialogOpen}
          onClose={onClose}
          order={order}
        />
      </div>
    </div>
  );
};

export default OrdersGraveyardCard;
