import Link from "next/link";
import { InstagramIcon, XIcon } from "@/components/SocialIcons";

import { BiLogoTiktok } from "react-icons/bi";

function SocialLink({ icon: Icon, ...props }) {
  return (
    <Link className="group -m-1 p-1" {...props}>
      <Icon className="h-6 w-6 fill-white transition group-hover:fill-zinc-400" />
    </Link>
  );
}

export function Footer() {
  return (
    <footer className="z-10 p-4 backdrop-blur-xl">
      <div className="flex flex-wrap w-full items-center justify-center md:justify-between bg-gradient-to-r from-Plum/50 to-Gold/50 p-6 backdrop-blur-xl gap-4 rounded-xl">
        <div className="flex flex-wrap gap-6">
          <h2 className="font-bold">Follow Us</h2>
          <SocialLink
            href="https://x.com/RavenBoost_"
            aria-label="Follow on X"
            target="_blank"
            icon={XIcon}
          />
          <SocialLink
            href="https://www.instagram.com/raven.boost?igsh=YTQwZjQ0NmI0OA%3D%3D&utm_source=qr"
            aria-label="Follow on Instagram"
            target="_blank"
            icon={InstagramIcon}
          />
          <SocialLink
            href="https://www.tiktok.com/@raven.boost?_t=8pqqPZh07h9&_r=1"
            target="_blank"
            aria-label="Follow on Tiktok"
            icon={BiLogoTiktok}
          />
        </div>

        <Link href="mailto:support@ravenboost.com">
          <span className="break-all italic text-white underline">
            support@ravenboost.com
          </span>
        </Link>
      </div>
    </footer>
  );
}
