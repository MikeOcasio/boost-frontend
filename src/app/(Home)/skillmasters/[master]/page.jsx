"use client";

import { fetchSkillmasterById } from "@/lib/actions";
import Image from "next/image";
import { useState } from "react";
import { BsTrophyFill } from "react-icons/bs";

const MasterPage = ({ params }) => {
  const [skillMaster, setSkillMaster] = useState({
    id: 1,
    email: "ocasio.michael96@gmail.com",
    first_name: "Mike",
    last_name: "Ocasio",
    role: "dev",
    image_url: "/skillmasters/profile.png",
    platforms: [{ id: 5 }, { id: 8, name: "Switch" }],
    gamesIds: [1, 23],
    about:
      "I am a skill master and I love to help people learn new skills and improve their existing ones.",
    achievements: [
      "+10 Wins",
      "+10k Coins",
      "+10 Tournaments",
      "+100 Trophies",
      "+50 Kills",
    ],
    gameplay_urls: [
      {
        title: "Gameplay 1",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
      {
        title: "Gameplay 2",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
      {
        title: "Gameplay 3",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
      {
        title: "Gameplay 4",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
      {
        title: "Gameplay 5",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
    ],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const loadSkillmaster = async () => {
    setLoading(true);
    setError(null);

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

  // useEffect(() => {
  //   loadSkillmaster();
  // }, []);

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

  return (
    <div className="relative mt-24 max-w-7xl mx-auto min-h-screen space-y-6 p-4">
      {/* Background */}
      <div className="fixed top-0 left-0 w-full h-full bg-[url('/dashboard-bg.svg')] bg-repeat bg-contain opacity-5 blur-sm -z-20" />

      {skillMaster.image_url && (
        <Image
          src={skillMaster.image_url}
          width={700}
          height={700}
          alt="skillmaster"
          className="mx-auto h-fit max-h-[300px] object-contain"
        />
      )}

      <p className="text-6xl tracking-widest text-center font-title">
        {skillMaster.first_name} {skillMaster.last_name}
      </p>
      <p className="text-sm text-center text-white/80 font-semibold max-w-xl mx-auto">
        {skillMaster.about}
      </p>

      {/* achievements */}
      <div className="flex flex-wrap justify-center gap-4 py-4">
        {skillMaster.achievements.map((item, index) => (
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
        {skillMaster.gameplay_urls.map((item, index) => (
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
    </div>
  );
};

export default MasterPage;
