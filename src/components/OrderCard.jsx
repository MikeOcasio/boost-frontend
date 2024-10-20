"use client";

import Image from "next/image";
import React, { useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import clsx from "clsx";

import { OrderDialog } from "../app/(Dashboard)/_components/OrderDialog";
import { PiGameControllerFill, PiPencil } from "react-icons/pi";
import { useUserStore } from "@/store/use-user";
import { BiImage } from "react-icons/bi";

// Helper function to highlight matching terms
const highlightMatch = (text, searchTerm) => {
  if (!searchTerm || !text) return text; // Handle empty cases
  const regex = new RegExp(`(${searchTerm})`, "gi");
  const parts = text.split(regex);

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

const OrderCard = ({ order, loadOrders, searchTerm }) => {
  const { user } = useUserStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const onClose = () => setDialogOpen(false);

  const groupedProducts = groupProducts(order.products);

  return (
    <div
      onClick={() => setDialogOpen(true)}
      className="flex-1 min-w-fit space-y-4 rounded-lg border border-white/10 p-4 bg-white/10 hover:border-white/20"
    >
      <div className="flex justify-between items-center gap-2 flex-wrap-reverse">
        <h3 className="text-lg font-semibold">
          Order #{highlightMatch(order?.internal_id, searchTerm)}
        </h3>

        <div className="flex gap-2">
          {(user.role === "admin" ||
            user.role === "dev" ||
            user.role === "skillmaster") && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDialogOpen(true);
                setIsEditing(true);
              }}
              className="p-2 rounded-lg hover:bg-white/10"
            >
              <PiPencil className="h-5 w-5" />
            </button>
          )}

          <button
            onClick={(e) => e.stopPropagation()}
            className="p-2 rounded-lg hover:bg-white/10"
          >
            <FaExternalLinkAlt className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1 w-full">
        {groupedProducts.map((product, index) => (
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

      <div className="flex flex-col gap-y-2">
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
            <span>{highlightMatch(order.platform?.name, searchTerm)}</span>
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

        <OrderDialog
          dialogOpen={dialogOpen}
          onClose={onClose}
          order={order}
          groupedProducts={groupedProducts}
          isEditing={isEditing}
          loadOrders={loadOrders}
        />
      </div>
    </div>
  );
};

export default OrderCard;
