import Image from "next/image";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import Link from "next/link";
import { VscDebugBreakpointLog } from "react-icons/vsc";

// Helper function to highlight matching terms
const highlightMatch = (text, searchTerm) => {
  if (!searchTerm) return text; // If no search term, return the original text
  const regex = new RegExp(`(${searchTerm})`, "gi"); // Case-insensitive match
  const parts = text?.split(regex); // Split the text into matching and non-matching parts

  return parts.map((part, index) =>
    regex.test(part) ? <mark key={index}>{part}</mark> : part
  );
};

const GameCard = ({ game, searchTerm, primary_color, secondary_color }) => {
  return (
    <div
      key={game.id}
      className="relative inline-block font-medium group w-full"
    >
      <span
        className={
          "absolute inset-0 w-full h-full transition duration-400 ease-out transform md:translate-x-3 md:translate-y-3 translate-x-2 translate-y-2 bg-Gold group-hover:-translate-x-0 group-hover:-translate-y-0 rounded-md"
        }
        style={{ backgroundColor: primary_color + 70 }}
      />
      <span className="absolute inset-0 w-full h-full bg-Plum border border-Plum group-hover:bg-Plum/80 rounded-md" />

      <Link
        href={game.is_active && `/products/${game.id}`}
        className="w-min ml-auto"
      >
        <div
          className={clsx(
            "flex overflow-hidden flex-col justify-between w-full md:min-w-[350px] h-[500px] rounded-md bg-CardPlum p-4 md:p-6 shadow-xl drop-shadow-xl hover:border-Gold gap-4 relative group"
          )}
        >
          {game.most_popular && (
            <p className="text-xs px-2 rounded-md bg-orange-500/80 absolute top-0 left-0 m-4">
              {game.most_popular && "Popular"}
            </p>
          )}

          <Image
            src={game.image || "/game/empty-image.gif"}
            alt={game.name}
            quality={100}
            width={200}
            height={200}
            priority
            className="absolute top-0 left-0 -z-30 mx-auto w-full h-[90%] object-cover !rounded-md group-hover:scale-110 transition-all duration-500"
          />

          <div
            className="absolute -z-10 top-0 left-0 w-full h-full rounded-md"
            style={{
              background: `linear-gradient(to bottom, transparent, ${
                secondary_color ? secondary_color + "e0" : "#3a064d"
              } , ${secondary_color || "#3a064d"})`,
            }}
          />

          {/* <div className="flex items-center gap-2 flex-wrap w-full text-xs -mt-2">
          <span className="bg-white/10 px-2 rounded-md flex-1 text-center min-w-fit">
            {highlightMatch(game.category?.name, searchTerm)}
          </span>

          {game.platforms?.map((platform) => (
            <p
              key={platform.id}
              className="bg-black/20 px-2 rounded-md flex-1 text-center"
            >
              {highlightMatch(platform.name, searchTerm)}
            </p>
          ))}
        </div> */}

          {/* <p className="text-xs text-white/70 font-semibold text-center">
              {game.tag_line?.length > 50
                ? highlightMatch(game.tag_line, searchTerm).slice(0, 50) + "..."
                : highlightMatch(game.tag_line, searchTerm)}
            </p> */}

          <div className="relative mt-auto flex flex-col gap-3">
            <p className="text-xl md:text-2xl font-bold leading-6 text-white capitalize text-left">
              {game.name?.length > 50
                ? highlightMatch(game.name, searchTerm).slice(0, 50) + "..."
                : highlightMatch(game.name, searchTerm)}
            </p>

            <ul
              role="list"
              className="space-y-1 text-sm text-left leading-6 text-white/90 px-2"
            >
              {game.features?.slice(0, 4).map((feature, index) => (
                <li key={index} className="flex gap-x-3">
                  <VscDebugBreakpointLog
                    className="h-6 w-5 flex-none text-Gold"
                    aria-hidden="true"
                  />
                  <span
                    className={clsx("font-bold", index === 0 && "text-Gold")}
                  >
                    {feature?.length > 40
                      ? highlightMatch(feature, searchTerm).slice(0, 40) + "..."
                      : highlightMatch(feature, searchTerm)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex justify-between gap-2 flex-wrap mt-2">
              {/* price */}
              {game.price ? (
                <p className="text-lg font-bold text-white text-center flex items-end gap-2">
                  <span className="text-sm text-white/70">From</span>
                  <span className="font-bold text-2xl">
                    ${Number(game.price)?.toFixed(2)}
                  </span>
                </p>
              ) : (
                <p className="font-bold text-xl">Explore</p>
              )}

              {game.is_active && (
                <button
                  disabled={!game.is_active}
                  className="flex items-center bg-gradient-to-b to-Gold/80 from-yellow-400 border border-white/50 p-3 rounded-md"
                >
                  <ArrowRightIcon
                    className={clsx(
                      "h-6 w-6 text-white/90 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                  />
                </button>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default GameCard;
