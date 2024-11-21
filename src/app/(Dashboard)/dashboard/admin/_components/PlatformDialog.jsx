"use client";

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Field,
  Input,
  Label,
  Switch,
} from "@headlessui/react";
import clsx from "clsx";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoClose, IoCopy } from "react-icons/io5";
import { BiLoader, BiPlus, BiTrash } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx";

import {
  addPlatform,
  addSubplatform,
  deletePlatform,
  deleteSubplatform,
  enableSubplatform,
  fetchSubplatforms,
  updatePlatform,
  updateSubplatform,
} from "@/lib/actions/platforms-action";

export const PlatformDialog = ({
  dialogData,
  dialogOpen,
  onClose,
  loadPlatforms,
}) => {
  const [platform, setPlatform] = useState(dialogData || getDefaultPlatform());
  const [loading, setLoading] = useState(false);
  const [subplatforms, setSubplatforms] = useState([]);

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
      // } catch (error) {
      //   console.log("Error submitting platform:", error.message);
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
      // console.log("Error deleting platform:", error.message);
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

  const handleEnableSubplatform = async (checked) => {
    if (!platform?.id) {
      toast.error("Something went wrong. Please try again!");
      return;
    }

    const confirmed = confirm(
      platform?.has_sub_platforms
        ? "Are you sure you want to enable the subplatforms?"
        : "Are you sure you want to enable the subplatforms?"
    );

    if (!confirmed) return;

    try {
      setLoading(true);
      const response = await enableSubplatform({
        id: platform.id,
        has_sub_platforms: checked,
      });

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success(
          `Subplatform ${
            platform.has_sub_platforms ? "disabled" : "enabled"
          } successfully!`
        );
      }
    } catch (error) {
      // console.log("Error enabling subplatform:", error.message);

      toast.error(error.message);
    } finally {
      loadPlatforms();
      handleClosed();
      setLoading(false);
    }
  };

  const getSubplatforms = useCallback(async () => {
    if (!platform?.id || !platform?.has_sub_platforms) return;

    setLoading(true);
    try {
      const response = await fetchSubplatforms(platform.id);

      if (response.error) {
        toast.error(response.error);
      } else {
        setSubplatforms(response);
      }
    } catch (error) {
      // console.log("Error fetching subplatforms:", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [platform?.has_sub_platforms, platform?.id]);

  useEffect(() => {
    getSubplatforms();
  }, [getSubplatforms]);

  const handleAddSubplatform = async (subplatform) => {
    if (
      !subplatform.name.trim() ||
      !platform?.id ||
      !platform?.has_sub_platforms
    ) {
      toast.error("Please enter a name for the subplatform.");
      return;
    }

    try {
      setLoading(true);

      const response = await addSubplatform(subplatform, platform.id);

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Subplatform added successfully!");
      }
    } catch (error) {
      // console.log("Error adding subplatform:", error.message);
      toast.error(error.message);
    } finally {
      getSubplatforms();
      setLoading(false);
    }
  };

  const handleDeleteSubplatform = async (platformId, subPlatformId) => {
    if (!platformId || !subPlatformId || !platform?.has_sub_platforms) {
      toast.error("Something went wrong. Please try again!");
      return;
    }

    try {
      setLoading(true);
      const response = await deleteSubplatform(platformId, subPlatformId);

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Subplatform deleted successfully!");
      }
    } catch (error) {
      // console.log("Error deleting subplatform:", error.message);
      toast.error(error.message);
    } finally {
      getSubplatforms();
      setLoading(false);
    }
  };

  const handleUpdateSubplatform = async (subplatform) => {
    if (
      !subplatform.name.trim() ||
      !subplatform.id ||
      !platform?.id ||
      !platform?.has_sub_platforms
    ) {
      toast.error("Please enter a name for the subplatform.");
      return;
    }

    try {
      setLoading(true);

      const response = await updateSubplatform(subplatform, platform.id);

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Subplatform updated successfully!");
      }
    } catch (error) {
      // console.log("Error updating subplatform:", error.message);
      toast.error(error.message);
    } finally {
      getSubplatforms();
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={dialogOpen}
      onClose={onClose}
      as="div"
      className="relative z-50 text-white"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-xl rounded-lg bg-Plum/50 backdrop-blur-lg p-6 space-y-4 relative">
          <button
            type="button"
            onClick={handleClosed}
            className="rounded-lg hover:bg-white/10 absolute right-0 top-0 m-4"
          >
            <IoClose className="h-8 w-8" />
          </button>

          <DialogTitle className="text-lg font-semibold">
            {dialogData ? "Update platform" : "Add New platform"}
          </DialogTitle>

          <div className="flex flex-col gap-4 overflow-y-auto max-h-[80vh] no-scrollbar">
            {/* id */}
            {platform.id && (
              <button
                type="button"
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

            <form className="flex flex-col gap-4">
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

              {/* subplatform switch */}
              <div className="flex items-center justify-between gap-4">
                <p>
                  {!platform.has_sub_platforms
                    ? "Enable Subplatforms"
                    : "Disable Subplatforms"}
                </p>
                <Switch
                  type="button"
                  checked={platform.has_sub_platforms}
                  onChange={(checked) => handleEnableSubplatform(checked)}
                  className="group relative flex h-7 min-w-14 w-14 cursor-pointer rounded-full bg-white/10 p-1 transition-colors duration-200 ease-in-out data-[checked]:bg-Gold"
                >
                  <span className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-white shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7" />
                </Switch>
              </div>

              {platform.has_sub_platforms && (
                <>
                  {/* divider */}
                  <div className="h-px w-full bg-white/10" />
                  <div className="flex flex-wrap gap-4 justify-between items-center">
                    <p>Add Subplatform</p>
                    {/* add more subplatform */}
                    <button
                      type="button"
                      onClick={() =>
                        setSubplatforms([
                          { id: null, name: "" },
                          ...subplatforms,
                        ])
                      }
                      className="p-2 rounded-lg hover:bg-white/10 flex gap-2 items-center border border-white/10 w-fit"
                    >
                      <BiPlus className="h-5 w-5" />
                      Add {subplatforms.length > 0 ? "more" : "new"}
                    </button>
                  </div>

                  {/* subplatforms with updatable fields with delete button and tick icon */}
                  {subplatforms?.map((subplatform, index) => (
                    <div
                      key={index}
                      className="flex flex-col gap-4 w-full bg-black/20 hover:bg-black/30 p-4 rounded-lg border border-white/10 hover:border-white/20"
                    >
                      <Field className="flex flex-col gap-1 w-full">
                        <Label className="text-sm">Subplatform Name</Label>
                        <Input
                          type="text"
                          placeholder="Subplatform name"
                          className="input-field"
                          value={subplatform.name}
                          onChange={(e) =>
                            setSubplatforms([
                              ...subplatforms.slice(0, index),
                              {
                                ...subplatform,
                                name: e.target.value,
                              },
                              ...subplatforms.slice(index + 1),
                            ])
                          }
                        />
                      </Field>

                      <div className="flex items-center justify-between gap-4">
                        {/* Delete Button */}
                        {subplatform.id ? (
                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteSubplatform(
                                platform.id,
                                subplatform.id
                              )
                            }
                            disabled={loading}
                            className="p-2 rounded-lg hover:bg-white/10 disabled:bg-gray-500/20"
                          >
                            {loading ? (
                              <BiLoader className="h-5 w-5 animate-spin" />
                            ) : (
                              <BiTrash className="h-5 w-5 text-red-600" />
                            )}
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              setSubplatforms(
                                subplatforms.filter((_, i) => i !== index)
                              )
                            }
                            className="p-2 rounded-lg hover:bg-white/10 disabled:bg-gray-500/20 border border-white/10 hover:border-white/20"
                          >
                            {loading ? (
                              <BiLoader className="h-5 w-5 animate-spin" />
                            ) : (
                              <RxCross2 className="h-5 w-5 " />
                            )}
                          </button>
                        )}

                        {/* Submit Button */}
                        <button
                          type="button"
                          onClick={() =>
                            subplatform.id
                              ? handleUpdateSubplatform(subplatform)
                              : handleAddSubplatform(subplatform)
                          }
                          disabled={loading || !subplatform.name.trim()}
                          className={clsx(
                            "bg-Gold/80 p-2 rounded-lg hover:bg-Gold/60 disabled:bg-gray-500/20 flex-1",
                            {
                              "cursor-not-allowed":
                                loading || !subplatform.name.trim(),
                            }
                          )}
                        >
                          {loading
                            ? "Submitting..."
                            : subplatform.id
                            ? "Update subplatform"
                            : "Add subplatform"}
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}

              <div className="flex items-center justify-between gap-4">
                {/* Delete Button */}
                {dialogData && (
                  <button
                    type="button"
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
                  type="submit"
                  onClick={() => handleSubmit(platform)}
                  disabled={
                    loading || !platform.name.trim() || isDataUnchanged()
                  }
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
            </form>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
