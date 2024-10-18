"use client";

import { useUserStore } from "@/store/use-user";
import React, { useEffect } from "react";

const PaymentConfirmation = () => {
  const { user } = useUserStore();
  console.log("user", user);

  return <div>Payment Confirmation Page</div>;
};

export default PaymentConfirmation;
