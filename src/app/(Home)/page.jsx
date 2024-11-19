"use client";

import Image from "next/image";

import { ContactForm } from "@/components/home/ContactForm";
import HomePageAboutArea from "@/components/home/HomePageAboutArea";
import { HomeGameCarousel } from "@/components/home/HomeGameCarousel";
import { useEffect, useState } from "react";
import { fetchAllGames } from "@/lib/actions/products-action";
import { BiLoader } from "react-icons/bi";
import { IoWarning } from "react-icons/io5";
import toast from "react-hot-toast";

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const loadGames = async () => {
    setLoading(true);
    setError(false);

    try {
      const result = await fetchAllGames();
      if (result.error) {
        setError(true);
        toast.error(result.error);
      } else {
        const popularGames = result.filter(
          (game) => game.is_active && game.most_popular
        );

        setData(popularGames);
      }
    } catch (error) {
      setError(true);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGames();
  }, []);

  return (
    <div className="mt-10 text-white overflow-x-hidden">
      <div className="h-screen w-full">
        <div className="fixed top-0 -z-10 h-full w-full">
          <Image
            src="/utils/purpleLane.png"
            alt="background-picture"
            quality={100}
            fill
            priority
            className="h-full w-full object-cover blur-sm backdrop-contrast-125"
          />
        </div>

        <div className="flex h-full flex-col items-center justify-center">
          <h1 className="text-center font-title lg:text-8xl text-[12vw] tracking-widest text-gray-300 drop-shadow-[0_15px_3px_rgba(0,0,0,0.6)]">
            RAVENBOOST
          </h1>

          <Image
            src="/homeHero.png"
            height={800}
            width={800}
            alt="group of video game characters"
            quality={100}
            priority
            className="h-[50vh] w-auto md:scale-105 object-contain drop-shadow-[0_30px_5px_rgba(0,0,0,0.5)]"
          />

          <p className="mx-auto max-w-[80%] text-center lg:text-3xl text-lg font-medium leading-6 text-gray-300">
            Boost Your Game, Your Way! Choose your dream team and leave the rest
            to us.
          </p>
        </div>
      </div>

      <div className="h-screen w-full sticky top-0 -z-10">
        <Image
          src="/utils/cityBurn2.png"
          alt="background-picture"
          quality={100}
          priority
          fill
          className="h-full w-full object-cover blur-md backdrop-contrast-125"
        />
      </div>

      <div className="mx-auto px-4 lg:max-w-7xl lg:-mt-[110vh] -mt-[90vh]">
        {loading && <BiLoader className="h-8 w-8 animate-spin mx-auto" />}

        {error && (
          <p className="w-fit bg-red-500/50 p-4 rounded-lg mx-auto flex items-center justify-center gap-2">
            <IoWarning className="h-5 w-5 mr-2" />
            Failed to load games. Please try again!
            {/* reload page */}
            <button onClick={loadGames} className="bg-white/10 p-2 rounded-lg">
              Reload
            </button>
          </p>
        )}

        {!loading && !error && data?.length > 0 && (
          <HomeGameCarousel data={data} />
        )}
      </div>

      <HomePageAboutArea />

      <ContactForm />
    </div>
  );
}
