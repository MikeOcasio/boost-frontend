"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { BiLoader } from "react-icons/bi";
import { IoWarning } from "react-icons/io5";
import toast from "react-hot-toast";
import Link from "next/link";

import { Navbar } from "./_components/Navbar";
import { Footer } from "@/components/Footer";
import { useUserStore } from "@/store/use-user";
import { fetchCurrentUser } from "@/lib/actions/user-actions";
import { Button } from "@/components/Button";
import VerifyAppStatus from "@/components/verify-app-status";
import useSidebarStore from "@/store/use-sidebar";
import Backdrop from "@/template-components/layout/Backdrop";
import AppHeader from "@/template-components/layout/AppHeader";
import AppSidebar from "@/template-components/layout/AppSidebar";
import BackgroundPattern from "@/components/background-pattern";

const DashboardLayout = ({ children }) => {
  const router = useRouter();
  const { userToken, user, setUser, removeToken } = useUserStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const { isExpanded, isHovered, isMobileOpen } = useSidebarStore();

  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  const handleUserFetch = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchCurrentUser();

      if (response?.error) {
        toast.error(response.error);

        await removeToken();
        router.push("/login");
      } else {
        setUser(response);
      }
    } catch (err) {
      toast.error(err.message || "An error occurred while fetching the user.");
      setError(true);
      await removeToken();
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router, setUser, removeToken]);

  useEffect(() => {
    if (!userToken) {
      toast.error("No token found. Please log in.");
      router.push("/login");
      setLoading(false);
      return;
    }

    handleUserFetch();
  }, [handleUserFetch, router, userToken]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <BiLoader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="mt-4 w-fit bg-red-500/50 p-4 rounded-lg mx-auto flex items-center justify-center gap-2 flex-wrap text-center">
        <IoWarning className="h-5 w-5 mr-2" />
        Some error occurred. Please try again!
        {/* reload page */}
        <Link
          href="/"
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
        >
          Reload
        </Link>
      </p>
    );
  }

  if (!userToken || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <div className="h-96 w-fit overflow-hidden rounded-xl mx-auto">
          <Image
            src="/disable.gif"
            alt="Not authorized"
            height={500}
            width={700}
            priority
            className="h-96 w-full object-contain"
          />
        </div>
        Not authorized. Please log in to access this page.
        <Link href="/">
          <Button variant="secondary" className="mt-4">
            Go back home
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen xl:flex">
      {/* Sidebar and Backdrop */}
      <AppSidebar />
      <Backdrop />

      {/* Verify App Status is the website under maintenance or not */}
      <VerifyAppStatus />

      {/* Background */}
      <BackgroundPattern />

      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`}
      >
        {/* Header */}
        <AppHeader />

        {/* Page Content */}
        <div className="relative z-10 mt-2 min-h-[90vh] max-w-[1920px] mx-auto p-6 text-white">
          {/* <Navbar /> */}
          {children}
        </div>
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
