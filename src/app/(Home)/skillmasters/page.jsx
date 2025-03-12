"use client";

import { FilterButton } from "@/components/FilterButton";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import SkillmasterFilter from "../products/_components/SkillmasterFilter";
import { BiLoader } from "react-icons/bi";
import { IoWarning } from "react-icons/io5";
import { SkillmasterCard } from "../products/_components/SkillmasterCard";
import toast from "react-hot-toast";

import { useRouter } from "next/navigation";
import { fetchAllSkillmasters } from "@/lib/actions/skillmasters-action";

const SkillMastersPage = () => {
  const [skillMasters, setSkillMasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState({
    platform: "",
    platformName: "",
  });

  const router = useRouter();

  useEffect(() => {
    if (error) {
      router.push("/login");
    }
  }, [error, router]);

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

  // Helper function: Normalize strings (remove extra spaces and convert to lowercase)
  const normalize = (str) => str?.toLowerCase().replace(/\s+/g, "").trim();

  // Filter and search logic for name, platform, and category
  const filteredSkillmasters = useMemo(() => {
    const term = normalize(searchTerm);

    return skillMasters
      ?.filter((skillmaster) => {
        return (
          !term ||
          normalize(skillmaster.first_name + skillmaster.last_name).includes(
            term
          ) ||
          normalize(skillmaster.gamer_tag)?.includes(term) ||
          normalize(skillmaster.bio)?.includes(term) ||
          skillmaster.platforms.some((platform) =>
            normalize(platform.name).includes(term)
          )
        );
      })
      .filter((skillmaster) =>
        filter.platform
          ? skillmaster.platforms.some(
              (platform) => platform.id === Number(filter.platform)
            )
          : true
      );
  }, [skillMasters, searchTerm, filter]);

  return (
    <div className="pt-24 max-w-[1920px] mx-auto min-h-screen space-y-6 p-4">
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
          className="mx-auto h-fit w-auto"
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
          priority
          className="absolute -top-20 left-0 lg:block hidden opacity-80"
        />
        <Image
          src="/skillmasters/charge.png"
          alt="charge"
          width={150}
          height={150}
          priority
          className="absolute bottom-0 right-0 lg:block hidden opacity-80"
        />
      </div>

      {loading && <BiLoader className="h-8 w-8 animate-spin mx-auto" />}

      {error && (
        <p className="w-fit bg-red-500/50 p-4 rounded-lg mx-auto flex items-center justify-center gap-2">
          <IoWarning className="h-5 w-5 mr-2" />
          Failed to load games. Please try again!
          <button
            onClick={() => loadSkillmasters()}
            className="bg-white/10 p-2 rounded-lg hover:bg-white/20"
          >
            Try Again
          </button>
        </p>
      )}

      {/* Search and Filters */}
      {!loading && !error && skillMasters.length < 1 ? (
        <p className="w-full">No skill masters found!</p>
      ) : (
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
              filteredSkillmasters.map(
                (skillMaster) =>
                  !skillMaster?.deleted_at &&
                  skillMaster?.image_url && (
                    <SkillmasterCard
                      key={skillMaster.id}
                      skillMaster={skillMaster}
                      searchTerm={searchTerm}
                    />
                  )
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillMastersPage;
