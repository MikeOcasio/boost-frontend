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
import { BiLoader, BiTrash } from "react-icons/bi";
import { IoClose, IoCopy } from "react-icons/io5";

import {
  createPromotion,
  deletePromotion,
  updatePromotion,
} from "@/lib/actions/promotions-action";

export const PromotionDialog = ({
  dialogData,
  dialogOpen,
  onClose,
  loadPromotions,
}) => {
  const [promotion, setPromotion] = useState(dialogData || defaultPromotion());
  const [loading, setLoading] = useState(false);

  function defaultPromotion() {
    return {
      code: "",
      start_date: "",
      end_date: "",
      discount: 10,
    };
  }

  useEffect(() => {
    if (dialogData) {
      setPromotion(dialogData);
    } else {
      setPromotion(defaultPromotion());
    }
  }, [dialogData]);

  const handleClosed = () => {
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      if (promotion.id) {
        const response = await updatePromotion(promotion);

        if (response.error) {
          toast.error(response.error);
        } else {
          toast.success("Promotion updated successfully");
          handleClosed();
        }
      } else {
        const response = await createPromotion(promotion);

        if (response.error) {
          toast.error(response.error);
        } else {
          toast.success("Promotion created successfully");
          handleClosed();
        }
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      loadPromotions();
      setLoading(false);
    }
  };

  const handleDelete = async (promotionId) => {
    if (!promotionId) return;

    const confirm = window.confirm(
      "Are you sure you want to delete this promotion? This action cannot be undone."
    );

    if (!confirm) return;

    setLoading(true);

    try {
      const response = await deletePromotion(promotionId);

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Promotion deleted successfully");
        handleClosed();
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      loadPromotions();
      setLoading(false);
    }
  };
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);

    // Convert to a format that datetime-local input expects
    return date.toISOString().slice(0, 16);
  };

  const handleDateChange = (field, value) => {
    const localDate = new Date(value); // User's local time input
    const utcDate = new Date(localDate.toISOString()); // Convert to UTC
    setPromotion({ ...promotion, [field]: utcDate });
  };

  if (!promotion) return null;

  return (
    <Dialog
      open={dialogOpen}
      onClose={handleClosed}
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
            Update Promotion
          </DialogTitle>

          <div className="flex flex-col gap-4 overflow-y-auto max-h-[80vh] no-scrollbar">
            {/* id */}
            {promotion?.id && (
              <button
                type="button"
                onClick={(e) => {
                  navigator.clipboard.writeText(promotion.id);

                  toast.success("Copied to clipboard!");
                }}
                className="flex gap-2 items-center rounded-lg bg-black/30 px-2 py-1 hover:bg-black/40 w-fit"
              >
                <span className="text-sm font-semibold break-all">
                  ID: {promotion.id}
                </span>
                <IoCopy className="h-8 w-8 ml-2 p-2 hover:bg-white/10 rounded-lg" />
              </button>
            )}

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 w-full"
            >
              {/* code */}
              <Field className="flex flex-col gap-1 w-full">
                <Label>Code</Label>
                <Input
                  type="text"
                  placeholder="Promotion code"
                  value={promotion?.code || ""}
                  className="input-field"
                  onChange={(e) =>
                    setPromotion({ ...promotion, code: e.target.value })
                  }
                />
              </Field>

              {/* discount_percentage */}
              <Field className="flex flex-col gap-1 w-full">
                <Label>Discount Percentage Range (0 to 100)</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  placeholder="Discount percentage"
                  value={promotion?.discount_percentage || ""}
                  className="input-field"
                  onChange={(e) =>
                    setPromotion({
                      ...promotion,
                      discount_percentage: e.target.value,
                    })
                  }
                />
              </Field>

              {/* start_date */}
              <Field className="flex flex-col gap-1 w-full">
                <Label>Start Date</Label>
                <Input
                  type="datetime-local"
                  placeholder="Start Date"
                  className="input-field"
                  value={
                    promotion?.start_date
                      ? formatDateForInput(promotion.start_date)
                      : ""
                  }
                  onChange={(e) =>
                    handleDateChange("start_date", e.target.value)
                  }
                />
              </Field>

              {/* end_date */}
              <Field className="flex flex-col gap-1 w-full">
                <Label>End Date</Label>
                <Input
                  type="datetime-local"
                  placeholder="End Date"
                  className="input-field"
                  value={
                    promotion?.end_date
                      ? formatDateForInput(promotion.end_date)
                      : ""
                  }
                  onChange={(e) => handleDateChange("end_date", e.target.value)}
                />
              </Field>

              {/* created at */}
              <p className="text-xs font-semibold">
                Created at: {new Date(promotion.created_at).toLocaleString()}
              </p>

              <div className="flex items-center justify-between gap-4">
                {/* Delete Button */}
                {dialogData && (
                  <button
                    type="button"
                    onClick={() => handleDelete(promotion.id)}
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
                  disabled={loading}
                  className={clsx(
                    "bg-Gold/80 p-2 rounded-lg hover:bg-Gold/60 disabled:bg-gray-500/20 flex-1",
                    {
                      "cursor-not-allowed": loading,
                    }
                  )}
                >
                  {loading
                    ? "Submitting..."
                    : dialogData
                    ? "Update Promotion"
                    : "Add Promotion"}
                </button>
              </div>
            </form>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
