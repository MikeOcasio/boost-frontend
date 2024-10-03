"use client";

import { Footer } from "@/components/Footer";
import { Navbar } from "./_components/Navbar";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/use-user";
import { BiLoader } from "react-icons/bi";
import { IoWarning } from "react-icons/io5";

const DashboardLayout = ({ children }) => {
  const router = useRouter();
  const { user, getUserToken } = useUserStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        await getUserToken();
      } catch (err) {
        setError("Failed to fetch user token.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [getUserToken]);

  useEffect(() => {
    if (!user && !loading) {
      router.push("/");
    }
  }, [user, loading, router]);

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
        {error} Please try again!
      </p>
    );
  }

  if (!user) {
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
        Not authorized, login to access this page
      </div>
    );
  }

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full bg-[url('/dashboard-bg.svg')] bg-repeat bg-contain opacity-5 blur-sm" />
      <Navbar />
      <div className="relative z-10 mt-28 min-h-[90vh] max-w-7xl mx-auto p-4">
        {children}
      </div>
      <Footer />
    </>
  );
};

export default DashboardLayout;
