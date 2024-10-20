"use client";

import Image from "next/image";
import React, { useState } from "react";
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

export const AdminOrderCard = ({ order, loadOrders, searchTerm }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const onClose = () => setDialogOpen(false);

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
        {order?.products?.map((product, index) => (
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
              </div>
            </div>
            <p className="text-sm font-semibold">${product.price}</p>
          </div>
        ))}
      </div>

      {order.skill_master.gamer_tag && (
        <div className="flex flex-wrap gap-2 text-sm items-center">
          <span>Assigned Skill Master:</span>
          <span className="font-semibold px-1 rounded-md border border-white/10">
            {highlightMatch(order.skill_master.gamer_tag, searchTerm)}
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

      <div className="flex flex-wrap gap-4 justify-between items-center">
        <p className="text-sm">
          Order Date: {new Date(order.created_at).toLocaleString()}
        </p>
        <p className="text-lg font-semibold">Price: ${order.total_price}</p>
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
        loadOrders={loadOrders}
      />
    </div>
  );
};
