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
import { BiLoader, BiTrash } from "react-icons/bi";
import Image from "next/image";
import { BiUpload } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";

import {
  addCategory,
  deleteCategory,
  updateCategory,
} from "@/lib/actions/categories-actions";

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
      image: null,
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
      category.is_active === dialogData?.is_active &&
      category.image === dialogData?.image
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
          toast.error(JSON.stringify(response.error));
        } else {
          toast.success("Category updated successfully!");
        }
      } else {
        // Add new category
        const response = await addCategory(categoryData);

        if (response.error) {
          toast.error(JSON.stringify(response.error));
        } else {
          toast.success("Category added successfully!");
        }
      }

      handleClosed();
    } catch (error) {
      // console.log("Error submitting category:", error.message);
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
      // console.log("Error deleting category:", error.message);
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
      className="relative z-50 text-white"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-2xl rounded-2xl border-white/10 border bg-Plum/50 backdrop-blur-lg p-6 space-y-4 relative">
          <button
            onClick={handleClosed}
            className="rounded-lg hover:bg-white/10 absolute right-0 top-0 m-4"
          >
            <IoClose className="h-8 w-8" />
          </button>

          <DialogTitle className="text-lg font-semibold">
            {dialogData ? "Update Game Category" : "Add New Game Category"}
          </DialogTitle>

          <div className="flex flex-col gap-4 overflow-y-auto max-h-[80vh] no-scrollbar">
            {/* id */}
            {category.id && (
              <button
                onClick={() => {
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
                className="input-field"
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
                className="input-field"
                rows={3}
                value={category.description}
                onChange={(e) =>
                  setCategory({ ...category, description: e.target.value })
                }
              />
            </Field>

            {/* Category Image Field */}
            <Field className="flex flex-col gap-1 w-full bg-white/10 p-4 rounded-lg border border-white/10 hover:border-white/20">
              <Label className="text-sm">Category Image</Label>
              <div className="flex flex-wrap gap-4 flex-1">
                {category?.image && (
                  <div className="group relative cursor-pointer">
                    <Image
                      src={category.image}
                      alt="Category image"
                      width={200}
                      height={200}
                      priority
                      className="rounded-lg bg-white/10 p-2"
                    />
                    <IoMdClose
                      className="h-8 w-8 group-hover:opacity-100 opacity-0 absolute top-0 right-0 p-2 m-2 hover:bg-black rounded-lg border border-white/10 bg-black/80"
                      onClick={() => setCategory({ ...category, image: null })}
                    />
                  </div>
                )}
                <div className="flex flex-col gap-2 flex-1 min-w-fit">
                  <label
                    htmlFor="category-image"
                    className="relative flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-800/10 border-gray-600 hover:border-gray-500"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <BiUpload className="h-8 w-8 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        Click or drag and drop your image here
                      </p>
                    </div>
                    <input
                      id="category-image"
                      type="file"
                      accept="image/*"
                      className="absolute border h-full w-full opacity-0"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setCategory({
                              ...category,
                              image: reader.result,
                            });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
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

            {/* created at */}
            {category.created_at && (
              <p className="text-xs font-semibold">
                Created at:{" "}
                {category.created_at
                  ? new Intl.DateTimeFormat("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(new Date(category.created_at))
                  : "Not set"}
              </p>
            )}

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
