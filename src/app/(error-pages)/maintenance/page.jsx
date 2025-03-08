"use client";

import GridShape from "@/template-components/common/GridShape";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import MaintenanceLoginModal from "../components/maintenance-login-modal";
import { checkAppStatus } from "@/lib/actions/common";
import { useRouter } from "next/navigation";

export default function Maintenance() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [appStatus, setAppStatus] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLoginModal = () => {
    setIsLoginModalOpen(!isLoginModalOpen);
  };

  const handleAppStatus = async () => {
    setLoading(true);

    try {
      const response = await checkAppStatus();

      if (response.error) {
        setError(response.error);
      } else {
        setAppStatus(response.status);
      }
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleAppStatus();
  }, []);

  useEffect(() => {
    if (appStatus === "active") {
      router.push("/");
    }
  }, [appStatus, router]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden z-1">
      <GridShape />

      <div>
        <div className="mx-auto w-full max-w-[274px] text-center sm:max-w-[555px]">
          <div className="mx-auto mb-10 w-full max-w-[155px] text-center sm:max-w-[204px]">
            <Image
              src="/logo.svg"
              alt="Ravenboost"
              fill
              className="absolute opacity-10 -z-10 blur-sm"
            />
            <Image
              src="/images/error/maintenance-dark.svg"
              alt="maintenance"
              width={205}
              height={205}
            />
          </div>

          <h1 className="mb-2 font-bold text-gray-800 text-title-md dark:text-white/90 xl:text-title-2xl">
            {loading ? "LOADING..." : "MAINTENANCE"}
          </h1>

          <p className="mt-6 mb-6 text-base text-gray-700 dark:text-gray-400 sm:text-lg">
            {!loading &&
              "Our Site is Currently under maintenance We will be back Shortly Thank You For Patience"}
          </p>

          {error && (
            <p className="mt-6 mb-6 text-base text-gray-700 dark:text-gray-400 sm:text-lg">
              {error}
              <button
                onClick={handleAppStatus}
                className="bg-Gold hover:bg-Gold/80 p-3 px-6 rounded-md text-white"
              >
                Reload
              </button>
            </p>
          )}

          {/* Login */}
          {!loading && (
            <button
              disabled={loading || error}
              onClick={handleLoginModal}
              className="bg-Gold hover:bg-Gold/80 p-3 px-6 rounded-md text-white"
            >
              Maintenance Login
            </button>
          )}
        </div>
      </div>

      {/* login modal */}
      <MaintenanceLoginModal
        isOpen={isLoginModalOpen}
        onClose={handleLoginModal}
      />
    </div>
  );
}
