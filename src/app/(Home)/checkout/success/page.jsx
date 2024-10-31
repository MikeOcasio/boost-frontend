"use client";

import { createOrder } from "@/lib/actions/orders-action";
import { useCartStore } from "@/store/use-cart";
import { useUserStore } from "@/store/use-user";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiLoader } from "react-icons/bi";

const CreateProductPage = () => {
  const sessionId = useSearchParams().get("session_id");
  const router = useRouter();

  const { removeFromCart } = useCartStore();
  const { user } = useUserStore();

  // State to track if the checkout has been processed
  const [checkoutInProgress, setCheckoutInProgress] = useState(false);

  // Consolidate platform ID from the cart items

  const handleCheckout = useCallback(async () => {
    if (checkoutInProgress) return; // Prevent multiple requests
    setCheckoutInProgress(true);

    const orderData = JSON.parse(sessionStorage.getItem("place_order"));

    if (!sessionId || !orderData || orderData.sessionId !== sessionId) {
      toast.error("Invalid session. Please try again!");
      router.push("/checkout");
      return;
    }

    const platformId =
      orderData.orders.length > 0 ? orderData.orders[0].platform.id : null;

    try {
      // Collect all product IDs based on their quantities
      const productIds = orderData.orders.flatMap((order) =>
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
        ordersData: orderData.orders,
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
        orderData.orders.forEach((order) => removeFromCart(order.id));

        sessionStorage.removeItem("place_order");
        router.push(`/thank_you?order_id=${response.order_id}`);
      }
    } catch (error) {
      toast.error(error.message || "Error creating order!");
      setCheckoutInProgress(false);
      router.push("/checkout");
    } finally {
      setCheckoutInProgress(false);
    }
  }, [checkoutInProgress, removeFromCart, router, sessionId, user?.id]);

  useEffect(() => {
    if (sessionId && user?.id && !checkoutInProgress) {
      handleCheckout();
    }
  }, [checkoutInProgress, handleCheckout, sessionId, user]);

  return (
    <Suspense fallback={<BiLoader className="h-8 w-8 animate-spin mx-auto" />}>
      <div className="pt-24 max-w-7xl mx-auto min-h-screen space-y-6 p-4 flex items-center justify-center">
        <BiLoader className="h-8 w-8 animate-spin mx-auto" />
      </div>
    </Suspense>
  );
};

export default CreateProductPage;
