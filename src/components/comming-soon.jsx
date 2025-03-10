import React from "react";

const ComingSoon = () => {
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold mb-4">Coming Soon!</h1>
        <p className="text-gray-600 text-lg mb-6">
          We&apos;re working hard to bring you something amazing.
        </p>
        <div className="text-yellow-600 text-xl">🚧 Under Construction 🚧</div>
      </div>
    </div>
  );
};

export default ComingSoon;
