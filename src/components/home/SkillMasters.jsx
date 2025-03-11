"use client";

import { fetchAllSkillmasters } from "@/lib/actions/skillmasters-action";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BiLoader } from "react-icons/bi";
import { BsTrophyFill } from "react-icons/bs";
import { IoMdPerson } from "react-icons/io";
import { IoWarning } from "react-icons/io5";
import { Carousel } from "react-responsive-carousel";

const SkillMasters = () => {
  const [centerSlidePercentage, setCenterSlidePercentage] = useState(100); // Default for small screens
  const [skillMasters, setSkillMasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadSkillmasters = async () => {
    setLoading(true);
    setError(false);
    try {
      const result = await fetchAllSkillmasters();
      if (result.error) {
        setError(true);
      } else {
        setSkillMasters(result);
      }
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkillmasters();
  }, []);

  useEffect(() => {
    // Adjust slides displayed based on screen size
    const updateSlidePercentage = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth >= 1024) {
        // Large screens (show 3 cards)
        setCenterSlidePercentage(33.33);
      } else if (screenWidth >= 768) {
        // Medium screens (show 2 cards)
        setCenterSlidePercentage(50);
      } else {
        // Small screens (show 1 card)
        setCenterSlidePercentage(100);
      }
    };

    updateSlidePercentage(); // Initial update
    window.addEventListener("resize", updateSlidePercentage); // Update on resize

    return () => {
      window.removeEventListener("resize", updateSlidePercentage); // Cleanup
    };
  }, []);

  const completedSkillmasters = skillMasters.filter(
    (master) => master.image_url && master.bio && master.platforms.length > 0
  );
  return (
    <div className="relative mx-auto mt-14 lg:mt-20 max-w-7xl text-right">
      <div className="absolute right-0 h-36 w-64 bg-skillsMaster bg-contain bg-no-repeat">
        <h1 className="pr-12 pt-[.7rem] font-title text-4xl tracking-widest">
          Skill Masters
        </h1>
      </div>

      <div className="h-20" />

      {loading && <BiLoader className="h-8 w-8 animate-spin mx-auto mb-8" />}

      {error && (
        <p className="w-fit bg-red-500/50 p-4 rounded-lg mx-auto flex items-center justify-center gap-2">
          <IoWarning className="h-5 w-5 mr-2" />
          Failed to load skillmasters. Please try again!
          {/* reload page */}
          <button
            onClick={loadSkillmasters}
            className="bg-white/10 p-2 rounded-lg"
          >
            Reload
          </button>
        </p>
      )}

      {!loading && !error && completedSkillmasters?.length && (
        <Carousel
          autoPlay={true}
          infiniteLoop={completedSkillmasters.length > 1}
          emulateTouch={true}
          interval={3000}
          showStatus={false}
          showIndicators={false}
          centerMode={true}
          showThumbs={false}
          showArrows={false}
          centerSlidePercentage={centerSlidePercentage}
        >
          {completedSkillmasters
            .sort(() => Math.random() - 0.5)
            ?.map((master) => (
              <Link
                key={master.id}
                href={`/skillmasters/${master.id}`}
                className="flex flex-col flex-1 max-w-[600px] min-w-fit mx-2 gap-4 border border-white/10 h-full relative group overflow-hidden rounded-2xl p-4"
              >
                <Image
                  src="/skillmasters/skillmaster-bg.jpg"
                  alt="bg"
                  width={700}
                  height={700}
                  priority
                  className="mx-auto h-full w-full object-cover absolute top-0 left-0 opacity-80 blur-md -z-10"
                />

                <div className="flex w-full flex-col md:flex-row gap-4">
                  <div className="overflow-hidden p-2 relative w-full max-h-52 md:max-w-44 flex items-center justify-center rounded-xl bg-white/10">
                    {master?.image_url ? (
                      <Image
                        src={master?.image_url}
                        alt={master.first_name}
                        height={400}
                        width={400}
                        priority
                        className="object-contain md:object-cover rounded-xl h-full transition-transform duration-300 ease-in-out transform group-hover:scale-110"
                      />
                    ) : (
                      <IoMdPerson className="h-28 w-28 rounded-full m-auto" />
                    )}
                  </div>

                  <div className="bg-black/50 max-h-52 backdrop-blur-sm rounded-xl flex-1 gap-2 flex flex-col items-center justify-center p-4">
                    <h3 className="text-lg font-semibold leading-7 tracking-tight">
                      {master.gamer_tag || `Skillmaster#${master.id}`}
                    </h3>

                    <p className="text-sm leading-6">{master.role}</p>

                    {/* achievements */}
                    {master.achievements.length > 0 && (
                      <div className="flex items-center -space-x-2">
                        {master.achievements
                          ?.slice(0, 3)
                          .map((achievement, index) => (
                            <div
                              key={achievement.id}
                              className="w-8 h-8 bg-Gold rounded-full flex items-center justify-center border-2 border-black/50"
                              style={{ zIndex: 3 - index }}
                            >
                              <BsTrophyFill className="h-4 w-4 text-white" />
                            </div>
                          ))}
                        {master.achievements?.length > 3 && (
                          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center border-2 border-black/50 text-sm">
                            +{master.achievements.length - 3}
                          </div>
                        )}
                      </div>
                    )}

                    {/* platforms */}
                    {master.platforms.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2">
                        {master.platforms?.map((platform) => (
                          <span
                            key={platform.id}
                            className="px-2 text-xs flex-1 rounded-md bg-white/10"
                          >
                            {platform.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* bio section */}
                {master?.bio && (
                  <div className="w-full flex-1 bg-black/50 backdrop-blur-sm rounded-xl p-4 border-white/10 border">
                    <p className="text-sm text-white/80 font-semibold text-left">
                      {master.bio.length > 120
                        ? master.bio.slice(0, 120) + "..."
                        : master.bio}
                    </p>
                  </div>
                )}
              </Link>
            ))}
        </Carousel>
      )}
    </div>
  );
};

export default SkillMasters;
