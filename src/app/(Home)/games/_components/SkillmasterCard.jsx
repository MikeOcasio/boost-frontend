import Image from "next/image";
import Link from "next/link";
import { IoMdPerson } from "react-icons/io";
import { PiGameControllerFill } from "react-icons/pi";

// Helper function to highlight matching terms
const highlightMatch = (text, searchTerm) => {
  if (!searchTerm) return text; // If no search term, return the original text
  const regex = new RegExp(`(${searchTerm})`, "gi"); // Case-insensitive match
  const parts = text?.split(regex); // Split the text into matching and non-matching parts

  return parts?.map((part, index) =>
    regex.test(part) ? <mark key={index}>{part}</mark> : part
  );
};

export const SkillmasterCard = ({ skillMaster, searchTerm }) => {
  return (
    <div className="flex flex-wrap w-full pb-8 border-b hover:border-Gold">
      <div className="flex h-[200px] w-[200px] mx-auto bg-white/10 rounded-lg p-4">
        {skillMaster.image_url ? (
          <Image
            src={skillMaster.image_url}
            alt={skillMaster.first_name}
            width={150}
            height={150}
            priority
            className="h-full m-auto w-full object-contain object-center rounded-lg"
          />
        ) : (
          <IoMdPerson className="h-28 w-28 rounded-full m-auto" />
        )}
      </div>

      <div className="flex min-w-[210px] flex-col gap-2 flex-1 justify-between my-6 mx-2 md:mx-6">
        <div className="space-y-2">
          <p className="text-xl font-bold leading-6 text-white">
            {!skillMaster.gamer_tag &&
              highlightMatch("Skillmaster#" + skillMaster.id, searchTerm)}

            {skillMaster.gamer_tag &&
              highlightMatch(skillMaster.gamer_tag, searchTerm)}
          </p>

          {skillMaster.platforms.length > 0 && (
            <div className="flex flex-wrap gap-2 text-sm items-center">
              Play:{" "}
              {skillMaster.platforms.map((platform) => (
                <p
                  key={platform.id}
                  className="bg-white/10 px-2 rounded-md text-center flex gap-2 items-center"
                >
                  <PiGameControllerFill className="h-5 w-5" />{" "}
                  {highlightMatch(platform.name, searchTerm)}
                </p>
              ))}
            </div>
          )}

          <p className="text-sm text-white/70 font-semibold">
            {highlightMatch(skillMaster.bio, searchTerm)}
          </p>
        </div>

        <Link href={`/skillmasters/${skillMaster.id}`}>
          <div className="relative hover:scale-105 transition-all">
            <button
              aria-describedby={skillMaster.id}
              aria-label="Boost Button"
              title="Boost Button"
              className="w-full h-12 bg-boostButton bg-contain bg-right bg-no-repeat px-3 py-2"
            />
            <p className="absolute bottom-1 right-[54px] bg-Gold px-1 text-2xl font-bold">
              View Profile
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};
