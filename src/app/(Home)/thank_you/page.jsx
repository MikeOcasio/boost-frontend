"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const PaymentConfirmation = () => {
  // prod change
  const router = useRouter();

  useEffect(() => {
    router.push("/");
  }, []);

  return <div>Payment Confirmation Page</div>;
};

export default PaymentConfirmation;
