"use client";

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Field,
  Input,
  Label,
} from "@headlessui/react";
import clsx from "clsx";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoClose, IoCopy } from "react-icons/io5";

import { addPlatform, deletePlatform, updatePlatform } from "@/lib/actions";
import { BiLoader, BiTrash } from "react-icons/bi";

export const PlatformDialog = ({
  dialogData,
  dialogOpen,
  onClose,
  loadPlatforms,
}) => {
  const [platform, setPlatform] = useState(dialogData || getDefaultPlatform());
  const [loading, setLoading] = useState(false);

  function getDefaultPlatform() {
    return { name: "" };
  }

  // Effect to update the local state when dialogData changes (e.g., opening dialog for edit)
  useEffect(() => {
    if (dialogData) {
      setPlatform(dialogData);
    } else {
      setPlatform(getDefaultPlatform());
    }
  }, [dialogData]);

  const isDataUnchanged = () => {
    return platform.name === dialogData?.name;
  };

  const handleSubmit = async (platformData) => {
    if (platformData.id && isDataUnchanged()) {
      toast.error("No changes were made.");
      return;
    }

    setLoading(true);
    try {
      if (platformData.id) {
        // Update existing platform
        const response = await updatePlatform(platformData);

        if (response.error) {
          toast.error(response.error);
        } else {
          toast.success("Platform updated successfully!");
        }
      } else {
        // Add new platform
        const response = await addPlatform(platformData);

        if (response.error) {
          toast.error(response.error);
        } else {
          toast.success("Platform added successfully!");
        }
      }

      handleClosed();
    } catch (error) {
      console.log("Error submitting platform:", error.message);
      toast.error(error.message);
    } finally {
      loadPlatforms();
      setLoading(false);
    }
  };

  const handleDelete = async (platformId) => {
    if (!platformId) return;

    const confirmed = confirm(
      "Are you sure you want to delete this platform? This action cannot be undone."
    );

    if (!confirmed) return;

    setLoading(true);
    try {
      const response = await deletePlatform(platformId);

      if (response.error) {
        // toast.error(response.error);
        toast.error("Error deleting platform!");
      } else {
        toast.success("Platform deleted successfully!");
        handleClosed();
      }
    } catch (error) {
      console.log("Error deleting platform:", error.message);
      toast.error(error.message);
    } finally {
      loadPlatforms();
      setLoading(false);
    }
  };

  const handleClosed = () => {
    onClose();
    setPlatform(dialogData || getDefaultPlatform());
  };

  return (
    <Dialog
      open={dialogOpen}
      onClose={onClose}
      as="div"
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md rounded-lg bg-Plum/50 backdrop-blur-lg p-6 space-y-4 relative">
          <button
            onClick={handleClosed}
            className="rounded-lg hover:bg-white/10 absolute right-0 top-0 m-4"
          >
            <IoClose className="h-8 w-8" />
          </button>

          <DialogTitle className="text-lg font-semibold">
            {dialogData ? "Update platform" : "Add New platform"}
          </DialogTitle>

          <div className="flex flex-col gap-4">
            {/* id */}
            {platform.id && (
              <button
                onClick={(e) => {
                  navigator.clipboard.writeText(platform.id);

                  toast.success("Copied to clipboard!");
                }}
                className="flex gap-2 items-center rounded-lg bg-black/30 px-2 py-1 hover:bg-black/40 w-fit"
              >
                <span className="text-sm font-semibold break-all">
                  ID: {platform.id}
                </span>
                <IoCopy className="h-8 w-8 ml-2 p-2 hover:bg-white/10 rounded-lg" />
              </button>
            )}

            {/* platform Name Field */}
            <Field className="flex flex-col gap-1 w-full">
              <Label className="text-sm">Platform Name</Label>
              <Input
                type="text"
                placeholder="Game platform name"
                autoFocus
                className="input-field"
                value={platform.name}
                onChange={(e) =>
                  setPlatform({ ...platform, name: e.target.value })
                }
              />
            </Field>

            <div className="flex items-center justify-between gap-4">
              {/* Delete Button */}

              {dialogData && (
                <button
                  onClick={() => handleDelete(platform.id)}
                  disabled={loading}
                  className="p-2 rounded-lg hover:bg-white/10 disabled:bg-gray-500/20"
                >
                  {loading ? (
                    <BiLoader className="h-5 w-5 animate-spin" />
                  ) : (
                    <BiTrash className="h-5 w-5 text-red-600" />
                  )}
                </button>
              )}

              {/* Submit Button */}
              <button
                onClick={() => handleSubmit(platform)}
                disabled={loading || !platform.name.trim() || isDataUnchanged()}
                className={clsx(
                  "bg-Gold/80 p-2 rounded-lg hover:bg-Gold/60 disabled:bg-gray-500/20 flex-1",
                  {
                    "cursor-not-allowed":
                      loading || !platform.name.trim() || isDataUnchanged(),
                  }
                )}
              >
                {loading
                  ? "Submitting..."
                  : dialogData
                  ? "Update platform"
                  : "Add platform"}
              </button>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
