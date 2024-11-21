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

import {
  addAttribute,
  deleteAttribute,
  updateAttribute,
} from "@/lib/actions/attributes-action";
import { BiLoader, BiTrash } from "react-icons/bi";

export const AttributeDialog = ({
  dialogData,
  dialogOpen,
  onClose,
  loadAttributes,
}) => {
  const [attribute, setAttribute] = useState(
    dialogData || getDefaultAttribute()
  );
  const [loading, setLoading] = useState(false);

  function getDefaultAttribute() {
    return { name: "" };
  }

  // Effect to update the local state when dialogData changes (e.g., opening dialog for edit)
  useEffect(() => {
    if (dialogData) {
      setAttribute(dialogData);
    } else {
      setAttribute(getDefaultAttribute());
    }
  }, [dialogData]);

  const isDataUnchanged = () => {
    return attribute.name === dialogData?.name;
  };

  const handleSubmit = async (attributeData) => {
    if (attributeData.id && isDataUnchanged()) {
      toast.error("No changes were made.");
      return;
    }

    setLoading(true);
    try {
      if (attributeData.id) {
        // Update existing attribute
        const response = await updateAttribute(attributeData);

        if (response.error) {
          toast.error(response.error);
        } else {
          toast.success("Attribute updated successfully!");
        }
      } else {
        // Add new attribute
        const response = await addAttribute(attributeData);

        if (response.error) {
          toast.error(response.error);
        } else {
          toast.success("Product attribute added successfully!");
        }
      }

      handleClosed();
    } catch (error) {
      // console.log("Error submitting attribute:", error.message);
      toast.error(error.message);
    } finally {
      loadAttributes();
      setLoading(false);
    }
  };

  const handleDelete = async (attributeId) => {
    if (!attributeId) return;

    const confirmed = confirm(
      "Are you sure you want to delete this attribute? This action cannot be undone."
    );

    if (!confirmed) return;

    setLoading(true);
    try {
      const response = await deleteAttribute(attributeId);

      if (response.error) {
        // toast.error(response.error);
        toast.error("Error deleting attribute!");
      } else {
        toast.success("Attribute deleted successfully!");
        handleClosed();
      }
    } catch (error) {
      // console.log("Error deleting attribute:", error.message);
      toast.error(error.message);
    } finally {
      loadAttributes();
      setLoading(false);
    }
  };

  const handleClosed = () => {
    onClose();
    setAttribute(dialogData || getDefaultAttribute());
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
        <DialogPanel className="w-full max-w-md rounded-lg bg-Plum/50 backdrop-blur-lg p-6 space-y-4 relative">
          <button
            onClick={handleClosed}
            className="rounded-lg hover:bg-white/10 absolute right-0 top-0 m-4"
          >
            <IoClose className="h-8 w-8" />
          </button>

          <DialogTitle className="text-lg font-semibold">
            {dialogData
              ? "Update product attribute"
              : "Add New product attribute"}
          </DialogTitle>

          <div className="flex flex-col gap-4 overflow-y-auto max-h-[80vh] no-scrollbar">
            {/* id */}
            {attribute.id && (
              <button
                onClick={(e) => {
                  navigator.clipboard.writeText(attribute.id);

                  toast.success("Copied to clipboard!");
                }}
                className="flex gap-2 items-center rounded-lg bg-black/30 px-2 py-1 hover:bg-black/40 w-fit"
              >
                <span className="text-sm font-semibold break-all">
                  ID: {attribute.id}
                </span>
                <IoCopy className="h-8 w-8 ml-2 p-2 hover:bg-white/10 rounded-lg" />
              </button>
            )}

            {/* attribute Name Field */}
            <Field className="flex flex-col gap-1 w-full">
              <Label className="text-sm">Attribute Name</Label>
              <Input
                type="text"
                placeholder="Game attribute name"
                autoFocus
                className="input-field"
                value={attribute.name}
                onChange={(e) =>
                  setAttribute({ ...attribute, name: e.target.value })
                }
              />
            </Field>

            <div className="flex items-center justify-between gap-4">
              {/* Delete Button */}

              {dialogData && (
                <button
                  onClick={() => handleDelete(attribute.id)}
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
                onClick={() => handleSubmit(attribute)}
                disabled={
                  loading || !attribute.name.trim() || isDataUnchanged()
                } // Disable if loading, name is empty, or attribute is unchanged
                className={clsx(
                  "bg-Gold/80 p-2 rounded-lg hover:bg-Gold/60 disabled:bg-gray-500/20 flex-1",
                  {
                    "cursor-not-allowed":
                      loading || !attribute.name.trim() || isDataUnchanged(),
                  }
                )}
              >
                {loading
                  ? "Submitting..."
                  : dialogData
                  ? "Update attribute"
                  : "Add attribute"}
              </button>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
