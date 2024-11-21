"use client";

import { useEffect, useMemo, useState } from "react";
import { BiLoader, BiPencil, BiPlus } from "react-icons/bi";
import toast from "react-hot-toast";
import { IoWarning } from "react-icons/io5";

import { fetchAttribute } from "@/lib/actions/attributes-action";
import { AttributeDialog } from "../_components/AttributeDialog";

// Helper function to highlight matching terms
const highlightMatch = (text, searchTerm) => {
  if (!searchTerm) return text; // If no search term, return the original text
  const regex = new RegExp(`(${searchTerm})`, "gi"); // Case-insensitive match
  const parts = text.split(regex); // Split the text into matching and non-matching parts

  return parts.map((part, index) =>
    regex.test(part) ? <mark key={index}>{part}</mark> : part
  );
};

const ProductAttributePage = () => {
  const [attribute, setAttribute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [dialogData, setDialogData] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  // Fetch attribute from API
  const loadAttribute = async () => {
    setLoading(true);
    setError(false);

    try {
      const result = await fetchAttribute();
      if (result.error) {
        setError(true);
        toast.error(result.error);
      } else {
        // sort to newest first
        const sortedAttributes = result.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setAttribute(sortedAttributes);
      }
    } catch (e) {
      setError(true);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttribute();
  }, []);

  // Open dialog for new attribute
  const newAttribute = () => {
    setDialogData(null);
    setDialogOpen(true);
  };

  // Open dialog to edit an existing attribute
  const editAttribute = (attribute) => {
    setDialogData(attribute);
    setDialogOpen(true);
  };

  // Helper function: Normalize strings (remove extra spaces and convert to lowercase)
  const normalize = (str) => str?.toLowerCase().replace(/\s+/g, "").trim();

  // Filter and search logic
  const filteredAttributes = useMemo(() => {
    const term = normalize(searchTerm);

    return attribute?.filter((attribute) => {
      return (
        !term ||
        normalize(attribute.name).includes(term) ||
        normalize(String(attribute.id)).includes(term)
      );
    });
  }, [attribute, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <h1 className="text-xl font-semibold">
          All Product attribute ({attribute?.length})
        </h1>

        <button
          onClick={newAttribute}
          disabled={loading}
          className="bg-Gold/60 hover:bg-Gold/80 border border-black rounded-lg p-2 flex items-center justify-center gap-2 w-fit mt-6 backdrop-blur-sm disabled:bg-gray-500/20"
        >
          <BiPlus className="h-5 w-5" />
          New Attribute
        </button>
      </div>

      {loading && <BiLoader className="h-8 w-8 animate-spin mx-auto" />}

      {error && (
        <p className="w-fit bg-red-500/50 p-4 rounded-lg mx-auto flex items-center justify-center gap-2">
          <IoWarning className="h-5 w-5 mr-2" />
          Failed to load attribute. Please try again!
          {/* reload */}
          <button
            onClick={loadAttribute}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
          >
            Reload
          </button>
        </p>
      )}

      {!loading && !error && attribute?.length < 1 ? (
        <p className="text-center w-full">No attribute have been added yet!</p>
      ) : (
        attribute?.length > 0 && (
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
              {!loading && !error && attribute?.length < 1 ? (
                <p className="text-center w-full">
                  No attribute have been added yet!
                </p>
              ) : (
                filteredAttributes?.map((attribute, index) => (
                  <button
                    key={index}
                    onClick={() => editAttribute(attribute)}
                    className="flex justify-between items-end flex-1 min-w-fit flex-wrap-reverse rounded-lg p-2 px-4 bg-gray-500/20 hover:bg-gray-500/30"
                  >
                    <div className="space-y-2 text-start">
                      <p className="text-lg font-semibold break-all">
                        {highlightMatch(attribute.name, searchTerm)}
                      </p>

                      {/* created at */}
                      <p className="text-xs font-semibold">
                        Created at:{" "}
                        {attribute.created_at
                          ? new Intl.DateTimeFormat("en-US", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            }).format(new Date(attribute.created_at))
                          : "Not set"}
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
      <AttributeDialog
        dialogData={dialogData}
        dialogOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        loadAttributes={loadAttribute}
      />
    </div>
  );
};

export default ProductAttributePage;
