"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { BiPencil } from "react-icons/bi";

import { fetchSkillmasterById } from "@/lib/actions/skillmasters-action";
import toast from "react-hot-toast";
import { AdminOrderDialog } from "./AdminOrderDialog";
import clsx from "clsx";

export const AdminOrderCard = ({ order, key }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [skillMasterName, setSkillMasterName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const onClose = () => setDialogOpen(false);

  const loadSkillMaster = async (id) => {
    try {
      setLoading(true);
      setError(false);
      const result = await fetchSkillmasterById(id);
      if (result.error) {
        setError(true);
        // toast.error(JSON.stringify(result.error));
      } else {
        setSkillMasterName(result.first_name);
      }
    } catch (e) {
      setError(true);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch skill master when assigned_skill_master_id is present
  useEffect(() => {
    if (order.assigned_skill_master_id) {
      loadSkillMaster(order.assigned_skill_master_id);
    }
  }, [order.assigned_skill_master_id]);

  return (
    <div
      key={key}
      className="flex-1 min-w-fit space-y-4 rounded-lg border border-white/10 p-4 bg-white/10 hover:border-white/20"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Order #{order.internal_id}</h3>

        <button
          onClick={() => setDialogOpen(true)}
          className="p-2 rounded-lg hover:bg-white/10"
        >
          <BiPencil className="h-5 w-5" />
        </button>
      </div>

      <div className="flex flex-col gap-1">
        {order?.product?.map((product, index) => (
          <div
            key={index}
            className="flex flex-wrap justify-between items-center bg-black/20 rounded-lg p-2 hover:bg-black/30"
          >
            <div className="flex flex-wrap items-center gap-x-2">
              <Image
                src={product.image_url}
                alt={product.product_name}
                height={60}
                width={60}
                priority
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

      {/* Assigned Skill Master */}
      {!error && order.assigned_skill_master_id && (
        <div className="flex flex-wrap gap-2 text-sm items-center">
          <span>Assigned Skill Master:</span>
          <span className="font-semibold px-1 rounded-md border border-white/10">
            {loading ? "Loading..." : skillMasterName}
          </span>
        </div>
      )}

      {/* Order Status */}
      <div className="flex flex-wrap gap-2 text-sm items-center">
        <span>Order status:</span>
        <span
          className={clsx(
            "font-semibold px-1 rounded-md border border-white/10",
            order.state === "assigned" && "bg-yellow-600",
            order.state === "complete" && "bg-green-600",
            order.state === "open" && "bg-white/10"
          )}
        >
          {order.state}
        </span>
      </div>

      <div className="flex flex-wrap gap-4 justify-between items-center">
        <p className="text-sm">
          Order Date:{" "}
          {new Date(order.created_at).toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          })}
        </p>
        <p className="text-lg font-semibold">Price: ${order.total_price}</p>
      </div>

      <AdminOrderDialog
        dialogOpen={dialogOpen}
        onClose={onClose}
        order={order}
        skillMasterName={skillMasterName}
      />
    </div>
  );
};
