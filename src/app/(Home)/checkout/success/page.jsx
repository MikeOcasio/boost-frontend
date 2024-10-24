"use client";

import { createOrder } from "@/lib/actions/orders-action";
import { useCartStore } from "@/store/use-cart";
import { useUserStore } from "@/store/use-user";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiLoader } from "react-icons/bi";

const CreateProductPage = () => {
  const sessionId = useSearchParams().get("session_id");
  const router = useRouter();

  const { cartItems, removeFromCart } = useCartStore();
  const { user } = useUserStore();

  // State to track if the checkout has been processed
  const [checkoutInProgress, setCheckoutInProgress] = useState(false);

  // Consolidate platform ID from the cart items
  const platformId = cartItems.length > 0 ? cartItems[0].platform.id : null;

  const handleCheckout = async () => {
    if (!sessionId) {
      toast.error("Session ID not found. Please try again!");
      router.push("/checkout");
      return;
    }

    if (checkoutInProgress) return; // Prevent multiple requests
    setCheckoutInProgress(true);

    try {
      // Collect all product IDs based on their quantities
      const productIds = cartItems.flatMap((order) =>
        Array(order.quantity).fill(order.id)
      );

      const data = {
        order: {
          user_id: await user?.id,
          state: "open",
        },
        session_id: sessionId,
        platform: platformId,
        product_ids: productIds,
      };

      const response = await createOrder(data);

      if (response.error) {
        toast.error(response.error);
        setCheckoutInProgress(false);
        router.push("/checkout");
        return;
      } else {
        toast.success("Order placed successfully!");

        // Remove all items with the same platform
        cartItems.forEach((order) => removeFromCart(order.id));

        router.push(`/thank_you?order_id=${response.order_id}`);
      }
    } catch (error) {
      toast.error(error.message || "Error creating order!");
      setCheckoutInProgress(false);
      router.push("/checkout");
    } finally {
      setCheckoutInProgress(false);
    }
  };

  useEffect(() => {
    if (sessionId && user?.id && !checkoutInProgress) {
      handleCheckout();
    }
  }, [sessionId, user]);

  return (
    <div className="pt-24 max-w-7xl mx-auto min-h-screen space-y-6 p-4 flex items-center justify-center">
      <BiLoader className="h-8 w-8 animate-spin mx-auto" />
    </div>
  );
};

export default CreateProductPage;
