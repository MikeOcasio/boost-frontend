import { Akronim } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "react-hot-toast";

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ravenboost.com",
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
      className={`antialiased ${akronim.variable}`}
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
            zIndex={1600}
          />
          <Toaster position="bottom-right" reverseOrder={false} />

          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
