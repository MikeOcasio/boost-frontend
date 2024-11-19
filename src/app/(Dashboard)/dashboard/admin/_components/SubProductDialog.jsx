"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import clsx from "clsx";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { EditGame } from "./EditGame";
import { addGame } from "@/lib/actions/products-action";
import toast from "react-hot-toast";

export const SubProductDialog = ({
  dialogData,
  dialogOpen,
  onClose,
  fetchGame,
}) => {
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(false);
  const [missingFields, setMissingFields] = useState([]);

  const validateGame = () => {
    const errors = [];

    if (!game?.name) errors.push("Product name is missing");
    if (!game?.description) errors.push("Product description is missing");
    if (!game?.category_id) errors.push("Product category is missing");
    if (!game?.prod_attr_cats?.length)
      errors.push("Select at least one attribute");
    if (game?.is_priority === null) errors.push("Product priority is missing");
    if (!game?.platform_ids?.length) errors.push("At least one platform");
    if (game?.is_active === null)
      errors.push("Product active status is missing");
    if (game?.most_popular === null)
      errors.push("Most popular status is missing");
    if (!game?.tag_line) errors.push("Product tag line is empty");
    if (!game?.primary_color) errors.push("Primary color is missing");
    if (!game?.secondary_color) errors.push("Secondary color is missing");

    if (game?.features?.length === 0) {
      errors.push("At least one product feature");
    }
    if (game?.features?.length) {
      game.features.forEach((feature, index) => {
        if (!feature) errors.push(`Feature ${index + 1} is empty`);
      });
    }

    // dropdown and slider are not required but if they are present, they must have at least one option also the values must be valid not empty
    if (game?.dropdown && !game?.dropdown_options?.length) {
      errors.push("At least one dropdown option");
    }
    if (game?.dropdown && game?.dropdown_options?.length) {
      game.dropdown_options.forEach((option, index) => {
        if (!option.option)
          errors.push(`Dropdown option ${index + 1} is empty`);
        if (!option.price)
          errors.push(`Dropdown option ${index + 1} has no price`);
      });
    }

    if (game?.slider && !game?.slider_range?.length) {
      errors.push("At least one slider option");
    }
    if (game?.slider && game?.slider_range?.length) {
      game.slider_range.forEach((range, index) => {
        if (!range.min_quantity)
          errors.push(`Slider option ${index + 1} has no min quantity`);
        if (!range.max_quantity)
          errors.push(`Slider option ${index + 1} has no max quantity`);
        if (!range.price)
          errors.push(`Slider option ${index + 1} has no price`);
      });
    }

    setMissingFields(errors);
    return errors.length === 0; // Return true if no errors
  };

  const handleCreateGame = async () => {
    if (!validateGame()) return;

    // show warning if there is no price and tax
    if (!game?.price && !game?.tax) {
      const confirmed = confirm(
        "Are you sure you want to create this product without a price and tax? Recommended for folders/warper only."
      );

      if (!confirmed) return;
    }

    // stingfy dropdown and slider ranges object and make the array of stringified objects
    const dropdownOptions = game?.dropdown_options?.map((option) => {
      return JSON.stringify(option);
    });
    const sliderRanges = game?.slider_range?.map((range) => {
      return JSON.stringify(range);
    });

    setLoading(true);
    try {
      const response = await addGame({
        ...game,
        parent_id: dialogData?.id,
        dropdown_options: dropdownOptions,
        slider_range: sliderRanges,
      });

      if (response.error) {
        toast.error(JSON.stringify(response.error));
      } else {
        toast.success("Game added successfully!");

        setGame(null);
        onClose();
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
      fetchGame();
    }
  };

  const handleClosed = () => {
    if (game) {
      // confirm dialog
      const confirmed = confirm(
        "Are you sure you want to close? The data is not saved."
      );

      if (!confirmed) return;
    }

    setGame(null);
    onClose();
  };

  return (
    <Dialog
      open={dialogOpen}
      onClose={handleClosed}
      as="div"
      className="relative z-50 text-white"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-6xl rounded-lg bg-Plum/50 backdrop-blur-lg p-6 space-y-4 relative">
          <button
            onClick={handleClosed}
            className="rounded-lg hover:bg-white/10 absolute right-0 top-0 m-4"
          >
            <IoClose className="h-8 w-8" />
          </button>

          <DialogTitle className="text-lg font-semibold">
            Add Sub Product
          </DialogTitle>

          <div className="flex flex-col gap-4 overflow-y-auto max-h-[80vh]">
            {/* Submit Button */}
            <button
              onClick={handleCreateGame}
              disabled={loading}
              className={clsx(
                "bg-Gold/80 p-2 rounded-lg hover:bg-Gold/60 disabled:bg-gray-500/20 flex-1 w-full disabled:gray-500/20",
                {
                  "cursor-not-allowed": loading,
                }
              )}
            >
              {loading ? "Submitting..." : "Add Sub Product"}
            </button>

            {/* Render missing fields below the form */}
            {missingFields.length > 0 && (
              <div className="bg-red-100/10 text-red-600 p-4 rounded-lg">
                <h2 className="font-semibold">
                  Please fill the following fields:
                </h2>
                <ul className="list-disc list-inside">
                  {missingFields.map((field, index) => (
                    <li key={index}>{field}</li>
                  ))}
                </ul>
              </div>
            )}

            <EditGame
              data={game}
              setData={setGame}
              isSubProduct={true}
              parentData={dialogData}
            />
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
