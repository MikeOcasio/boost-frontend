"use client";

import Image from "next/image";

import { ContactForm } from "@/components/home/ContactForm";
import GameCard from "@/components/GameCard";
import HomePageAboutArea from "@/components/home/HomePageAboutArea";

import image1 from "@/images/characters.png";
import burningCity from "@/images/cityBurn2.png";
import purpleLane from "@/images/purpleLane.png";
import { games } from "@/lib/data";

export default function Home() {
  return (
    <div className="mt-10">
      <div className="h-screen w-full">
        <div className="fixed top-0 -z-10 h-full w-full">
          <Image
            src={purpleLane}
            alt="background-picture"
            quality={100}
            className="h-full w-full object-cover blur-sm backdrop-contrast-125"
          />
        </div>

        <div className="flex h-full flex-col items-center justify-center">
          <h1 className="text-center font-title lg:text-8xl text-[12vw] tracking-widest text-gray-300 drop-shadow-[0_15px_3px_rgba(0,0,0,0.6)]">
            RAVENBOOST
          </h1>

          <Image
            src="/homeHero.png"
            height={800}
            width={800}
            alt="group of video game characters"
            unoptimized
            priority
            className="h-[50vh] md:scale-105 object-contain drop-shadow-[0_30px_5px_rgba(0,0,0,0.5)]"
          />

          <p className="mx-auto max-w-[80%] text-center lg:text-3xl text-lg font-medium leading-6 text-gray-300">
            Boost Your Game, Your Way! Choose your dream team and leave the rest
            to us.
          </p>
        </div>
      </div>

      <div className="h-screen w-full sticky top-0 -z-10">
        <Image
          src={burningCity}
          alt="background-picture"
          quality={100}
          className="h-full w-full object-cover blur-md backdrop-contrast-125"
        />
      </div>

      <div className="mx-auto grid grid-cols-1 gap-10 px-4 text-xl lg:max-w-7xl lg:grid-cols-3 lg:-mt-[110vh] -mt-[90vh]">
        {/* Embla Carousel package for scrollable */}

        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>

      <HomePageAboutArea />

      {/* Prod Changes */}
      {/* <ContactForm /> */}
    </div>
  );
}
