import React from "react";
import toast from "react-hot-toast";
import { FaTrophy, FaChartLine, FaCopy } from "react-icons/fa";

const ProgressBar = ({ current, next }) => {
  const percentage = Math.min((current / next) * 100, 100);
  return (
    <div className="w-full h-3 bg-gray-800/50 rounded-full overflow-hidden backdrop-blur-sm">
      <div
        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500 shadow-lg shadow-blue-500/20"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

const RewardCard = ({ title, data }) => {
  const completionStats = Object.entries(data).filter(
    ([key]) =>
      ![
        "available_points",
        "total_points",
        "next_threshold",
        "rewards",
      ].includes(key)
  );

  console.log(data);

  const handleCopy = () => {
    navigator.clipboard.writeText(data.referral_link);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/90 rounded-2xl p-8 backdrop-blur-xl border border-white/10 flex-1 shadow-xl shadow-blue-500/5">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 shadow-lg shadow-blue-500/10">
          <FaChartLine className="h-6 w-6 text-blue-400" />
        </div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          {title}
        </h3>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        {completionStats.map(([key, value]) => (
          <div
            key={key}
            className="bg-white/5 rounded-xl p-5 hover:bg-white/10 transition-all duration-300 w-full border border-white/5 hover:border-blue-500/20 hover:shadow-lg hover:shadow-blue-500/10"
          >
            <div className="flex items-center gap-2 mb-3">
              <FaTrophy className="h-5 w-5 text-amber-400" />
              <p className="text-sm text-gray-300 capitalize font-medium">
                {key.replace(/_/g, " ")}
              </p>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-3 border border-white/10 p-3 rounded-xl hover:bg-blue-500/10 transition-all duration-300"
            >
              <p className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent cursor-pointer">
                {typeof value === "number" ? value.toLocaleString() : value}
              </p>
              <FaCopy className="h-4 w-4 text-gray-400 hover:text-blue-400 transition-colors" />
            </button>
          </div>
        ))}
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-white/5 to-white/2 p-5 rounded-xl border border-white/5">
            <p className="text-sm text-gray-400 font-medium mb-2">
              Available Points
            </p>
            <p className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              {data.available_points}
            </p>
          </div>
          <div className="bg-gradient-to-br from-white/5 to-white/2 p-5 rounded-xl border border-white/5">
            <p className="text-sm text-gray-400 font-medium mb-2">
              Total Points
            </p>
            <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              {data.total_points}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm font-medium">
            <span className="text-gray-300">Progress to Next Tier</span>
            <span className="text-blue-400">
              {data.next_threshold} points needed
            </span>
          </div>
          <ProgressBar current={data.total_points} next={data.next_threshold} />
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-lg bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Reward Tiers
          </h4>
          <div className="grid gap-3">
            {Object.entries(data.rewards).map(([points, reward]) => (
              <div
                key={points}
                className={`p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 ${
                  data.total_points >= parseInt(points)
                    ? "border-green-500/30 bg-green-500/10 hover:bg-green-500/20"
                    : "border-white/5 bg-white/5 hover:bg-white/10"
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-white">{reward.title}</span>
                  <span className="text-sm px-3 py-1 rounded-full bg-white/10">
                    {points} pts
                  </span>
                </div>
                <p className="text-sm text-gray-400">
                  Reward:{" "}
                  <span className="text-emerald-400">${reward.reward}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardCard;
