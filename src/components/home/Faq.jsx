import { faqs } from "@/lib/data";
import Image from "next/image";
import { useState } from "react";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

export const Faq = () => {
  const [currentDesc, setCurrentDesc] = useState(0);

  return (
    <div className="mt-14 lg:mt-20 lg:mx-auto lg:max-w-7xl">
      <div className="h-16 w-56 bg-howItWorks bg-contain bg-no-repeat">
        <h1 className="pl-20 pt-2 font-title text-4xl tracking-widest">FAQ</h1>
      </div>

      <div className="bg-CardPlum/50 border-Gold border-t-2 border-l-2 border-r-[12px] border-b-[12px] lg:p-12 py-8 px-2 md:px-4 md:rounded-[3rem] rounded-3xl flex lg:space-x-6 w-full flex-col-reverse lg:flex-row shadow-2xl backdrop-blur-xl gap-4">
        {/* right faq questions */}
        <div className="lg:w-1/2 text-left space-y-6 text-lg md:text-xl font-semibold">
          <p className="">
            Discover answers to your questions about our services for PC, Xbox,
            and PlayStation gamers. Explore customization options, pricing, and
            our commitment to safety. We&apos;re here to enhance your gaming
            experience.
          </p>

          {faqs.map((item, i) => (
            <p
              key={i}
              onClick={() => setCurrentDesc(i)}
              className={clsx(
                "w-full rounded-xl p-4 cursor-pointer flex items-center",
                currentDesc === i ? "bg-Gold/50" : "bg-CardPlum/80"
              )}
            >
              <ArrowRightIcon className="text-white mr-4 w-8" />
              <span className="w-full">{item.question}</span>
            </p>
          ))}
        </div>

        {/* Left faq box */}
        <div className="lg:w-1/2 text-left space-y-6 relative">
          <h2 className="text-2xl md:text-3xl font-bold ml-2">Answers</h2>
          <div className="rounded-3xl border-white border-t-2 border-l-2 border-r-8 border-b-8 p-4 md:p-6 bg-Gold text-lg font-semibold shadow-xl space-y-4">
            <div className="block rounded-full w-4 h-4 bg-white" />
            <p className="text-lg md:text-xl">{faqs[currentDesc].answer}</p>
          </div>

          <Image
            src="/utils/trunk.png"
            width={500}
            height={500}
            alt="shiny purple and gold controllers with keyboard"
            className="absolute -bottom-10 -right-10 z-10 hidden lg:block drop-shadow-[-10px_20px_8px_rgba(0,0,0,0.5)]"
          />
        </div>
      </div>
    </div>
  );
};
