"use client";

import { createOrder } from "@/lib/actions/orders-action";
import { useCartStore } from "@/store/use-cart";
import { useUserStore } from "@/store/use-user";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiLoader } from "react-icons/bi";

const SuccessPage = () => {
  const searchParam = useSearchParams();
  const sessionId = searchParam.get("session_id");
  const router = useRouter();

  const { removeFromCart } = useCartStore();
  const { user } = useUserStore();

  const [orderData, setOrderData] = useState(null);
  const [checkoutInProgress, setCheckoutInProgress] = useState(false);

  useEffect(() => {
    // Access sessionStorage only after the component mounts on the client
    if (typeof window !== "undefined") {
      const sessionStorageData = sessionStorage.getItem("place_order");
      if (sessionStorageData) {
        setOrderData(JSON.parse(sessionStorageData));
      }
    }
  }, []);

  const validateSession = useCallback(() => {
    if (!sessionId || !orderData || orderData.sessionId !== sessionId) {
      toast.error("Invalid session. Please try again!");
      router.push("/checkout");
      return false;
    }
    return true;
  }, [sessionId, orderData, router]);

  const handleCheckout = useCallback(async () => {
    if (checkoutInProgress || !validateSession()) return;
    setCheckoutInProgress(true);

    const platformId =
      orderData.orders.length > 0 ? orderData.orders[0].platform.id : null;

    try {
      const productIds = orderData.orders.flatMap((order) =>
        Array(order.quantity).fill(order.id)
      );

      const stringOrderData = await orderData.orders.map((order) =>
        JSON.stringify(order)
      );

      const data = {
        order: {
          user_id: user?.id,
          state: "open",
        },
        session_id: sessionId,
        platform: platformId,
        product_ids: productIds,
        order_data: stringOrderData,
        promo_data: orderData?.orders[0]?.promotion_code
          ? JSON.stringify(orderData?.orders[0]?.promotion_code)
          : null,
      };

      if (orderData.subplatform) {
        data.subplatform_id = Number(orderData.subplatform);
      }

      const response = await createOrder(data);

      if (response.error) {
        toast.error(response.error);
        setCheckoutInProgress(false);
        router.push("/checkout");
      } else {
        toast.success("Order placed successfully!");

        orderData.orders.forEach((order) => removeFromCart(order.id));

        sessionStorage.removeItem("place_order");
        router.push(`/thank_you?order_id=${response.order_id}`);
      }
    } catch (error) {
      toast.error(error.message || "Error creating order!");
      setCheckoutInProgress(false);
      router.push("/checkout");
    }
  }, [
    checkoutInProgress,
    validateSession,
    orderData,
    user?.id,
    sessionId,
    router,
    removeFromCart,
  ]);

  useEffect(() => {
    if (
      orderData &&
      !checkoutInProgress &&
      sessionId &&
      user?.id &&
      validateSession()
    ) {
      handleCheckout();
    }
  }, [
    checkoutInProgress,
    sessionId,
    user?.id,
    orderData,
    handleCheckout,
    validateSession,
  ]);

  return (
    <div className="pt-24 max-w-7xl mx-auto min-h-screen space-y-6 p-4 flex items-center justify-center">
      <BiLoader className="h-8 w-8 animate-spin mx-auto" />
    </div>
  );
};

export default SuccessPage;
