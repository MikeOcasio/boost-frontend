import Image from "next/image";
import Link from "next/link";

export const SkillmasterCard = ({ skillMaster }) => {
  return (
    <div className="flex flex-wrap w-full pb-8 border-b hover:border-Gold">
      <div className="flex max-h-[200px] mx-auto bg-white/10 rounded-lg">
        <Image
          src={skillMaster.image_url}
          alt={skillMaster.first_name}
          quality={100}
          width={200}
          height={200}
          className="mx-auto h-full object-contain rounded-lg"
        />
      </div>

      <div className="flex min-w-[210px] flex-col gap-2 flex-1 justify-between m-6">
        <div className="space-y-2">
          <p className="text-xl font-bold leading-6 text-white">
            {skillMaster.first_name} {skillMaster.last_name}
          </p>
          <p className="text-sm text-white/70 font-semibold">
            {skillMaster.about}
          </p>
        </div>

        <Link href={`/skillmasters/${skillMaster.id}`}>
          <div className="relative hover:scale-110 transition-all">
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
