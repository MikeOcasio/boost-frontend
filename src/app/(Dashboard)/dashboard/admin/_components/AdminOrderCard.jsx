"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { BiImage, BiPencil } from "react-icons/bi";
import clsx from "clsx";
import { AdminOrderDialog } from "./AdminOrderDialog";
import { PiGameControllerFill } from "react-icons/pi";

// Helper function to highlight matching terms
const highlightMatch = (text, searchTerm) => {
  if (!searchTerm) return text; // If no search term, return the original text
  const regex = new RegExp(`(${searchTerm})`, "gi"); // Case-insensitive match
  const parts = text.split(regex); // Split the text into matching and non-matching parts

  return parts.map((part, index) =>
    regex.test(part) ? <mark key={index}>{part}</mark> : part
  );
};

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

export const AdminOrderCard = ({
  order,
  loadOrders,
  searchTerm,
  skillmasters,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const onClose = () => setDialogOpen(false);

  const groupedProducts = groupProducts(order.products);

  const [promoData, setPromoData] = useState(null);

  useEffect(() => {
    order?.promo_data && setPromoData(JSON.parse(order?.promo_data));
  }, [order]);

  return (
    <div className="flex-1 min-w-fit space-y-4 rounded-lg border border-white/10 p-4 bg-white/10 hover:border-white/20">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          Order #{highlightMatch(order.internal_id, searchTerm)}
        </h3>

        <button
          onClick={() => setDialogOpen(true)}
          className="p-2 rounded-lg hover:bg-white/10"
        >
          <BiPencil className="h-5 w-5" />
        </button>
      </div>

      <div className="flex flex-col gap-1">
        {groupedProducts?.map((product, index) => (
          <div
            key={index}
            className="flex flex-wrap justify-between items-center bg-black/20 rounded-lg p-2 hover:bg-black/30"
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
                <p className="text-sm font-semibold">
                  {highlightMatch(product.name, searchTerm)}
                </p>
                <p className="text-sm">Qty: {product.quantity}</p>
              </div>
            </div>
            <p className="text-sm font-semibold">
              ${(product.price * product.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {order.skill_master.id && (
        <div className="flex flex-wrap gap-2 text-sm items-center">
          <span>Assigned Skill Master:</span>
          <span className="font-semibold px-1 rounded-md border border-white/10">
            {!order.skill_master.gamer_tag &&
              highlightMatch(
                "Skillmaster#" + order.skill_master.id,
                searchTerm
              )}

            {order.skill_master.gamer_tag &&
              highlightMatch(order.skill_master.gamer_tag, searchTerm)}
          </span>
        </div>
      )}

      <div className="flex flex-wrap gap-2 text-sm items-center">
        <span>Platform:</span>
        <span className="font-semibold px-1 rounded-md border border-white/10 flex gap-2 items-center">
          <PiGameControllerFill className="h-5 w-5" />{" "}
          <span>{highlightMatch(order.platform?.name || "", searchTerm)}</span>
        </span>
      </div>

      <div className="flex flex-wrap gap-2 text-sm items-center">
        <span>Order status:</span>
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
          {highlightMatch(order.state, searchTerm)}
        </span>
      </div>

      {promoData?.id && (
        <p className="text-sm flex flex-wrap gap-2 items-center p-2 border border-white/10 rounded-md bg-white/10 w-fit font-semibold">
          Promo Applied:
          <span>
            {promoData.code} | {promoData.discount_percentage}%
          </span>
        </p>
      )}

      <div className="flex flex-wrap gap-4 justify-between items-center">
        <p className="text-sm">
          Order Date:
          {order.created_at
            ? new Intl.DateTimeFormat("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(new Date(order.created_at))
            : "Not set"}
        </p>
        <p className="text-lg font-semibold">
          Price: $
          {promoData?.id
            ? (
                order.total_price -
                (order.total_price * promoData?.discount_percentage) / 100
              ).toFixed(2)
            : order.total_price}
        </p>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <p className="text-sm px-2 rounded-md border border-white/10">
          ID: {order.id}
        </p>
      </div>

      <AdminOrderDialog
        dialogOpen={dialogOpen}
        onClose={onClose}
        order={order}
        groupedProducts={groupedProducts}
        loadOrders={loadOrders}
        skillmasters={skillmasters}
      />
    </div>
  );
};
