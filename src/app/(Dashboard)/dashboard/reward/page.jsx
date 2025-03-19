"use client";

import { getUserRewardPoints } from "@/lib/actions/user-actions";
import { useEffect, useState } from "react";
import { BiLoader } from "react-icons/bi";
import { IoWarning } from "react-icons/io5";
import RewardCard from "../admin/_components/reward-card";

const RewardPage = () => {
  const [reward, setReward] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);

  const fetchReward = async () => {
    setLoading(true);

    try {
      const res = await getUserRewardPoints();

      console.log(res);

      if (res.error) {
        setError(true);
      } else {
        setReward(res);
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReward();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Reward Points</h1>
        <BiLoader className="h-8 w-8 animate-spin mx-auto" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Reward Points</h1>
        <p className="w-fit bg-red-500/50 p-4 rounded-lg mx-auto flex items-center justify-center gap-2">
          <IoWarning className="h-5 w-5 mr-2" />
          Failed to load rewards. Please try again!
          <button onClick={fetchReward} className="p-2 rounded-lg bg-white/10">
            Reload
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">Reward Points</h1>

      {reward && (
        <div className="flex flex-wrap gap-6">
          <RewardCard title="Completion Stats" data={reward.completion} />
        </div>
      )}
    </div>
  );
};

export default RewardPage;
