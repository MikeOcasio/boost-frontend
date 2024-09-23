import Image from "next/image";
import { CheckIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import Link from "next/link";

const GameCard = ({ game, boost }) => {
  return (
    <div key={game.id} className="relative inline-block font-medium group">
      <span className="absolute inset-0 w-full h-full transition duration-400 ease-out transform md:translate-x-3 md:translate-y-3 translate-x-2 translate-y-2 bg-Gold group-hover:-translate-x-0 group-hover:-translate-y-0 rounded-md"></span>
      <span className="absolute inset-0 w-full h-full bg-Plum border border-Plum group-hover:bg-Plum/80 rounded-md"></span>

      <div
        className={clsx(
          "flex flex-col justify-between w-full h-full rounded-md bg-CardPlum p-4 md:p-8 shadow-xl drop-shadow-xl hover:border-Gold"
        )}
      >
        <div className="flex h-[150px] items-center justify-between gap-x-4">
          <Image
            src={game.image}
            alt={game.altText}
            quality={100}
            className="mx-auto h-full w-full max-w-[200px] object-contain"
          />
        </div>
        <p className="py-4 text-center text-2xl font-bold leading-6 text-white">
          {game.tagLine}
        </p>
        <ul
          role="list"
          className="mt-6 space-y-3 pb-4 text-base leading-6 text-gray-300"
        >
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

        {game.isActive ? (
          <Link href={`/${boost ? "boost" : "games"}/${game.id}`}>
            <button
              aria-describedby={game.id}
              aria-label="Boost Button"
              title="Boost Button"
              className="mx-auto w-full h-14 bg-boostButton bg-contain bg-center bg-no-repeat px-3 py-2 transition-all hover:scale-110"
            />
          </Link>
        ) : (
          <p className="text-md mx-4 rounded-md bg-gray-500/50 py-2 text-center italic text-gray-300 cursor-wait">
            Coming Soon
          </p>
        )}
      </div>
    </div>
  );
};

export default GameCard;
