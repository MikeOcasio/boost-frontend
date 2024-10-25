import Image from "next/image";
import { CheckIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import Link from "next/link";

const RelatedGameCard = ({ game, primary_color, secondary_color, index }) => {
  return (
    <div className="bg-black rounded-lg select-none">
      <div
        key={game.id}
        className={clsx(
          "flex flex-col justify-between w-[300px] md:w-[400px] h-full rounded-lg bg-CardPlum p-4 shadow-xl drop-shadow-xl hover:border-Gold gap-4 relative"
        )}
        style={{
          backgroundColor:
            index % 2 === 0 ? secondary_color + 70 : primary_color + 70,
        }}
      >
        {game.most_popular && (
          <p className="text-xs px-2 rounded-md bg-Gold/50 absolute top-0 right-0 m-2">
            {game.most_popular && "Popular"}
          </p>
        )}

        <div
          className="flex h-[150px] items-center justify-between gap-x-4 bg-white/10 rounded-lg"
          style={{
            backgroundColor:
              index % 2 === 0 ? primary_color + 30 : secondary_color + 30,
          }}
        >
          <Image
            src={game.image || "/game/empty-image.gif"}
            alt={game.name}
            priority
            width={200}
            height={200}
            className="mx-auto h-full w-fit max-w-[200px] max-h-[130px] object-contain rounded-md"
          />
        </div>

        <div className="flex flex-col gap-2 items-center">
          <p className="text-xl font-bold leading-6 text-white">{game.name}</p>
          <p className="text-xs text-white/70 font-semibold">{game.tag_line}</p>
        </div>

        <ul
          role="list"
          className="space-y-2 text-sm leading-6 text-white/90 px-2"
        >
          {game.features?.map((feature) => (
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
          <div>
            <Link href={`/games/${game.id}`}>
              <button
                aria-describedby={game.id}
                aria-label="Boost Button"
                title="Boost Button"
                className="mx-auto w-full h-10 bg-boostButton bg-contain bg-center bg-no-repeat px-3 py-2 transition-all hover:scale-110"
              />
            </Link>
          </div>
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
