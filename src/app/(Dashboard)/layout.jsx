"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BiLoader } from "react-icons/bi";
import { IoWarning } from "react-icons/io5";
import toast from "react-hot-toast";
import Link from "next/link";

import { Navbar } from "./_components/Navbar";
import { Footer } from "@/components/Footer";
import { fetchCurrentUser } from "@/lib/actions";
import { useUserStore } from "@/store/use-user";

const DashboardLayout = ({ children }) => {
  const router = useRouter();
  const { userToken, user, setUser, removeToken } = useUserStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleUserFetch = async () => {
    try {
      const response = await fetchCurrentUser();
      if (response?.error) {
        throw new Error(response.error);
      }
      setUser(response);
    } catch (err) {
      toast.error(err.message || "An error occurred while fetching the user.");
      setError(true);
      await removeToken();
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userToken) {
      toast.error("No token found. Please log in.");
      router.push("/login");
      setLoading(false);
      return;
    }

    handleUserFetch();
  }, [userToken]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <BiLoader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="mt-4 w-fit bg-red-500/50 p-4 rounded-lg mx-auto flex items-center justify-center gap-2">
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
            className="h-96 w-full object-contain"
          />
        </div>
        Not authorized. Please log in to access this page.
      </div>
    );
  }

  return (
    <>
      {/* Background */}
      <div className="fixed top-0 left-0 w-full h-full bg-[url('/dashboard-bg.svg')] bg-repeat bg-contain opacity-5 blur-sm -z-20" />
      <Navbar />
      <div className="relative z-10 mt-28 min-h-[90vh] max-w-7xl mx-auto p-4">
        {children}
      </div>
      <Footer />
    </>
  );
};

export default DashboardLayout;
