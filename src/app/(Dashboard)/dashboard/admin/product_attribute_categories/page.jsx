"use client";

import { useEffect, useState } from "react";
import { BiLoader, BiPencil, BiPlus } from "react-icons/bi";
import toast from "react-hot-toast";
import { IoWarning } from "react-icons/io5";
import clsx from "clsx";
import { fetchAttribute } from "@/lib/actions";
import { AttributeDialog } from "../_components/AttributeDialog";

const ProductAttributePage = () => {
  const [attribute, setAttribute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [dialogData, setDialogData] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

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
        setAttribute(result);
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

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <h1 className="text-xl font-semibold">All Product attribute</h1>

        <button
          onClick={newAttribute}
          disabled={loading}
          className="bg-Gold/60 hover:bg-Gold/80 border border-black rounded-lg p-2 flex items-center justify-center gap-2 w-fit mt-6 backdrop-blur-sm disabled:bg-gray-500/20"
        >
          {loading ? (
            <BiLoader className="h-5 w-5 animate-spin" />
          ) : (
            <BiPlus className="h-5 w-5" />
          )}
          New Attribute
        </button>
      </div>

      {loading && (
        <div className="flex justify-center items-center w-full">
          <BiLoader className="h-8 w-8 animate-spin" />
        </div>
      )}
      {error && (
        <p className="w-fit bg-red-500/50 p-4 rounded-lg mx-auto flex items-center justify-center gap-2">
          <IoWarning className="h-5 w-5 mr-2" />
          Failed to load attribute. Please try again!
        </p>
      )}

      <div className="flex flex-wrap gap-4 justify-between items-center">
        {attribute?.length < 1 ? (
          <p className="text-center w-full">
            No attribute have been added yet!
          </p>
        ) : (
          !loading &&
          !error &&
          attribute?.map((attribute, index) => (
            <button
              key={index}
              onClick={() => editAttribute(attribute)}
              className="flex justify-between items-center flex-1 min-w-fit flex-wrap rounded-lg p-2 px-4 bg-gray-500/20 hover:bg-gray-500/30"
            >
              <div className="flex flex-wrap gap-4 items-center">
                <p className="text-lg font-semibold">{attribute.name}</p>
                {attribute.description && <p>{attribute.description}</p>}
                <p
                  className={clsx(
                    "text-xs font-semibold px-2 rounded-full",
                    attribute.is_active ? "bg-green-500" : "bg-gray-500"
                  )}
                >
                  {attribute.is_active ? "Active" : "Inactive"}
                </p>
              </div>
              <BiPencil className="h-8 w-8 ml-2 hover:bg-white/10 rounded-lg p-2" />
            </button>
          ))
        )}
      </div>

      {/* Dialog Component */}
      <AttributeDialog
        dialogData={dialogData}
        dialogOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </div>
  );
};

export default ProductAttributePage;
