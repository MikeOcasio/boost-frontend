"use client";

import { checkAppStatus } from "@/lib/actions/common";
import { useRouter } from "next/navigation";
import React, { useState, useCallback, useEffect } from "react";
import { BiLoader } from "react-icons/bi";
import { IoWarning } from "react-icons/io5";
import { Button } from "./Button";
import { useUserStore } from "@/store/use-user";

const VerifyAppStatus = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [appStatus, setAppStatus] = useState(null);
  const { maintenanceToken } = useUserStore();

  const handleAppStatus = useCallback(async () => {
    setLoading(true);

    try {
      const response = await checkAppStatus();

      if (response.error) {
        setError(response.error);
        !maintenanceToken && router.push("/maintenance");
      } else {
        setAppStatus(response.status);
      }
    } catch (error) {
      setError(true);
      !maintenanceToken && router.push("/maintenance");
    } finally {
      setLoading(false);
    }
  }, [maintenanceToken, router]);

  useEffect(() => {
    handleAppStatus();
  }, [handleAppStatus]);

  useEffect(() => {
    if (!maintenanceToken && appStatus === "maintenance") {
      router.push("/maintenance");
    }
  }, [appStatus, maintenanceToken, router]);

  return (
    <>
      {loading && (
        <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <BiLoader className="text-white animate-spin" size={32} />
        </div>
      )}

      {error && (
        <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-black/90 p-6 rounded-lg flex flex-col items-center gap-4">
            <IoWarning className="text-red-500" size={32} />
            <p className="text-white text-center">An error occurred</p>
            <Button onClick={handleAppStatus} className="px-6">
              Retry
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default VerifyAppStatus;
