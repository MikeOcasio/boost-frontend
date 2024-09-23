import { people } from "@/lib/data";
import Image from "next/image";

const SkillMasters = () => {
  return (
    <div className="relative mx-auto mt-14 lg:mt-20 max-w-7xl text-right">
      <div className="absolute right-0 h-36 w-64 bg-skillsMaster bg-contain bg-no-repeat">
        <h1 className="pr-12 pt-[.7rem] font-title text-4xl tracking-widest">
          Skill Masters
        </h1>
      </div>

      <div className="h-36" />

      <div className="carousel-container mx-auto">
        <ul
          role="list"
          className="carousel-items gap-x-8 gap-y-16 flex flex-wrap justify-center items-center w-full"
        >
          {people.concat(people).map((person, index) => (
            <li
              key={index}
              className="flex flex-col items-center w-fit h-full relative group overflow-hidden rounded-md"
            >
              <div className="relative w-72 h-full">
                <Image
                  src={person.imageUrl}
                  alt={person.name}
                  height={400}
                  width={400}
                  quality={100}
                  priority
                  className="object-contain h-full transition-transform duration-300 ease-in-out transform group-hover:scale-110"
                />
              </div>

              <div className="group-hover:opacity-100 transition-all opacity-0 absolute bg-black/50 backdrop-blur-sm bottom-0 w-full flex flex-col items-center justify-center p-4">
                <h3 className="mt-6 text-base font-semibold leading-7 tracking-tight">
                  {person.name}
                </h3>
                <p className="text-sm leading-6">{person.role}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SkillMasters;
