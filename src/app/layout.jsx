import NextTopLoader from "nextjs-toploader";
import { Toaster } from "react-hot-toast";
import { Press_Start_2P } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const press_start_2P = Press_Start_2P({
  weight: "400",
  variable: "--font-press_start_2P",
  subsets: ["latin"],
});

export const metadata = {
  title: "RavenBoost",
  description:
    "Boost Your Game, Your Way! Choose your dream team and leave the rest to us.",
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.ravenboost.com",
    title: "RavenBoost",
    description:
      "Boost Your Game, Your Way! Choose your dream team and leave the rest to us.",
    images: [
      {
        url: "/meta-home.png",
        width: 1200,
        height: 630,
        alt: "RavenBoost",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RavenBoost",
    description:
      "Boost Your Game, Your Way! Choose your dream team and leave the rest to us.",
    images: [
      {
        url: "/meta-home.png",
        width: 1200,
        height: 630,
        alt: "RavenBoost",
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${press_start_2P.variable} font-play antialiased`}
      suppressHydrationWarning
    >
      <body className="bg-RussianViolet">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <NextTopLoader
            color="#C28D04"
            initialPosition={0.2}
            crawlSpeed={200}
            crawl={true}
            showSpinner={false}
            easing="ease"
            speed={200}
            shadow="0 0 10px #C28D04,0 0 5px #C28D04"
            zIndex={999999}
          />
          <Toaster position="bottom-right" reverseOrder={false} />

          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
