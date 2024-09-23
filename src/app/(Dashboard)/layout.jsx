"use client";

import { Footer } from "@/components/Footer";
import { Navbar } from "./_components/Navbar";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect } from "react";

const DashboardLayout = ({ children }) => {
  // prod changes
  const disable = true;
  const router = useRouter();

  useEffect(() => {
    router.push("/");
  }, []);

  if (disable) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <div className="h-96 w-fit overflow-hidden rounded-xl mx-auto">
          <Image
            src="/disable.gif"
            alt="website under construction"
            height={500}
            width={700}
            className="h-96 w-full object-contain"
          />
        </div>
        Website under construction
      </div>
    );
  }

  return (
    <>
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/dashboard-bg.svg')] bg-repeat bg-contain opacity-5 blur-sm" />
      <Navbar />
      <div className="relative z-10 mt-28 min-h-[90vh] max-w-7xl mx-auto">
        {children}
      </div>
      <Footer />
    </>
  );
};

export default DashboardLayout;
