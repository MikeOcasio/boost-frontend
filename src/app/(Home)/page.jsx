"use client";

import Image from "next/image";

import { ContactForm } from "@/components/home/ContactForm";
import HomePageAboutArea from "@/components/home/HomePageAboutArea";
import { HomeGameCarousel } from "@/components/home/HomeGameCarousel";
import { useEffect, useState } from "react";
import { fetchAllGames } from "@/lib/actions/products-action";
import { BiLoader } from "react-icons/bi";
import { IoWarning } from "react-icons/io5";
import toast from "react-hot-toast";
import BackgroundPattern from "@/components/background-pattern";
import ReviewSection from "@/components/review-section";

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const loadGames = async () => {
    setLoading(true);
    setError(false);

    try {
      const result = await fetchAllGames({ page: 1 });
      if (result.error) {
        setError(true);
        toast.error(result.error);
      } else {
        const popularGames = result?.products?.filter(
          (game) => game.is_active && game.most_popular
        );

        setData(popularGames);
      }
    } catch (error) {
      setError(true);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGames();
  }, []);

  const reviews = [
    {
      name: "Alex Thompson",
      comment:
        "Raven Boost transformed my gaming experience! I went from struggling in ranked matches to confidently climbing the ladder. Their boosters are not just skilled, they're also great teachers who shared valuable tips along the way.",
      rating: 5,
    },
    {
      name: "Sarah Chen",
      comment:
        "As a working parent with limited gaming time, Raven Boost helped me achieve my gaming goals without the endless grind. Professional, fast, and most importantly, they kept my account completely secure.",
      rating: 5,
    },
    {
      name: "Marcus Rodriguez",
      comment:
        "Initially skeptical about boosting services, but Raven Boost changed my mind completely. Their communication was transparent, progress updates were regular, and the results exceeded my expectations. Worth every penny!",
      rating: 5,
    },
    {
      name: "Emily Parker",
      comment:
        "What sets Raven Boost apart is their attention to detail. They didn't just help me reach my desired rank - they ensured I learned better gameplay strategies along the way. Now I can maintain my rank with confidence!",
      rating: 5,
    },
  ];

  return (
    <div className="mt-10 text-white overflow-x-clip">
      <div className="h-screen w-full">
        <BackgroundPattern />

        <div className="flex min-h-[85%] flex-col items-center justify-center">
          <Image
            src="/home-hero.png"
            height={1920}
            width={1080}
            quality={100}
            priority
            alt="group of video game characters"
            className="2xl:h-[70vh] h-fit w-full object-contain drop-shadow-[0_30px_5px_rgba(0,0,0,0.5)] hidden md:block"
          />
          <Image
            src="/rb-home-minimal.png"
            height={1920}
            width={1080}
            quality={100}
            priority
            alt="group of video game characters"
            className="h-full scale-150 w-full object-contain drop-shadow-[0_30px_5px_rgba(0,0,0,0.5)] md:hidden"
          />

          <div className="px-4">
            <p className="mx-auto font-title max-w-4xl text-center lg:!text-2xl !text-lg font-medium !tracking-tighter !leading-10">
              Boost Your Game, Your Way! Choose your dream team and leave the
              rest to us.
            </p>
          </div>
        </div>
      </div>

      <div className="h-screen w-full sticky top-0 -z-10"></div>

      <div className="mx-auto px-4 lg:max-w-[1920px] -mt-[110vh]">
        {loading && <BiLoader className="h-8 w-8 animate-spin mx-auto" />}

        {error && (
          <p className="w-fit bg-red-500/50 p-4 rounded-lg mx-auto flex items-center justify-center gap-2">
            <IoWarning className="h-5 w-5 mr-2" />
            Failed to load products. Please try again!
            <button onClick={loadGames} className="bg-white/10 p-2 rounded-lg">
              Reload
            </button>
          </p>
        )}

        {!loading && !error && data?.length > 0 && (
          <HomeGameCarousel data={data} />
        )}
      </div>

      <HomePageAboutArea />

      <ReviewSection
        type="home"
        title="What Our Customers Say"
        subtitle="Read trusted reviews from our customers"
        data={reviews}
        onReviewSubmit={() => {}}
      />

      <ContactForm />
    </div>
  );
}
