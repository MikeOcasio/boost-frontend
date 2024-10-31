"use client";

import { useUserStore } from "@/store/use-user";
import AdminTabs from "../../_components/AdminTabs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const UserDashboard = () => {
  const { user } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    user?.role !== "admin" && user?.role !== "dev" && router.push("/");
  }, [router, user?.role]);

  return (
    <div className="px-4 space-y-6">
      <h2 className="text-center text-lg font-semibold">
        Welcome, {user?.first_name} {user?.last_name}
        {(user?.role === "admin" || user?.role === "dev") && (
          <span className="px-2 py-1 rounded-md bg-white/10 ml-2 text-xs">
            {user.role}
          </span>
        )}
      </h2>

      {/* Admin tab*/}
      {user?.role === "admin" || user?.role === "dev" ? (
        <>
          <AdminTabs />
        </>
      ) : (
        <p>You are not authorized to access this page</p>
      )}
    </div>
  );
};

export default UserDashboard;
