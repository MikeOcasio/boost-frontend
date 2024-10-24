"use client";

import { createOrder } from "@/lib/actions/orders-action";
import { useCartStore } from "@/store/use-cart";
import { useUserStore } from "@/store/use-user";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { BiLoader } from "react-icons/bi";

const CreateProductPage = () => {
  const sessionId = useSearchParams().get("session_id");
  const router = useRouter();

  const { cartItems, removeFromCart } = useCartStore();
  const { user } = useUserStore();

  // Consolidate platform ID from the cart items
  const platformId = cartItems.length > 0 ? cartItems[0].platform.id : null;

  const handleCheckout = async () => {
    if (!sessionId) {
      toast.error("Session ID not found. Please try again!");
      router.push("/checkout");
    }

    try {
      // Collect all product IDs based on their quantities
      const productIds = cartItems.flatMap((order) =>
        Array(order.quantity).fill(order.id)
      );

      // Prepare data payload for creating the order
      const data = {
        order: {
          user_id: await user?.id,
          state: "open",
        },
        session_id: sessionId, // Include session_id
        platform: platformId, // Include platform info
        product_ids: productIds,
      };

      const response = await createOrder(data);

      if (response.error) {
        toast.error(response.error);
        return;
      } else {
        toast.success("Order placed successfully!");

        // Remove all items with the same platform
        cartItems.forEach((order) => removeFromCart(order.id));

        // Navigate to the thank you page with order_id
        router.push(`/thank_you?order_id=${response.order_id}`);
      }
    } catch (error) {
      toast.error(error.message || "Error creating order!");
      router.push("/checkout");
    } finally {
      router.push("/checkout");
    }
  };

  useEffect(() => {
    if (sessionId && user.id) {
      handleCheckout();
    }
  }, []);

  return (
    <div className="pt-24 max-w-7xl mx-auto min-h-screen space-y-6 p-4 flex items-center justify-center">
      <BiLoader className="h-8 w-8 animate-spin mx-auto" />
    </div>
  );
};

export default CreateProductPage;
