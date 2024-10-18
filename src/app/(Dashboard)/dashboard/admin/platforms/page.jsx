"use client";

import { useEffect, useState } from "react";
import { BiLoader, BiPencil, BiPlus } from "react-icons/bi";
import toast from "react-hot-toast";
import { IoWarning } from "react-icons/io5";

import { fetchPlatforms } from "@/lib/actions/platforms-action";
import { PlatformDialog } from "../_components/PlatformDialog";

const PlatformsPage = () => {
  const [platforms, setPlatforms] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [dialogData, setDialogData] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Fetch platforms from API
  const loadPlatforms = async () => {
    setLoading(true);
    setError(false);

    try {
      const result = await fetchPlatforms();

      if (result.error) {
        setError(true);
        toast.error(result.error);
      } else {
        setPlatforms(result);
      }
    } catch (e) {
      setError(true);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlatforms();
  }, []);

  const newPlatform = () => {
    setDialogData(null);
    setDialogOpen(true);
  };

  const editPlatform = (platform) => {
    setDialogData(platform);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <h1 className="text-xl font-semibold">All Platforms</h1>

        <button
          onClick={newPlatform}
          disabled={loading}
          className="bg-Gold/60 hover:bg-Gold/80 border border-black rounded-lg p-2 flex items-center justify-center gap-2 w-fit mt-6 backdrop-blur-sm disabled:bg-gray-500/20"
        >
          <BiPlus className="h-5 w-5" />
          New Platform
        </button>
      </div>

      {loading && <BiLoader className="h-8 w-8 animate-spin mx-auto" />}

      {error && (
        <p className="w-fit bg-red-500/50 p-4 rounded-lg mx-auto flex items-center justify-center gap-2">
          <IoWarning className="h-5 w-5 mr-2" />
          Failed to load platforms. Please try again!
        </p>
      )}

      <div className="flex flex-wrap gap-4 justify-between items-center">
        {platforms?.length < 1 ? (
          <p className="text-center w-full">No platform have been added yet!</p>
        ) : (
          !loading &&
          !error &&
          platforms?.map((platform, index) => (
            <button
              key={index}
              onClick={() => editPlatform(platform)}
              className="flex justify-between items-center flex-1 min-w-fit flex-wrap-reverse rounded-lg p-2 px-4 bg-gray-500/20 hover:bg-gray-500/30"
            >
              <p className="text-lg font-semibold break-all">{platform.name}</p>
              <BiPencil className="h-8 w-8 ml-2 hover:bg-white/10 rounded-lg p-2" />
            </button>
          ))
        )}
      </div>

      {/* Dialog Component */}
      <PlatformDialog
        dialogData={dialogData}
        dialogOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        loadPlatforms={loadPlatforms}
      />
    </div>
  );
};

export default PlatformsPage;
