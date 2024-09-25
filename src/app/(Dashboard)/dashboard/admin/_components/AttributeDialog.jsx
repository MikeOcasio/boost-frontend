import { addAttribute } from "@/lib/actions";
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
import { IoClose } from "react-icons/io5";

export const AttributeDialog = ({ dialogData, dialogOpen, onClose }) => {
  const [attribute, setAttribute] = useState(
    dialogData || getDefaultAttribute()
  );
  const [loading, setLoading] = useState(false);

  function getDefaultAttribute() {
    return {
      name: "",
    };
  }

  // Effect to update the local state when dialogData changes (e.g., opening dialog for edit)
  useEffect(() => {
    if (dialogData) {
      setAttribute(dialogData);
    } else {
      setAttribute(getDefaultAttribute());
    }
  }, [dialogData]);

  const handleSubmit = async (attributeData) => {
    setLoading(true);
    try {
      if (attributeData.id) {
        // Update existing attribute
        // const response = await updateAttribute(attributeData);

        // if (response.error) {
        //   toast.error(response.error);
        // } else {
        //   toast.success("attribute updated successfully!");
        // }

        toast.error("Not implemented yet");
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
      console.error("Error submitting attribute:", error);
      toast.error("Failed to submit attribute.");
    } finally {
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
            {dialogData
              ? "Update product attribute"
              : "Add New product attribute"}
          </DialogTitle>

          <div className="flex flex-col gap-4">
            {/* attribute Name Field */}
            <Field className="flex flex-col gap-1 w-full">
              <Label className="text-sm">Attribute Name</Label>
              <Input
                type="text"
                placeholder="Game attribute name"
                autoFocus
                className={clsx(
                  "rounded-lg border-none bg-white/10 py-1.5 px-3",
                  "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
                )}
                value={attribute.name}
                onChange={(e) =>
                  setAttribute({ ...attribute, name: e.target.value })
                }
              />
            </Field>

            {/* Submit Button */}
            <button
              onClick={() => handleSubmit(attribute)}
              disabled={loading || !attribute.name.trim()} // Disable if loading or name is empty
              className={clsx(
                "bg-Gold/80 p-2 rounded-lg hover:bg-Gold/60 disabled:bg-gray-500/20",
                { "cursor-not-allowed": loading || !attribute.name.trim() }
              )}
            >
              {loading
                ? "Submitting..."
                : dialogData
                ? "Update attribute"
                : "Add attribute"}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
