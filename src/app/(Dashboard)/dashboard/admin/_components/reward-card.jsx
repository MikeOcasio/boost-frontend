import React from "react";
import { FaTrophy, FaChartLine } from "react-icons/fa";

const ProgressBar = ({ current, next }) => {
  const percentage = Math.min((current / next) * 100, 100);
  return (
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        className="h-full bg-blue-600 rounded-full transition-all duration-500"
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

  return (
    <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10 flex-1">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-blue-500/20">
          <FaChartLine className="h-5 w-5 text-blue-400" />
        </div>
        <h3 className="text-2xl font-bold">{title}</h3>
      </div>

      <div className="flex flex-wrap gap-4 mb-4">
        {completionStats.map(([key, value]) => (
          <div
            key={key}
            className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all duration-300 w-full"
          >
            <div className="flex items-center gap-2 mb-2">
              <FaTrophy className="h-4 w-4 text-yellow-400" />
              <p className="text-sm text-gray-300 capitalize">
                {key.replace(/_/g, " ")}
              </p>
            </div>
            <p className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              {typeof value === "number" ? value.toLocaleString() : value}
            </p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 p-4 rounded-lg">
            <p className="text-sm text-gray-400">Available Points</p>
            <p className="text-2xl font-bold">{data.available_points}</p>
          </div>
          <div className="bg-white/5 p-4 rounded-lg">
            <p className="text-sm text-gray-400">Total Points</p>
            <p className="text-2xl font-bold">{data.total_points}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress to Next Tier</span>
            <span>{data.next_threshold} points needed</span>
          </div>
          <ProgressBar current={data.total_points} next={data.next_threshold} />
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold">Reward Tiers</h4>
          <div className="grid gap-2">
            {Object.entries(data.rewards).map(([points, reward]) => (
              <div
                key={points}
                className={`p-3 rounded-lg border ${
                  data.total_points >= parseInt(points)
                    ? "border-green-500/50 bg-green-500/10"
                    : "border-gray-700 bg-white/5"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{reward.title}</span>
                  <span className="text-sm">{points} pts</span>
                </div>
                <p className="text-sm text-gray-400">
                  Reward: ${reward.reward}
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
