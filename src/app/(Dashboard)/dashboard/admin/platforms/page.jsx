"use client";

import { useEffect, useMemo, useState } from "react";
import { BiLoader, BiPencil, BiPlus } from "react-icons/bi";
import toast from "react-hot-toast";
import { IoWarning } from "react-icons/io5";

import { fetchPlatforms } from "@/lib/actions/platforms-action";
import { PlatformDialog } from "../_components/PlatformDialog";

// Helper function to highlight matching terms
const highlightMatch = (text, searchTerm) => {
  if (!searchTerm) return text; // If no search term, return the original text
  const regex = new RegExp(`(${searchTerm})`, "gi"); // Case-insensitive match
  const parts = text.split(regex); // Split the text into matching and non-matching parts

  return parts.map((part, index) =>
    regex.test(part) ? <mark key={index}>{part}</mark> : part
  );
};

const PlatformsPage = () => {
  const [platforms, setPlatforms] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [dialogData, setDialogData] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

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
        // sort to newest first
        const sortedPlatforms = result.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        setPlatforms(sortedPlatforms);
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

  // Helper function: Normalize strings (remove extra spaces and convert to lowercase)
  const normalize = (str) => str?.toLowerCase().replace(/\s+/g, "").trim();

  // Filter and search logic
  const filteredPlatforms = useMemo(() => {
    const term = normalize(searchTerm);

    return platforms?.filter((platform) => {
      return (
        !term ||
        normalize(platform.name).includes(term) ||
        normalize(String(platform.id)).includes(term)
      );
    });
  }, [platforms, searchTerm]);

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

      {!loading && !error && platforms?.length < 1 ? (
        <p className="text-center w-full">No platform have been added yet!</p>
      ) : (
        platforms?.length > 0 && (
          <>
            <div className="flex flex-wrap items-center gap-4">
              <input
                type="text"
                autoFocus
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search users..."
                className="flex-1 min-w-fit p-2 rounded-lg bg-white/10 border border-white/10 hover:border-white/20"
              />
            </div>

            <div className="flex flex-wrap gap-4 justify-between items-center">
              {!loading && !error && platforms?.length < 1 ? (
                <p className="text-center w-full">
                  No platform have been added yet!
                </p>
              ) : (
                filteredPlatforms?.map((platform, index) => (
                  <button
                    key={index}
                    onClick={() => editPlatform(platform)}
                    className="flex justify-between items-end flex-1 min-w-fit flex-wrap-reverse rounded-lg p-2 px-4 bg-gray-500/20 hover:bg-gray-500/30"
                  >
                    <div className="space-y-2 text-start">
                      <p className="text-lg font-semibold break-all">
                        {highlightMatch(platform.name, searchTerm)}
                      </p>

                      {platform.has_sub_platforms && (
                        <p className="text-xs font-semibold border border-white/10 rounded-lg px-2 py-1 w-fit">
                          Sub platform
                        </p>
                      )}

                      <p className="text-xs font-semibold">
                        Created at:{" "}
                        {new Date(platform.created_at).toLocaleString()}
                      </p>
                    </div>
                    <BiPencil className="h-8 w-8 ml-2 hover:bg-white/10 rounded-lg p-2" />
                  </button>
                ))
              )}
            </div>
          </>
        )
      )}

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
