import { Providers } from "@/app/providers";
import { Akronim } from "next/font/google";
import NextTopLoader from "nextjs-toploader";

import "@/styles/tailwind.css";
import { Toaster } from "react-hot-toast";

const akronim = Akronim({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-akronim",
});

export const metadata = {
  title: "RavenBoost",
  description:
    "Boost Your Game, Your Way! Choose your dream team and leave the rest to us.",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`antialiased ${akronim.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-RussianViolet">
        <Providers>
          <NextTopLoader
            color="#C28D04"
            initialPosition={0.2}
            crawlSpeed={200}
            crawl={true}
            showSpinner={false}
            easing="ease"
            speed={200}
            shadow="0 0 10px #C28D04,0 0 5px #C28D04"
            zIndex={1600}
          />
          <Toaster position="bottom-right" reverseOrder={false} />

          {children}
        </Providers>
      </body>
    </html>
  );
}
