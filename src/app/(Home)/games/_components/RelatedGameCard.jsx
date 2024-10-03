import Image from "next/image";
import { CheckIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import Link from "next/link";

const RelatedGameCard = ({ game, primary_color, secondary_color, index }) => {
  return (
    <div className="bg-black rounded-lg">
      <div
        key={game.id}
        className={clsx(
          "flex flex-col justify-between w-[300px] md:w-[400px] h-full rounded-lg bg-CardPlum p-4 md:px-6 shadow-xl drop-shadow-xl hover:border-Gold"
        )}
        style={{
          backgroundColor:
            index % 2 === 0 ? secondary_color + 70 : primary_color + 70,
        }}
      >
        <div className="bg-white/20 rounded-lg">
          <div
            className="flex h-[150px] items-center justify-between gap-x-4 bg-white/10 rounded-lg"
            style={{
              backgroundColor:
                index % 2 === 0 ? primary_color + 30 : secondary_color + 30,
            }}
          >
            <Image
              src={game.image}
              alt={game.name}
              quality={100}
              width={200}
              height={200}
              className="mx-auto h-full w-full max-w-[200px] object-contain"
            />
          </div>
        </div>

        <p className="py-4 text-center text-2xl font-bold leading-6 text-white">
          {game.tag_line}
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

        {game.is_active ? (
          <Link href={`/games/${game.id}`}>
            <button
              aria-describedby={game.id}
              aria-label="Boost Button"
              title="Boost Button"
              className="mx-auto w-full h-10 bg-boostButton bg-contain bg-center bg-no-repeat px-3 py-2 transition-all hover:scale-110"
            />
          </Link>
        ) : (
          <p className="text-md mx-4 rounded-md bg-white/10 py-2 text-center italic cursor-wait">
            Coming Soon
          </p>
        )}
      </div>
    </div>
  );
};

export default RelatedGameCard;
