import { games } from "@/lib/data";
import { CheckIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import Badges from "../_components/Badges";
import Link from "next/link";

const GamePage = ({ params }) => {
  const game = games.find((game) => game.id === params.gameId);

  return (
    <div className="mt-24 max-w-7xl mx-auto min-h-screen space-y-6 p-4">
      {/* Background Image */}
      <div className="left-0 fixed top-0 -z-10 h-full w-full">
        <Image
          src={game.bgImage}
          alt={game.altText}
          fill
          unoptimized
          className="h-full w-full fixed top-0 object-cover -z-10"
        />
        <div className="absolute inset-0 bg-black opacity-40 -z-10" />
      </div>

      <h2 className="text-center text-4xl font-title text-white sm:text-5xl dark:text-white">
        Boost Your Game
      </h2>

      <div className="flex flex-col lg:flex-row gap-6 justify-center p-8 rounded-xl bg-cover bg-center">
        <div
          className="relative z-10 bg-black/50 rounded-xl h-fit p-8 backdrop-blur-sm"
          style={{ backgroundColor: game.primaryColor + 80 }}
        >
          <Image
            src={game.image}
            alt={game.altText}
            quality={100}
            className="h-full w-full max-w-[200px] object-contain mx-auto"
          />
        </div>
        <div className="relative z-10 flex flex-col gap-4">
          <h3 className="text-2xl font-bold">{game.name}</h3>
          <p className="text-lg text-gray-300">{game.tagLine}</p>
          <p className="text-xl font-medium max-w-2xl">{game.description}</p>

          <ul role="list" className="space-y-3">
            {game.features.map((feature) => (
              <li key={feature} className="flex gap-x-3">
                <CheckIcon
                  className="h-6 w-5 flex-none text-green-500"
                  aria-hidden="true"
                />
                {feature}
              </li>
            ))}
          </ul>

          {!!game.isActive ? (
            <Link
              href={`/boost/${game.id}`}
              className="w-full flex justify-end"
            >
              <button
                aria-describedby={game.id}
                aria-label="Boost Button"
                title="Boost Button"
                className="h-14 bg-boostButton bg-contain bg-center bg-no-repeat px-3 py-2 transition-all hover:scale-110 lg:w-1/2 w-full"
              />
            </Link>
          ) : (
            <p className="text-md mx-4 cursor-wait rounded-md bg-gray-500/50 py-2 text-center italic text-gray-300">
              Coming Soon
            </p>
          )}
        </div>
      </div>

      {/* game badges */}
      <Badges />
    </div>
  );
};

export default GamePage;
