import React, { useEffect, useState } from "react";
import { FaStar, FaQuoteRight } from "react-icons/fa";
import { motion } from "framer-motion";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

// Add these CSS variables at the top of your component
const accentGold = "#F59E0B"; // Amber-500

const ReviewSection = ({ title, subtitle, data, onReviewSubmit }) => {
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: "",
    name: "",
  });

  const [centerSlidePercentage, setCenterSlidePercentage] = useState(45); // Default for small screens

  useEffect(() => {
    // Adjust slides displayed based on screen size
    const updateSlidePercentage = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth >= 1024) {
        // Large screens (show 3 cards)
        setCenterSlidePercentage(33.33);
      } else if (screenWidth >= 768) {
        // Medium screens (show 2 cards)
        setCenterSlidePercentage(50);
      } else {
        // Small screens (show 1 card)
        setCenterSlidePercentage(100);
      }
    };

    updateSlidePercentage(); // Initial update
    window.addEventListener("resize", updateSlidePercentage); // Update on resize

    return () => {
      window.removeEventListener("resize", updateSlidePercentage); // Cleanup
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onReviewSubmit(newReview);
    setNewReview({ rating: 0, comment: "", name: "" });
  };

  return (
    <div className="min-h-screen py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16 max-w-4xl mx-auto"
      >
        <h2 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-amber-500 to-purple-600 mb-4">
          {title}
        </h2>
        <p className="text-xl text-gray-300">{subtitle}</p>
      </motion.div>

      {/* Reviews Carousel */}
      <div className="max-w-[1920px] mx-auto mb-20">
        <Carousel
          showArrows={false}
          infiniteLoop={true}
          showThumbs={false}
          showStatus={false}
          autoPlay={true}
          interval={5000}
          emulateTouch={true}
          showIndicators={false}
          centerMode={true}
          centerSlidePercentage={centerSlidePercentage}
        >
          {data.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-4 h-full"
            >
              <div className="bg-gradient-to-br from-slate-900/90 to-purple-900/20 p-8 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 mx-auto relative overflow-hidden border border-amber-500/20 backdrop-blur-xl min-h-[400px] flex flex-col">
                {/* Decorative elements remain the same */}
                <div className="absolute top-0 right-0 w-full h-2 bg-gradient-to-r from-amber-400 to-purple-600" />
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-amber-500/10 to-purple-600/10 rounded-bl-full opacity-50 -z-10" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-600/10 to-amber-500/10 rounded-tr-full opacity-50 -z-10" />

                <div className="flex-none">
                  <FaQuoteRight className="text-amber-400 text-4xl mb-6" />
                  <div className="flex items-center justify-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg rotate-3 hover:rotate-0 transition-all duration-300">
                      {review.name[0]}
                    </div>
                    <div className="ml-4 text-left">
                      <h3 className="font-bold text-2xl bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                        {review.name}
                      </h3>
                      <div className="flex gap-1 mt-2">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className="transition-colors duration-200"
                            color={i < review.rating ? accentGold : "#1F2937"}
                            size={20}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-grow flex items-center">
                  <p className="text-lg leading-relaxed text-gray-300 line-clamp-6 overflow-hidden">
                    &quot;{review.comment}&quot;
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </Carousel>
      </div>

      {/* Updated Add New Review Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-900/90 to-purple-900/20 p-10 rounded-2xl shadow-xl max-w-2xl mx-auto relative overflow-hidden border border-amber-500/20 backdrop-blur-xl"
      >
        <div className="absolute top-0 right-0 w-full h-2 bg-gradient-to-r from-amber-400 to-purple-600" />

        <h3 className="text-3xl font-bold bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent mb-8">
          Share Your Experience
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-medium text-amber-300 mb-2">
              Name
            </label>
            <input
              type="text"
              value={newReview.name}
              onChange={(e) =>
                setNewReview({ ...newReview, name: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/5 border border-amber-500/20 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-300 text-white"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-amber-300 mb-2">
              Rating
            </label>
            <div className="flex gap-3 bg-white/5 p-4 rounded-xl border border-amber-500/20">
              {[...Array(5)].map((_, index) => (
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  key={index}
                  onClick={() =>
                    setNewReview({ ...newReview, rating: index + 1 })
                  }
                  className="focus:outline-none"
                >
                  <FaStar
                    color={index < newReview.rating ? accentGold : "#4B5563"}
                    size={32}
                  />
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-medium text-amber-300 mb-2">
              Your Review
            </label>
            <textarea
              value={newReview.comment}
              onChange={(e) =>
                setNewReview({ ...newReview, comment: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/5 border border-amber-500/20 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-300 h-32 resize-none text-white"
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-gradient-to-r from-amber-400 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-amber-500/25 border border-amber-500/20"
          >
            Submit Review
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default ReviewSection;
