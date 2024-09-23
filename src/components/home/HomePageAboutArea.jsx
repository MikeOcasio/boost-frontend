import Image from "next/image";
import controllers from "@/images/photos/controllers.png";
import clsx from "clsx";
import { Faq } from "./Faq";
import SkillMasters from "./SkillMasters";
import { steps } from "@/lib/data";

export default function HomePageAboutArea() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
      <div className="mx-auto text-base leading-7">
        <div className="flex justify-end">
          <Image
            src={controllers}
            alt="shiny purple and gold controllers with keyboard"
            quality={100}
            className="md:-mb-12 h-full w-full max-w-[500px] rotate-[17deg] object-contain drop-shadow-[0_30px_15px_rgba(0,0,0,0.5)]"
          />
        </div>

        {/* steps how it works */}
        <div className="mt-4 h-16 w-64 bg-howItWorks bg-contain bg-no-repeat">
          <h1 className="pl-12 pt-[.7rem] font-title text-4xl tracking-widest">
            How It Works
          </h1>
        </div>
        <div className="lg:mt-16 mt-4 w-full">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className={clsx(
                "mb-8 flex items-center w-fit",
                index % 2 !== 0 && "ml-auto"
              )}
            >
              <div className="relative inline-block group">
                <span
                  className={clsx(
                    "absolute inset-0 w-full h-full transition duration-400 ease-out transform md:translate-x-3 md:translate-y-3 translate-x-2 translate-y-2 bg-CardGold group-hover:-translate-x-0 group-hover:-translate-y-0 rounded-3xl",
                    index % 2 === 0
                      ? "bg-CardGold group-hover:border-CardPlum"
                      : "bg-CardPlum group-hover:border-CardGold"
                  )}
                ></span>
                <span
                  className={clsx(
                    "absolute inset-0 w-full h-full rounded-3xl",
                    index % 2 === 0
                      ? "bg-CardPlum group-hover:border-CardGold"
                      : "bg-CardGold group-hover:border-CardPlum"
                  )}
                ></span>

                <div
                  className={clsx(
                    "relative flex items-center rounded-3xl p-4 md:px-8 py-4 shadow-xl",
                    index % 2 === 0
                      ? "bg-CardPlum group-hover:border-Gold"
                      : "bg-CardGold group-hover:border-CardPlum"
                  )}
                >
                  <div className="flex items-center">{step.icon}</div>
                  <div className="mx-4 flex flex-col">
                    <h4 className="mb-2 lg:text-3xl text-xl font-semibold">
                      {step.title}
                    </h4>
                    <p className="lg:text-lg text-base">{step.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* skill Master */}
        <SkillMasters />

        {/* faq */}
        <Faq />
      </div>
    </div>
  );
}
