"use client";

import Image from "next/image";
import { useState } from "react";

const badgeTypes = ["LEVELING", "KILLS", "BADGES", "WINS"];

const badgeDataByType = {
  LEVELING: [
    {
      type: "LEVEL 10",
      description: "Reached level 10 in the game",
      icon: "/badges/bomb.png",
    },
    {
      type: "LEVEL 50",
      description: "Reached level 50 in the game",
      icon: "/badges/kill.png",
    },
    {
      type: "MAX LEVEL",
      description: "Reached the maximum level",
      icon: "/badges/bomb.png",
    },
    {
      type: "MAX LEVEL",
      description: "Reached the maximum level",
      icon: "/badges/kill.png",
    },
  ],
  KILLS: [
    {
      type: "100 KILLS",
      description: "Reached 100 total kills",
      icon: "/badges/bomb.png",
    },
    {
      type: "HEADSHOT KING",
      description: "50 headshot kills in a single match",
      icon: "/badges/kill.png",
    },
    {
      type: "TEAM WIPE",
      description: "Eliminated an entire enemy team",
      icon: "/badges/bomb.png",
    },
    {
      type: "TEAM WIPE",
      description: "Eliminated an entire enemy team",
      icon: "/badges/kill.png",
    },
  ],
  BADGES: [
    {
      type: "20 BOMB",
      description: "20 kills in a single match",
      icon: "/badges/bomb.png",
    },
    {
      type: "RAPID FIRE",
      description: "5 kills in 30 seconds",
      icon: "/badges/kill.png",
    },
    {
      type: "MEDIC",
      description: "Revived 10 teammates in a single match",
      icon: "/badges/bomb.png",
    },
    {
      type: "MEDIC",
      description: "Revived 10 teammates in a single match",
      icon: "/badges/kill.png",
    },
  ],
  WINS: [
    {
      type: "FIRST WIN",
      description: "Won your first match",
      icon: "/badges/bomb.png",
    },
    {
      type: "WIN STREAK",
      description: "Won 5 matches in a row",
      icon: "/badges/kill.png",
    },
    {
      type: "CHAMPION",
      description: "Won 100 total matches",
      icon: "/badges/bomb.png",
    },
    {
      type: "CHAMPION",
      description: "Won 100 total matches",
      icon: "/badges/kill.png",
    },
  ],
};

const Badges = () => {
  const [selectedBadge, setSelectedBadge] = useState("BADGES");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between bg-red-500/30 p-2 rounded-lg backdrop-blur-lg">
        {badgeTypes.map((type) => (
          <button
            key={type}
            className={`px-4 py-2 rounded-lg transition-all flex-1 text-white ${
              selectedBadge === type ? "bg-red-500" : ""
            }`}
            onClick={() => setSelectedBadge(type)}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="flex gap-6 flex-wrap">
        {badgeDataByType[selectedBadge].map((badge, index) => (
          <div
            key={index}
            className={`backdrop-blur-lg rounded-lg overflow-hidden hover:scale-[1.02] transition-all w-full p-4 flex-1 min-w-fit max-w-full ${
              index % 2 === 0 ? "bg-red-500/80" : "bg-blue-900/80"
            }`}
          >
            <div className="flex flex-wrap sm:flex-nowrap gap-6">
              <Image
                src={badge.icon}
                alt="badge"
                width={100}
                height={100}
                unoptimized
                className="bg-black/20 rounded-lg p-4 h-fit"
              />
              <div className="flex flex-col gap-2 text-white">
                <h2 className="text-xl font-bold">{badge.type}</h2>
                <p>{badge.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Badges;
