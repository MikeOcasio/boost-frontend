import Link from "next/link";

import { BiLogoTiktok } from "react-icons/bi";
import { BsDiscord, BsInstagram, BsTwitterX } from "react-icons/bs";

function SocialLink({ icon: Icon, ...props }) {
  return (
    <Link className="group -m-1 p-1" {...props}>
      <Icon className="h-6 w-6 fill-white transition group-hover:fill-zinc-400" />
    </Link>
  );
}

export function Footer() {
  return (
    <footer className="z-10 p-4 backdrop-blur-xl text-white space-y-2">
      <div className="flex flex-wrap w-full items-center justify-center md:justify-between bg-gradient-to-r from-Plum/20 to-Gold/20 border border-white/10 p-4 px-6 backdrop-blur-xl gap-4 rounded-xl">
        <div className="flex flex-wrap gap-6">
          <h2 className="font-bold">Follow Us</h2>
          <SocialLink
            href="https://x.com/RavenBoost_"
            aria-label="Follow on X"
            target="_blank"
            icon={BsTwitterX}
          />
          <SocialLink
            href="https://www.instagram.com/raven.boost?igsh=YTQwZjQ0NmI0OA%3D%3D&utm_source=qr"
            aria-label="Follow on Instagram"
            target="_blank"
            icon={BsInstagram}
          />
          <SocialLink
            href="https://www.tiktok.com/@raven.boost?_t=8pqqPZh07h9&_r=1"
            target="_blank"
            aria-label="Follow on Tiktok"
            icon={BiLogoTiktok}
          />
        </div>

        <Link
          href="https://discord.gg/Wr9n9EynKQ"
          target="_blank"
          className="flex flex-wrap gap-2 text-sm rounded-full px-4 py-2 border-2 border-white/10 hover:bg-white/10 transition-all"
        >
          <BsDiscord className="h-6 w-6 fill-white transition group-hover:fill-zinc-400" />

          <span className="break-all text-white">support</span>
        </Link>
      </div>
      <div className="w-full flex flex-wrap gap-2 text-sm items-center justify-between md:px-4">
        <div className="flex flex-wrap">
          <Link
            href="/terms"
            className="text-sm text-white/50 hover:text-white transition-all hover:bg-white/10 rounded-md px-2"
          >
            Terms & conditions
          </Link>

          <Link
            href="/skillmaster-application"
            className="text-sm text-white/50 hover:text-white transition-all hover:bg-white/10 rounded-md px-2"
          >
            Skillmaster Application
          </Link>
        </div>

        <Link
          href="/"
          className="text-sm text-white/50 hover:text-white transition-all"
        >
          © www.ravenboost.com - All rights reserved.
        </Link>
      </div>
    </footer>
  );
}
