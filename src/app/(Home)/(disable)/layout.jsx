"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const DisableLayout = () => {
  // prod changes
  const route = useRouter();

  useEffect(() => {
    route.push("/");
  }, []);

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
};

export default DisableLayout;
