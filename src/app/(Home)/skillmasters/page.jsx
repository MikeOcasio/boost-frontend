"use client";

import { FilterButton } from "@/components/FilterButton";
import Image from "next/image";
import { useEffect, useState } from "react";
import SkillmasterFilter from "../games/_components/SkillmasterFilter";
import { BiLoader } from "react-icons/bi";
import { IoWarning } from "react-icons/io5";
import { fetchAllSkillmasters } from "@/lib/actions";
import { SkillmasterCard } from "../games/_components/SkillmasterCard";

const SkillMastersPage = () => {
  const [skillMasters, setSkillMasters] = useState([]);

  // {
  //   id: 1,
  //   email: "ocasio.michael96@gmail.com",
  //   first_name: "Mike",
  //   last_name: "Ocasio",
  //   role: "dev",
  //   created_at: "2024-09-19T19:45:48.040Z",
  //   updated_at: "2024-10-03T21:42:10.430Z",
  //   image_url: "/skillmasters/profile.png",
  //   platforms: [{ id: 5 }, { id: 8, name: "Switch" }],
  //   perv_orders: [1, 2],
  //   prev_games: [
  //     {
  //       product_id: 1,
  //       order_id: 1,
  //     },
  //   ],
  //   is_available: true,
  //   about:
  //     "I am a skill master and I love to help people learn new skills and improve their existing ones.",
  // },
  // {
  //   id: 2,
  //   email: "ocasio.michael96@gmail.com",
  //   first_name: "Nikhil",
  //   last_name: "Sharma",
  //   role: "dev",
  //   created_at: "2024-09-19T19:45:48.040Z",
  //   updated_at: "2024-10-03T21:42:10.430Z",
  //   image_url: "/skillmasters/profile.png",
  //   platforms: [
  //     { id: 5, name: "PC" },
  //     { id: 6, name: "PlayStation" },
  //   ],
  //   gamesIds: [1, 23, 24],
  //   about:
  //     "I am a skill master and I love to help people learn new skills and improve their existing ones.",
  // },

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState({
    platform: "",
    category: "",
    platformName: "",
    categoryName: "",
  });

  const loadSkillmasters = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchAllSkillmasters();
      if (result.error) {
        setError(true);
        toast.error(result.error);
      } else {
        setSkillMasters(result);
      }
    } catch (error) {
      setError(true);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkillmasters();
  }, []);

  // Filter and search logic for name, platform, and category
  const filteredSkillmasters = skillMasters
    .filter((skillmaster) =>
      (skillmaster.first_name + " " + skillmaster.last_name)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .filter((skillmaster) =>
      filter.platform
        ? skillmaster.platforms.some(
            (platform) => platform.id === Number(filter.platform)
          )
        : true
    )
    .filter((skillmaster) =>
      filter.category
        ? skillmaster.gamesIds.includes(Number(filter.category))
        : true
    );

  return (
    <div className="mt-24 max-w-7xl mx-auto min-h-screen space-y-6 p-4">
      {/* Background */}
      <div className="fixed top-0 left-0 w-full h-full bg-[url('/dashboard-bg.svg')] bg-repeat bg-contain opacity-5 blur-sm -z-20" />

      <h2 className="text-center text-4xl font-title sm:text-5xl">
        SKILL MASTERS
      </h2>

      <div className="relative space-y-6">
        <Image
          src="/skillmasters/hero.png"
          alt="skillmasters"
          width={700}
          height={700}
          className="mx-auto h-fit"
        />

        <p className="text-sm max-w-xl mx-auto text-center text-white/80">
          Ready to elevate your gaming experience? Select your Skill Master and
          start your journey to gaming excellence today!
        </p>

        <Image
          src="/skillmasters/award.png"
          alt="award"
          width={150}
          height={150}
          className="absolute -top-20 left-0 lg:block hidden opacity-80"
        />
        <Image
          src="/skillmasters/charge.png"
          alt="charge"
          width={150}
          height={150}
          className="absolute bottom-0 right-0 lg:block hidden opacity-80"
        />
      </div>

      {loading && <BiLoader className="h-8 w-8 animate-spin mx-auto" />}

      {error && (
        <p className="w-fit bg-red-500/50 p-4 rounded-lg mx-auto flex items-center justify-center gap-2">
          <IoWarning className="h-5 w-5 mr-2" />
          Failed to load games. Please try again!
        </p>
      )}

      {/* Search and Filters */}
      {!loading &&
        !error &&
        (skillMasters.length < 1 ? (
          <p className="w-full">No skill masters found!</p>
        ) : (
          skillMasters.length > 0 && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-4">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search skill masters..."
                  className="flex-1 p-2 rounded-lg bg-white/10 border border-white/10 hover:border-white/20"
                />

                <SkillmasterFilter filter={filter} setFilter={setFilter} />

                <div className="flex items-center gap-2 w-full flex-wrap">
                  {/* Show applied filters */}
                  {Object.keys(filter).length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      {filter.platformName && (
                        <FilterButton
                          label={filter.platformName}
                          onRemove={() =>
                            setFilter({
                              ...filter,
                              platform: "",
                              platformName: "",
                            })
                          }
                        />
                      )}
                      {filter.categoryName && (
                        <FilterButton
                          label={filter.categoryName}
                          onRemove={() =>
                            setFilter({
                              ...filter,
                              category: "",
                              categoryName: "",
                            })
                          }
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Skill Masters List */}
              <div className="space-y-6">
                {filteredSkillmasters.length === 0 && (
                  <div className="text-center text-sm text-gray-500">
                    No skill masters found
                  </div>
                )}

                {filteredSkillmasters.length > 0 &&
                  filteredSkillmasters.map((skillMaster) => (
                    <SkillmasterCard
                      key={skillMaster.id}
                      skillMaster={skillMaster}
                    />
                  ))}
              </div>
            </div>
          )
        ))}
    </div>
  );
};

export default SkillMastersPage;
