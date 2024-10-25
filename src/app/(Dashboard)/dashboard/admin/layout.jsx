"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BiLoader } from "react-icons/bi";
import { IoWarning } from "react-icons/io5";
import toast from "react-hot-toast";

import { useUserStore } from "@/store/use-user";
import { fetchCurrentUser } from "@/lib/actions/user-actions";

const AdminLayout = ({ children }) => {
  const router = useRouter();
  const { user, userToken, setUser, removeToken } = useUserStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Function to fetch and verify the current user
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

  // Handle the loading state
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <BiLoader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Handle the error state
  if (error) {
    return (
      <p className="mt-4 w-fit bg-red-500/50 p-4 rounded-lg mx-auto flex items-center justify-center gap-2">
        <IoWarning className="h-5 w-5 mr-2" />
        An error occurred. Please try again!
        {/* Reload page */}
        <Link
          href="/"
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
        >
          Reload
        </Link>
      </p>
    );
  }

  // Handle unauthorized access
  if (!user || (user.role !== "admin" && user.role !== "dev")) {
    return (
      <div className="max-w-7xl mx-auto p-4 space-y-6 text-center">
        <Image
          src="/404.gif"
          alt="Admin Logo"
          height={500}
          width={500}
          priority
          className="mx-auto rounded-lg"
        />
        <span>You are not authorized to access this page</span>

        <div className="mt-4">
          <Link href="/login">
            <button className="bg-white/10 px-4 py-2 rounded-md hover:bg-white/20">
              Go Back
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // If the user is authorized, render the children
  return <div>{children}</div>;
};

export default AdminLayout;
