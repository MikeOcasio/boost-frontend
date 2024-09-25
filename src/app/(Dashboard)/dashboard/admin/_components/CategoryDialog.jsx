import { addCategory } from "@/lib/actions";
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
import { IoClose } from "react-icons/io5";

export const CategoryDialog = ({ dialogData, dialogOpen, onClose }) => {
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

  const handleSubmit = async (categoryData) => {
    setLoading(true);
    try {
      if (categoryData.id) {
        // Update existing category
        // const response = await updateCategory(categoryData);

        // if (response.error) {
        //   toast.error(response.error);
        // } else {
        //   toast.success("Category updated successfully!");
        // }

        toast.error("Not implemented yet");
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
      console.error("Error submitting category:", error);
      toast.error("Failed to submit category.");
    } finally {
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

            {/* Submit Button */}
            <button
              onClick={() => handleSubmit(category)}
              disabled={loading || !category.name.trim()} // Disable if loading or name is empty
              className={clsx(
                "bg-Gold/80 p-2 rounded-lg hover:bg-Gold/60 disabled:bg-gray-500/20",
                { "cursor-not-allowed": loading || !category.name.trim() }
              )}
            >
              {loading
                ? "Submitting..."
                : dialogData
                ? "Update Category"
                : "Add Category"}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
