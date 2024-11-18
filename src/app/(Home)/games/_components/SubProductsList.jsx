import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { BiImage } from "react-icons/bi";
import { FaExternalLinkAlt, FaGamepad } from "react-icons/fa";

export const SubProductsList = ({ game }) => {
  return (
    game?.children?.length > 0 && (
      <div className="flex flex-col gap-2 p-4 rounded-lg border border-white/10 bg-white/10">
        <p className="text-lg font-semibold">Recommendation for you</p>

        <div className="flex flex-col gap-2 max-h-screen overflow-y-auto">
          {game?.children?.length > 0 &&
            game.children.map(
              (child, index) =>
                child.is_active && (
                  <Link
                    href={`/games/${child.id}`}
                    target="_blank"
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
                        <span>{child.category?.name} / </span>

                        <span className="flex items-center gap-2">
                          <FaGamepad className="h-4 w-4" />
                          {child.platforms?.map((platform, index) => (
                            <span key={index}>
                              {platform.name}
                              {index < child.platforms.length - 1 && ", "}
                            </span>
                          ))}
                        </span>
                      </div>

                      <Link
                        href={`/games/${child.id}`}
                        target="_blank"
                        className="flex flex-wrap justify-center items-center gap-2 rounded-lg px-2 py-1 hover:border-white/20 border border-white/10"
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

                      <div className="flex flex-col w-full gap-2">
                        <div className="font-medium flex items-center gap-2">
                          {child.name}

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
                                {item.name}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* tag_line */}
                        <div className="text-xs text-white/80">
                          <span className="font-semibold text-white">
                            Tag Line :{" "}
                          </span>
                          {child.tag_line.substring(0, 150)}
                          {child.tag_line.length > 150 && "..."}
                        </div>

                        {/* description */}
                        <div className="text-xs text-white/80">
                          <span className="font-semibold text-white">
                            Description :{" "}
                          </span>
                          {child.description.substring(0, 150)}
                          {child.description.length > 150 && "..."}
                        </div>
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
