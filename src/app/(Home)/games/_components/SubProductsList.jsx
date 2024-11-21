"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { FaExternalLinkAlt, FaGamepad } from "react-icons/fa";

// Helper function to highlight matching terms
const highlightMatch = (text, searchTerm) => {
  if (!searchTerm) return text; // If no search term, return the original text
  const regex = new RegExp(`(${searchTerm})`, "gi"); // Case-insensitive match
  const parts = text.split(regex); // Split the text into matching and non-matching parts

  return parts.map((part, index) =>
    regex.test(part) ? <mark key={index}>{part}</mark> : part
  );
};

export const SubProductsList = ({ game }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Helper function: Normalize strings (remove extra spaces and convert to lowercase)
  const normalize = (str) => str?.toLowerCase().replace(/\s+/g, "").trim();

  // Filter and search logic
  const filteredGames = useMemo(() => {
    const term = normalize(searchTerm);

    return game?.children?.filter((game) => {
      return (
        !term ||
        normalize(game.name).includes(term) ||
        normalize(game.description).includes(term) ||
        normalize(String(game.id)).includes(term) ||
        normalize(game.tag_line).includes(term) ||
        game.platforms.some((platform) =>
          normalize(platform.name).includes(term)
        ) ||
        game.prod_attr_cats.some((attr) =>
          normalize(attr.name).includes(term)
        ) ||
        // category
        normalize(game.category.name).includes(term)
      );
    });
  }, [game, searchTerm]);

  return (
    game?.children?.length > 0 && (
      <div className="flex flex-col gap-2 p-4 rounded-lg border border-white/10 bg-white/10 backdrop-blur-lg">
        <p className="text-lg font-semibold">Recommendation for you</p>

        {/* search for sub products */}
        <div className="flex flex-wrap items-center gap-4">
          <input
            type="text"
            autoFocus={!game.price}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Search in ${game.name}...`}
            className="flex-1 min-w-fit p-2 rounded-lg bg-black/50 border-white/10 border hover:border-white/20 backdrop-blur-xl outline-none"
          />
        </div>

        <div className="flex flex-col gap-2 max-h-screen overflow-y-auto">
          {game?.children?.length > 0 &&
            filteredGames.map(
              (child, index) =>
                child.is_active && (
                  <Link
                    href={`/games/${child.id}`}
                    key={index}
                    className="flex flex-col gap-2 p-3 transition-all bg-CardPlum rounded-lg border border-white/10 backdrop-blur-xl"
                    style={{
                      backgroundColor:
                        index % 2 === 0
                          ? game.secondary_color + 90
                          : game.primary_color + 90,
                    }}
                  >
                    <div className="flex flex-wrap-reverse gap-2 items-center justify-between">
                      <div className="text-xs font-semibold flex items-center gap-2">
                        <span>
                          {highlightMatch(child.category?.name, searchTerm)} /{" "}
                        </span>

                        <span className="flex items-center gap-1">
                          <FaGamepad className="h-4 w-4" />
                          {child.platforms?.map((platform, index) => (
                            <span key={index}>
                              {highlightMatch(platform.name, searchTerm)}
                              {index < child.platforms.length - 1 && ", "}
                            </span>
                          ))}
                        </span>
                      </div>

                      <Link
                        href={`/games/${child.id}`}
                        target="_blank"
                        className="flex flex-wrap justify-center items-center gap-2 rounded-lg px-2 py-1 hover:border-white/20 border border-white/10 bg-black/30 backdrop-blur-xl"
                      >
                        <FaExternalLinkAlt className="h-4 w-4" />
                        <p className="text-sm">View</p>
                      </Link>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                      <div
                        className="rounded-lg overflow-hidden"
                        style={{
                          backgroundColor:
                            index % 2 === 0
                              ? game.primary_color + 90
                              : game.secondary_color + 90,
                        }}
                      >
                        <Image
                          src={child.image || "/game/empty-image.gif"}
                          alt={child.name}
                          width={200}
                          height={200}
                          priority
                          className="h-full object-contain max-w-[200px] w-full rounded-lg"
                        />
                      </div>

                      <div className="flex flex-col w-full gap-1">
                        <div className="font-medium flex items-center gap-2">
                          {highlightMatch(child.name, searchTerm)}

                          {child.most_popular && (
                            <p className="text-xs px-2 rounded-md bg-Gold/50 backdrop-blur-xl">
                              {child.most_popular && "Popular"}
                            </p>
                          )}
                        </div>

                        {/* attributes */}
                        {child.prod_attr_cats?.length > 0 && (
                          <div className="flex gap-2 items-center flex-wrap">
                            {child.prod_attr_cats.map((item, index) => (
                              <span
                                key={index}
                                className="text-xs font-semibold bg-white/10 px-2 rounded-md w-fit"
                              >
                                {highlightMatch(item.name, searchTerm)}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* tag_line */}
                        <div className="text-xs text-white/80">
                          <span className="font-semibold text-white">
                            Tag Line :{" "}
                          </span>
                          {highlightMatch(
                            child.tag_line.substring(0, 150),
                            searchTerm
                          )}
                          {child.tag_line.length > 150 && "..."}
                        </div>

                        {/* description */}
                        <div className="text-xs text-white/80">
                          <span className="font-semibold text-white">
                            Description :{" "}
                          </span>
                          {highlightMatch(
                            child.description.substring(0, 150),
                            searchTerm
                          )}
                          {child.description.length > 150 && "..."}
                        </div>

                        {child.price && child.tax && (
                          <div className="flex flex-wrap justify-between items-center gap-2">
                            <p>Tax: ${child.tax}</p>

                            <p className="text-lg font-semibold text-right flex-1">
                              Price: ${child.price}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                )
            )}
        </div>
      </div>
    )
  );
};
