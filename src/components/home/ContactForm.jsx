"use client";

import { Switch } from "@headlessui/react";
import { useState } from "react";
import Image from "next/image";
import { BsDiscord } from "react-icons/bs";
import Link from "next/link";

export const ContactForm = () => {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="pb-12 lg:mx-auto lg:max-w-[1920px]">
      {/* Contact Us Title */}
      <div className="ml-auto w-64 bg-skillsMaster bg-contain bg-no-repeat">
        <h1 className="pr-20 pt-[.7rem] text-right font-title text-4xl tracking-widest">
          Contact Us
        </h1>
      </div>

      {/* Main Container for Form and Image */}
      <div className="my-8 mx-4 flex flex-col lg:flex-row-reverse rounded-3xl shadow-2xl overflow-hidden">
        {/* Right Side Image */}
        <div className="relative lg:w-[40%] min-h-96 lg:h-auto flex flex-col items-center justify-center bg-black/30">
          <Image
            src="/utils/APEX.webp"
            alt="APEX logo"
            width={500}
            height={500}
            className="absolute -z-10 inset-0 w-full h-full object-cover -scale-x-100 blur-sm"
          />
          <p className="z-10 p-4 md:p-6 text-lg leading-8 text-center">
            Got questions, need assistance, or want to share your feedback?
            We&apos;re all ears! At Raven Boost, your gaming experience and
            satisfaction are our top priorities. Use the options below to get in
            touch with us, and we&apos;ll make sure to address your needs as
            swiftly as possible.
          </p>
          <Image
            src="/utils/COD_Ghosts.png"
            alt="COD Ghosts"
            width={500}
            height={500}
            className="w-1/2 h-1/2 object-contain -mb-16 -ml-10 mr-auto"
          />
        </div>

        <div className="mx-auto w-full lg:w-[60%] bg-gradient-to-r from-CardPlum/50 to-CardGold/50 p-6 backdrop-blur-xl flex flex-col items-center justify-center">
          <p className="text-center text-xl font-bold">
            Send your query on Discord we are here to help you!
          </p>

          <Link
            href="https://discord.gg/Wr9n9EynKQ"
            target="_blank"
            className="mt-4 bg-purple-500/50 py-2 px-4 rounded-full mx-auto flex items-center justify-center gap-4"
          >
            <BsDiscord className="text-4xl" />
            <p className="text-center text-lg font-bold">Join Discord</p>
          </Link>
        </div>

        {/* Contact Form */}
        {/* <form
          action="#"
          method="POST"
          className="mx-auto w-full lg:w-[60%] bg-gradient-to-r from-CardPlum/50 to-CardGold/50 p-6 backdrop-blur-xl"
        >
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            <InputField
              label="Name"
              type="text"
              id="name"
              autoComplete="given-name"
            />
            <InputField
              label="Email"
              type="email"
              id="email"
              autoComplete="email"
            />
            <InputField label="Subject" type="text" id="subject" />
            <InputField label="Order #" type="text" id="order-number" />

            <div className="sm:col-span-2">
              <label
                htmlFor="message"
                className="block text-sm font-semibold leading-6 text-white"
              >
                Message
              </label>
              <div className="mt-2.5">
                <textarea
                  name="message"
                  id="message"
                  rows={4}
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-Gold sm:text-sm sm:leading-6 bg-transparent"
                  defaultValue=""
                />
              </div>
            </div>

            <div className="flex items-center gap-2 sm:col-span-2">
              <Switch
                checked={agreed}
                onChange={setAgreed}
                className="group relative flex h-7 min-w-14 w-14 cursor-pointer rounded-full bg-white/10 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-Gold/80"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-white ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
                />
              </Switch>

              <p className="text-sm leading-6 text-white">
                By selecting this, you agree to our{" "}
                <span className="font-semibold text-Gold">
                  privacy&nbsp;policy
                </span>
                .
              </p>
            </div>
          </div>

          <div className="mt-10">
            <button
              type="submit"
              className="block w-full rounded-full bg-Gold px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-Plum focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-Gold transition-all"
            >
              Let&apos;s talk
            </button>
          </div>
        </form> */}
      </div>
    </div>
  );
};

// // InputField Component for Form Fields
// const InputField = ({ label, type, id, autoComplete }) => (
//   <div>
//     <label
//       htmlFor={id}
//       className="block text-sm font-semibold leading-6 text-white"
//     >
//       {label}
//     </label>
//     <div className="mt-2.5">
//       <input
//         type={type}
//         name={id}
//         id={id}
//         autoComplete={autoComplete}
//         className="block w-full rounded-md border-0 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-Gold sm:text-sm sm:leading-6 bg-transparent"
//       />
//     </div>
//   </div>
// );
