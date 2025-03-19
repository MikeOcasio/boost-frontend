"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiLoader } from "react-icons/bi";
import { BsTrophyFill } from "react-icons/bs";
import { IoMdPerson } from "react-icons/io";
import { IoWarning } from "react-icons/io5";

import { EmbededFrame } from "../_components/EmbededFrame";
import { PiGameControllerFill } from "react-icons/pi";
import { useRouter } from "next/navigation";
import { fetchSkillmasterById } from "@/lib/actions/skillmasters-action";
import BackgroundPattern from "@/components/background-pattern";

const MasterPage = ({ params }) => {
  const [skillMaster, setSkillMaster] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (error) {
      router.push("/login");
    }
  }, [error, router]);

  const loadSkillmaster = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const result = await fetchSkillmasterById(params.master);

      if (result.error) {
        setError(true);
        toast.error(result.error);
      } else {
        setSkillMaster(result);
        await prefetchGameplayUrls(result.gameplay_info);
      }
    } catch (error) {
      // console.log("error while fetching skillmaster", error);

      setError(true);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }, [params?.master]);

  useEffect(() => {
    loadSkillmaster();
  }, [loadSkillmaster]);

  // Function to prefetch gameplay URLs
  const prefetchGameplayUrls = async (gameplayInfo) => {
    if (!gameplayInfo) return;

    const urls = {};

    // Prefetch URLs
    for (let item of gameplayInfo) {
      const gameplayData = JSON.parse(
        item.replace(/"=>/g, '":').replace(/=>/g, ":")
      );

      if (gameplayData.url) {
        // Simulating a prefetch operation by creating a new Image
        const link = document.createElement("link");
        link.rel = "prefetch";
        link.href = gameplayData.url;
        document.head.appendChild(link);

        urls[gameplayData.name] = gameplayData.url;
      }
    }
  };

  return (
    <div className="relative pt-24 max-w-[1920px] mx-auto min-h-screen space-y-6 p-4">
      {/* Background */}
      <BackgroundPattern />

      {loading && <BiLoader className="h-8 w-8 animate-spin mx-auto" />}

      {error && (
        <p className="w-fit bg-red-500/50 p-4 rounded-lg mx-auto flex items-center justify-center gap-2">
          <IoWarning className="h-5 w-5 mr-2" />
          Failed to load skill master details. Please try again!
          {/* Reload page */}
          <button
            onClick={loadSkillmaster}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
          >
            Reload
          </button>
        </p>
      )}

      {!loading && !error && skillMaster && (
        <>
          <div className="w-full space-y-4 rounded-3xl pt-4 relative overflow-hidden shadow-2xl">
            <Image
              src="/skillmasters/skillmaster-bg.jpg"
              alt="bg"
              width={700}
              height={700}
              priority
              className="mx-auto h-full w-full object-cover absolute top-0 left-0 opacity-80 blur-lg -z-10"
            />

            {skillMaster.image_url ? (
              <Image
                src={skillMaster.image_url}
                width={700}
                height={700}
                alt="skillmaster"
                priority
                className="mx-auto h-[300px] w-[300px] object-contain object-center rounded-full bg-white/10"
              />
            ) : (
              <IoMdPerson className="h-28 w-28 bg-white/10 rounded-full p-4 mx-auto" />
            )}

            <p className="text-6xl tracking-widest text-center font-title">
              {skillMaster.gamer_tag || "Skillmaster#" + skillMaster.id}
            </p>

            <div className="flex flex-wrap gap-2 text-sm items-center justify-center">
              {skillMaster.platforms.map((platform) => (
                <p
                  key={platform.id}
                  className="bg-white/10 p-1 px-4 rounded-md text-center flex gap-4 items-center"
                >
                  <PiGameControllerFill className="h-5 w-5" /> {platform.name}
                </p>
              ))}
            </div>

            <p className="text-sm text-center text-white/80 font-semibold max-w-xl mx-auto">
              {skillMaster.bio}
            </p>

            {/* achievements */}
            <div className="flex flex-wrap justify-center gap-4 py-4">
              {skillMaster.achievements?.map((item, index) => (
                <div
                  className="flex flex-col items-center justify-center gap-4 bg-white/10 p-4 rounded-lg w-36 hover:scale-110 transition-all"
                  key={index}
                >
                  <BsTrophyFill className="h-12 w-12 text-Gold" />

                  <p
                    key={index}
                    className="text-sm text-center text-white/80 font-semibold"
                  >
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {skillMaster.gameplay_info.length > 0 && (
            <p className="text-xs font-bold">Game plays</p>
          )}

          <div className="flex flex-wrap items-center justify-center gap-6">
            {skillMaster.gameplay_info?.map((item, index) => {
              // parsing array of objects
              const gameplayData = JSON.parse(
                item.replace(/"=>/g, '":').replace(/=>/g, ":")
              );

              return (
                <EmbededFrame
                  key={index}
                  url={gameplayData.url}
                  title={gameplayData.name}
                />
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default MasterPage;
