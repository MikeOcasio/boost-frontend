"use client";

import { fetchAllSkillmasterApplications } from "@/lib/actions/skillmasters-action";
import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { BiLoader, BiPencil } from "react-icons/bi";
import { IoWarning } from "react-icons/io5";
import { SkillmasterApplicationDialog } from "../_components/SkillmasterApplicationDialog";

// Helper function to highlight matching terms
const highlightMatch = (text, searchTerm) => {
  if (!searchTerm) return text; // If no search term, return the original text
  const regex = new RegExp(`(${searchTerm})`, "gi"); // Case-insensitive match
  const parts = text.split(regex); // Split the text into matching and non-matching parts

  return parts.map((part, index) =>
    regex.test(part) ? <mark key={index}>{part}</mark> : part
  );
};

const AdminSkillmasterApplication = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [dialogData, setDialogData] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const loadApplications = async () => {
    setLoading(true);
    setError(false);

    try {
      const response = await fetchAllSkillmasterApplications();

      if (response.error) {
        setError(true);
        toast.error(result.error);
      } else {
        // sort applications by created_at
        const sortedApplications = response.data.sort((a, b) => {
          return new Date(b.created_at) - new Date(a.created_at);
        });

        setApplications(sortedApplications);
      }
    } catch (error) {
      console.error("Failed to load applications:", error);
      toast.error("Failed to load applications. Please try again!");
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  // Helper function: Normalize strings (remove extra spaces and convert to lowercase)
  const normalize = (str) => str?.toLowerCase().replace(/\s+/g, "").trim();

  // Filter and search logic
  const filteredApplications = useMemo(() => {
    const term = normalize(searchTerm);

    return applications?.filter((application) => {
      return (
        !term ||
        normalize(application.gamer_tag).includes(term) ||
        normalize(application.reasons).includes(term) ||
        normalize(String(application.id)).includes(term) ||
        normalize(String(application.user_id)).includes(term) ||
        normalize(application.status).includes(term)
      );
    });
  }, [applications, searchTerm]);

  const editApplication = (application) => {
    setDialogData(application);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <h1 className="text-xl font-semibold">All skillmasters applications</h1>
      </div>

      {loading && <BiLoader className="h-8 w-8 animate-spin mx-auto" />}

      {error && (
        <p className="w-fit bg-red-500/50 p-4 rounded-lg mx-auto flex items-center justify-center gap-2">
          <IoWarning className="h-5 w-5 mr-2" />
          Failed to load Applications. Please try again!
        </p>
      )}

      {!loading && !error && applications?.length < 1 ? (
        <p className="text-center w-full">
          No applications have been added yet!
        </p>
      ) : (
        applications?.length > 0 && (
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
              {!loading && !error && applications?.length < 1 ? (
                <p className="text-center w-full">
                  No applications have been added yet!
                </p>
              ) : (
                filteredApplications?.map((app, index) => (
                  <button
                    key={index}
                    onClick={() => editApplication(app)}
                    className="flex justify-between items-end flex-1 min-w-fit flex-wrap-reverse rounded-lg p-2 px-4 bg-gray-500/20 hover:bg-gray-500/30"
                  >
                    <div className="space-y-2 text-start">
                      <p className="text-lg font-semibold break-all">
                        {highlightMatch(app.gamer_tag, searchTerm)}
                      </p>

                      <p className="text-xs font-semibold">
                        Status: {app.status}
                      </p>

                      <p className="text-xs font-semibold">
                        User ID: {app.user_id}
                      </p>

                      <p className="text-xs font-semibold"></p>

                      {/* created at */}
                      <p className="text-xs font-semibold">
                        Created at: {new Date(app.created_at).toLocaleString()}
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
      <SkillmasterApplicationDialog
        dialogData={dialogData}
        dialogOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        loadApplications={loadApplications}
      />
    </div>
  );
};

export default AdminSkillmasterApplication;
