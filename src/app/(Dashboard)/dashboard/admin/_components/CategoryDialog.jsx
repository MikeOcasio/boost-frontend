"use client";

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Field,
  Input,
  Label,
  Switch,
  Textarea,
} from "@headlessui/react";
import clsx from "clsx";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoClose, IoCopy } from "react-icons/io5";

import { addCategory, deleteCategory, updateCategory } from "@/lib/actions";
import { BiLoader, BiTrash } from "react-icons/bi";

export const CategoryDialog = ({
  dialogData,
  dialogOpen,
  onClose,
  loadCategories,
}) => {
  const [category, setCategory] = useState(dialogData || getDefaultCategory());
  const [loading, setLoading] = useState(false);

  function getDefaultCategory() {
    return {
      name: "",
      description: "",
      is_active: true,
    };
  }

  // Effect to update the local state when dialogData changes (e.g., opening dialog for edit)
  useEffect(() => {
    if (dialogData) {
      setCategory(dialogData);
    } else {
      setCategory(getDefaultCategory());
    }
  }, [dialogData]);

  // Function to check if the category data is unchanged
  const isDataUnchanged = () => {
    return (
      category.name === dialogData?.name &&
      category.description === dialogData?.description &&
      category.is_active === dialogData?.is_active
    );
  };

  const handleSubmit = async (categoryData) => {
    if (categoryData.id && isDataUnchanged()) {
      toast.error("No changes were made.");
      return;
    }

    setLoading(true);
    try {
      if (categoryData.id) {
        // Update existing category
        const response = await updateCategory(categoryData);

        if (response.error) {
          toast.error(response.error);
        } else {
          toast.success("Category updated successfully!");
        }
      } else {
        // Add new category
        const response = await addCategory(categoryData);

        if (response.error) {
          toast.error(response.error);
        } else {
          toast.success("Category added successfully!");
        }
      }

      handleClosed();
    } catch (error) {
      console.log("Error submitting category:", error.message);
      toast.error(error.message);
    } finally {
      loadCategories();
      setLoading(false);
    }
  };

  const handleDelete = async (categoryId) => {
    if (!categoryId) return;

    const confirmed = confirm(
      "Are you sure you want to delete this category? This action cannot be undone."
    );

    if (!confirmed) return;

    setLoading(true);
    try {
      const response = await deleteCategory(categoryId);

      if (response.error) {
        // toast.error(response.error);
        toast.error("Error deleting category!");
      } else {
        toast.success("Category deleted successfully!");
        handleClosed();
      }
    } catch (error) {
      console.log("Error deleting category:", error.message);
      toast.error(error.message);
    } finally {
      loadCategories();
      setLoading(false);
    }
  };

  const handleClosed = () => {
    onClose();
    setCategory(dialogData || getDefaultCategory());
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
            {dialogData ? "Update Game Category" : "Add New Game Category"}
          </DialogTitle>

          <div className="flex flex-col gap-4">
            {/* id */}
            {category.id && (
              <button
                onClick={(e) => {
                  navigator.clipboard.writeText(category.id);

                  toast.success("Copied to clipboard!");
                }}
                className="flex gap-2 items-center rounded-lg bg-black/30 px-2 py-1 hover:bg-black/40 w-fit"
              >
                <span className="text-sm font-semibold break-all">
                  ID: {category.id}
                </span>
                <IoCopy className="h-8 w-8 ml-2 p-2 hover:bg-white/10 rounded-lg" />
              </button>
            )}

            {/* Category Name Field */}
            <Field className="flex flex-col gap-1 w-full">
              <Label className="text-sm">Category Name</Label>
              <Input
                type="text"
                placeholder="Game category name"
                autoFocus
                className={clsx(
                  "rounded-lg border-none bg-white/10 py-1.5 px-3",
                  "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
                )}
                value={category.name}
                onChange={(e) =>
                  setCategory({ ...category, name: e.target.value })
                }
              />
            </Field>

            {/* Category Description Field */}
            <Field className="flex flex-col gap-1 w-full">
              <Label className="text-sm">Category Description</Label>
              <Textarea
                placeholder="Category Description"
                className={clsx(
                  "rounded-lg border-none bg-white/10 py-1.5 px-3",
                  "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
                )}
                rows={3}
                value={category.description}
                onChange={(e) =>
                  setCategory({ ...category, description: e.target.value })
                }
              />
            </Field>

            {/* Active Status Switch */}
            <div className="flex items-center gap-4 rounded-lg flex-1">
              <p>Is Active</p>
              <Switch
                checked={category.is_active}
                onChange={(checked) =>
                  setCategory({ ...category, is_active: checked })
                }
                className="group relative flex h-7 min-w-14 w-14 cursor-pointer rounded-full bg-white/10 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-Gold/80"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-white ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
                />
              </Switch>
            </div>

            <div className="flex items-center justify-between gap-4">
              {/* Delete Button */}
              {dialogData && (
                <button
                  onClick={() => handleDelete(category.id)}
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
                onClick={() => handleSubmit(category)}
                disabled={loading || !category.name.trim() || isDataUnchanged()} // Disable if loading, name is empty, or category is unchanged
                className={clsx(
                  "bg-Gold/80 p-2 rounded-lg hover:bg-Gold/60 disabled:bg-gray-500/20 flex-1",
                  {
                    "cursor-not-allowed":
                      loading || !category.name.trim() || isDataUnchanged(),
                  }
                )}
              >
                {loading
                  ? "Submitting..."
                  : dialogData
                  ? "Update Category"
                  : "Add Category"}
              </button>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
