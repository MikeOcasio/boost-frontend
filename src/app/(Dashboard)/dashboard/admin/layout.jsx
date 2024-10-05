"use client";

import Link from "next/link";
import { useUserStore } from "@/store/use-user";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AdminLayout = ({ children }) => {
  const router = useRouter();
  const { user } = useUserStore();

  useEffect(() => {
    if (!user || (user.role !== "admin" && user.role !== "dev")) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user || (user.role !== "admin" && user.role !== "dev")) {
    return (
      <div className="max-w-7xl mx-auto p-4 space-y-6 text-center">
        <Image
          src="/404.gif"
          alt="Admin Logo"
          height={200}
          width={200}
          className="mx-auto rounded-lg"
        />

        <span>You are not authorized to access this page</span>

        <div className="mt-4">
          <Link href="/">
            <button className="bg-white/10 px-4 py-2 rounded-md hover:bg-white/20">
              Go Back
            </button>
          </Link>
        </div>
      </div>
    );
  }
  return <div>{children}</div>;
};

export default AdminLayout;
