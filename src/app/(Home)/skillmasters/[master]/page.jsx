"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiLoader } from "react-icons/bi";
import { BsTrophyFill } from "react-icons/bs";
import { IoMdPerson } from "react-icons/io";
import { IoWarning } from "react-icons/io5";

import { fetchSkillmasterById } from "@/lib/actions/user-actions";

// {
//   id: 1,
//   email: "ocasio.michael96@gmail.com",
//   first_name: "Mike",
//   last_name: "Ocasio",
//   role: "dev",
//   image_url: "/skillmasters/profile.png",
//   platforms: [{ id: 5 }, { id: 8, name: "Switch" }],
//   gamesIds: [1, 23],
//   about:
//     "I am a skill master and I love to help people learn new skills and improve their existing ones.",
//   achievements: [
//     "+10 Wins",
//     "+10k Coins",
//     "+10 Tournaments",
//     "+100 Trophies",
//     "+50 Kills",
//   ],
//   gameplay_urls: [
//     {
//       title: "Gameplay 1",
//       url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
//     },
//     {
//       title: "Gameplay 2",
//       url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
//     },
//     {
//       title: "Gameplay 3",
//       url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
//     },
//     {
//       title: "Gameplay 4",
//       url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
//     },
//     {
//       title: "Gameplay 5",
//       url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
//     },
//   ],
// }

const MasterPage = ({ params }) => {
  const [skillMaster, setSkillMaster] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadSkillmaster = async () => {
    setLoading(true);
    setError(false);

    try {
      const result = await fetchSkillmasterById(params.master);
      if (result.error) {
        setError(true);
        toast.error(result.error);
      } else {
        setSkillMaster(result);
      }
    } catch (error) {
      setError(true);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkillmaster();
  }, []);

  return (
    <div className="relative pt-24 max-w-7xl mx-auto min-h-screen space-y-6 p-4">
      {/* Background */}
      <div className="fixed top-0 left-0 w-full h-full bg-[url('/dashboard-bg.svg')] bg-repeat bg-contain opacity-5 blur-sm -z-20" />

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
          {skillMaster.image_url ? (
            <Image
              src={skillMaster.image_url}
              width={700}
              height={700}
              alt="skillmaster"
              className="mx-auto h-fit max-h-[300px] object-contain"
            />
          ) : (
            <IoMdPerson className="h-28 w-28 bg-white/10 rounded-full p-4 mx-auto" />
          )}

          <p className="text-6xl tracking-widest text-center font-title">
            {skillMaster.gamer_tag ||
              skillMaster.first_name + " " + skillMaster.last_name}
          </p>

          <div className="flex flex-wrap gap-2 text-sm items-center justify-center">
            {skillMaster.platforms.map((platform) => (
              <p
                key={platform.id}
                className="bg-white/10 px-2 rounded-md text-center"
              >
                {platform.name}
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

          <p className="text-sm font-semibold">Game plays</p>

          <div className="flex flex-wrap items-center justify-center gap-6">
            {skillMaster.gameplay_urls?.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-2 min-w-[49%] h-full flex-1"
              >
                {item.url && (
                  <iframe
                    src={item.url}
                    title={item.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-lg w-full h-[315px]"
                  />
                )}

                <p className="text-sm text-center text-white/80 font-semibold bg-white/10 rounded-md px-2 py-1 w-full">
                  {item.title}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MasterPage;
