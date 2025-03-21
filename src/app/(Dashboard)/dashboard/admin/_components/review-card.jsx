"use client";

import {
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  StarIcon,
} from "@heroicons/react/20/solid";
import Link from "next/link";
import React, { useState } from "react";
import { BsStarHalf } from "react-icons/bs";

const ReviewCard = ({ title, reviews, type, pageLink }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasReviews = reviews && reviews.length > 0;
  const previewReview = hasReviews ? reviews[0] : null;

  return (
    <div className="shadow-lg border border-white/20 bg-gradient-to-br from-[#1a1a1a]/80 to-[#2a2a2a]/80 backdrop-blur-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-gold/10">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-all duration-300"
      >
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold bg-gradient-to-r from-Gold to-amber-300 bg-clip-text text-transparent">
            {title}
          </h2>
          <span className="text-sm px-3 py-1 bg-white/10 rounded-full">
            {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
          </span>
        </div>
        {isExpanded ? (
          <ChevronUpIcon className="w-6 h-6 text-gold" />
        ) : (
          <ChevronDownIcon className="w-6 h-6 text-gold" />
        )}
      </button>

      {!isExpanded && hasReviews && (
        <div className="space-y-3 p-4 border-t border-white/10">
          <div className="border-white/10 border bg-gradient-to-br from-white/5 to-white/10 rounded-xl p-4 hover:from-white/10 hover:to-white/15 transition-all duration-300">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1">
                {[...Array(Math.floor(previewReview.rating))].map((_, i) => (
                  <StarIcon key={i} className="w-5 h-5 text-amber-400" />
                ))}
                {previewReview.rating % 1 !== 0 && (
                  <BsStarHalf className="w-5 h-5 text-amber-400" />
                )}
              </div>
              <span className="text-sm font-medium bg-white/10 px-2 py-0.5 rounded-full">
                {previewReview.rating}
              </span>
            </div>
            <p className="mb-3 leading-relaxed line-clamp-2 text-gray-200">
              {previewReview.comment}
            </p>
          </div>
        </div>
      )}

      {!isExpanded && !hasReviews && (
        <div className="px-6 pb-6 border-t border-white/10">
          <div className="pt-6 text-center">
            <p className="mb-4 text-gray-300">No reviews yet</p>
            <Link
              href={pageLink}
              className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-full text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-amber-500/25"
            >
              Write a Review
            </Link>
          </div>
        </div>
      )}

      {isExpanded && (
        <div className="space-y-4 p-4 border-t border-white/10">
          {hasReviews ? (
            reviews.map((review) => (
              <div
                key={review.id}
                className="border-white/10 border bg-gradient-to-br from-white/5 to-white/10 rounded-xl p-4 hover:from-white/10 hover:to-white/15 transition-all duration-300"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    {[...Array(Math.floor(review.rating))].map((_, i) => (
                      <StarIcon key={i} className="w-5 h-5 text-amber-400" />
                    ))}
                    {review.rating % 1 !== 0 && (
                      <BsStarHalf className="w-5 h-5 text-amber-400" />
                    )}
                  </div>
                  <span className="text-sm font-medium bg-white/10 px-2 py-0.5 rounded-full">
                    {review.rating}
                  </span>
                </div>
                <p className="mb-3 leading-relaxed text-gray-200">
                  {review.comment}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">{review.date}</span>
                  {review.link && (
                    <Link
                      href={review.link}
                      className="inline-flex items-center gap-1 bg-white/10 text-sm px-4 py-2 rounded-full hover:bg-white/15 transition-all duration-300"
                    >
                      View{" "}
                      {type === "products"
                        ? review.productName
                        : review.skillmasterName}
                      <ChevronRightIcon className="h-5 w-5" />
                    </Link>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center">
              <p className="mb-4 text-gray-300">No reviews yet</p>
              <Link
                href={pageLink}
                className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-full text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-amber-500/25"
              >
                Write a Review
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
