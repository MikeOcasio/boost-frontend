"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const SupportPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/");
  }, []);

  return (
    <div className="pt-24 max-w-7xl mx-auto min-h-screen space-y-6 p-4"></div>
  );
};

export default SupportPage;
