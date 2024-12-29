"use client";

import Link from "next/link";
import { BsDiscord } from "react-icons/bs";

const SupportPage = () => {
  return (
    <div className="pt-24 max-w-7xl mx-auto min-h-screen space-y-6 p-4 flex items-center justify-center">
      <div className="mx-auto w-full lg:w-[60%] bg-gradient-to-r from-CardPlum/50 to-CardGold/50 p-6 backdrop-blur-xl flex flex-col items-center justify-center rounded-2xl">
        <p className="text-center text-xl font-bold">
          Send your query on Discord we are here to help you!
        </p>

        <Link
          href="https://discord.gg/Wr9n9EynKQ"
          target="_blank"
          className="mt-4 bg-purple-500/50 py-2 px-4 rounded-full mx-auto flex items-center justify-center gap-4"
        >
          <BsDiscord className="text-4xl" />
          <p className="text-center text-lg font-bold">Join Discord</p>
        </Link>
      </div>
    </div>
  );
};

export default SupportPage;
