import Image from "next/image";
import Link from "next/link";

export const SkillmasterCard = ({ skillMaster }) => {
  return (
    <div className="flex flex-wrap w-full gap-4 pb-8 border-b hover:border-Gold">
      <div className="flex max-w-[250px] max-h-[250px] items-center justify-between gap-x-4 bg-white/10 rounded-lg">
        <Image
          src={skillMaster.image_url || "/skillmasters/skillmaster2.webp"}
          alt={skillMaster.first_name}
          quality={100}
          width={200}
          height={200}
          className="mx-auto h-full w-full object-cover rounded-lg"
        />
      </div>

      <div className="flex flex-col gap-2 flex-1 justify-between mx-4">
        <div className="space-y-2">
          <p className="text-xl font-bold leading-6 text-white">
            {skillMaster.first_name} {skillMaster.last_name}
          </p>
          <p className="text-sm text-white/70 font-semibold">
            {skillMaster.about}
          </p>
        </div>

        <Link href={`/skillmasters/${skillMaster.id}`}>
          <button
            aria-describedby={skillMaster.id}
            aria-label="Boost Button"
            title="Boost Button"
            className="w-full h-12 bg-boostButton bg-contain bg-right bg-no-repeat px-3 py-2 transition-all hover:scale-110"
          />
        </Link>
      </div>
    </div>
  );
};
