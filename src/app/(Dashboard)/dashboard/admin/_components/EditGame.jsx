"use client";

import {
  Field,
  Input,
  Label,
  Select,
  Switch,
  Textarea,
} from "@headlessui/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiChevronDown, BiLoader, BiTrash, BiUpload } from "react-icons/bi";
import { IoCopy } from "react-icons/io5";
import { IoMdAdd, IoMdRemove, IoMdClose } from "react-icons/io";
import { GrPowerReset } from "react-icons/gr";
import { useRouter } from "next/navigation";

import { Button } from "@/components/Button";
import { deleteGame } from "@/lib/actions/products-action";
import { fetchCategories } from "@/lib/actions/categories-actions";
import { fetchAttribute } from "@/lib/actions/attributes-action";
import { fetchPlatforms } from "@/lib/actions/platforms-action";

export const EditGame = ({ data, setData }) => {
  const router = useRouter();

  const [initialValues, setInitialValues] = useState(data || getDefaultGame());
  const [game, setGame] = useState(data || getDefaultGame());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [attribute, setAttribute] = useState([]);
  const [platforms, setPlatforms] = useState([]);

  function getDefaultGame() {
    return {
      name: "",
      description: "",
      price: null,
      image: null,
      is_priority: false,
      tax: null,
      is_active: true,
      most_popular: false,
      tag_line: "",
      bg_image: null,
      primary_color: null,
      secondary_color: null,
      features: [""],
      category_id: null,
      platform_ids: [],
      remove_image: "false",
      remove_bg_image: "false",
      prod_attr_cats: [],
      prod_attr_cat_ids: [],
    };
  }

  useEffect(() => {
    setData(game);
  }, [game, setData]);

  const loadCategories = async () => {
    try {
      const result = await fetchCategories();
      if (result.error) {
        throw new Error(result.error);
      }
      setCategories(result);
    } catch (error) {
      setError("Failed to load categories");
    }
  };

  const loadAttribute = async () => {
    try {
      const result = await fetchAttribute();
      if (result.error) {
        throw new Error(result.error);
      }
      setAttribute(result);
    } catch (error) {
      setError("Failed to load attributes");
    }
  };

  const loadPlatforms = async () => {
    try {
      const result = await fetchPlatforms();
      if (result.error) {
        throw new Error(result.error);
      }
      setPlatforms(result);
    } catch (error) {
      setError("Failed to load platforms");
    }
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);
    await Promise.all([loadCategories(), loadAttribute(), loadPlatforms()]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const addFeature = () => {
    if (game.features[game.features.length - 1] !== "") {
      setGame({ ...game, features: [...game.features, ""] });
    } else {
      toast.error(
        "Please fill in the current feature before adding a new one."
      );
    }
  };

  const removeFeature = (index) => {
    setGame({
      ...game,
      features: game.features.filter((_, i) => i !== index),
    });
  };

  const handleFeatureChange = (index, value) => {
    const updatedFeatures = [...game.features];
    updatedFeatures[index] = value;

    // Prevent empty strings from being added
    if (value.trim() !== "" || index < updatedFeatures.length - 1) {
      setGame({ ...game, features: updatedFeatures });
    }
  };

  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const handleColorChange = debounce((color, field) => {
    setGame((prevGame) => ({ ...prevGame, [field]: color }));
  }, 1000);

  const handleDeleteGame = async (gameId) => {
    if (!gameId) return;

    const confirmed = confirm(
      "Are you sure you want to delete this product? This action cannot be undone."
    );

    if (!confirmed) return;

    setLoading(true);
    try {
      const response = await deleteGame(gameId);

      if (response.error) {
        toast.error(response.error);
        // toast.error("Error deleting game!");
      } else {
        toast.success("Product deleted successfully!");
        router.push("/dashboard/admin/allgames");
      }
    } catch (error) {
      console.log("Error deleting product:", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <BiLoader className="h-8 w-8 animate-spin mx-auto" />;
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center gap-4 mt-4">
        <p className="text-red-500">{error}</p>
        <Button onClick={loadData}>Reload</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between items-start gap-4 text-base">
        {/* id */}
        {data?.id && (
          <Button
            onClick={(e) => {
              navigator.clipboard.writeText(data?.id);

              toast.success("Copied to clipboard!");
            }}
            className="flex gap-2 items-center rounded-lg"
          >
            ID : {data.id}
            <IoCopy className="h-8 w-8 ml-2 p-2 hover:bg-black/10 rounded-lg" />
          </Button>
        )}

        {/* Switches for Priority, Active, Popular */}
        <div className="flex flex-wrap gap-4 w-full bg-white/10 p-4 rounded-lg border border-white/10 hover:border-white/20 ">
          {["is_priority", "is_active", "most_popular"].map((key, index) => (
            <div
              key={index}
              className="flex min-w-fit items-center gap-4 bg-black/20 hover:bg-black/30 p-2 rounded-lg flex-1 justify-center"
            >
              <p>{key.replace("_", " ").toUpperCase()}</p>
              <Switch
                checked={game[key]}
                onChange={(checked) => setGame({ ...game, [key]: checked })}
                className="group relative flex h-7 min-w-14 w-14 cursor-pointer rounded-full bg-white/10 p-1 transition-colors duration-200 ease-in-out data-[checked]:bg-Gold"
              >
                <span className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-white shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7" />
              </Switch>
            </div>
          ))}
        </div>

        {/* Category and Product Attribute Dropdowns */}
        <div className="flex flex-wrap gap-4 w-full bg-white/10 p-4 rounded-lg border border-white/10 hover:border-white/20">
          {/* category */}
          <Field className="flex min-w-fit flex-col gap-1 flex-1">
            <Label>Category</Label>
            <div className="relative">
              <Select
                value={game?.category_id}
                onChange={(e) => {
                  setGame({
                    ...game,
                    category_id: Number(e.target.value),
                  });
                }}
                className="block w-full appearance-none rounded-lg bg-black/20 hover:bg-black/30 py-1.5 px-3"
              >
                <option value="" className="bg-neutral-800" unselectable="on">
                  Select a category
                </option>
                {categories.map((category, index) => (
                  <option
                    key={index}
                    value={category.id}
                    className="bg-neutral-800"
                  >
                    {category.name}
                  </option>
                ))}
              </Select>
              <BiChevronDown
                className="group absolute top-1 right-4 size-8 fill-white/60"
                aria-hidden="true"
              />
            </div>
          </Field>
        </div>

        {/* product attribute category */}
        <Field className="flex flex-col gap-1 w-full bg-white/10 p-4 rounded-lg border border-white/10 hover:border-white/20">
          <Label>Product Attribute Category</Label>

          <div className="flex flex-wrap gap-4 items-center">
            {attribute?.map((attr) => (
              <label
                key={attr.id}
                className="flex items-center gap-2 p-2 rounded-lg bg-black/20 hover:bg-black/30 flex-1 w-full min-w-fit"
              >
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  value={attr.id}
                  checked={
                    game?.prod_attr_cats?.some((item) => item.id === attr.id) ||
                    false
                  }
                  onChange={() => {
                    const existingAttrs = game?.prod_attr_cats || []; // Ensure it's an array

                    const updatedAttrs = existingAttrs.some(
                      (item) => item.id === attr.id
                    )
                      ? existingAttrs.filter((item) => item.id !== attr.id) // Remove if exists
                      : [...existingAttrs, { id: attr.id, name: attr.name }]; // Add if it doesn't exist

                    setGame({
                      ...game,
                      prod_attr_cats: updatedAttrs,
                      prod_attr_cat_ids: updatedAttrs.map((item) => item.id),
                    });
                  }}
                />
                {attr.name}
              </label>
            ))}
          </div>
        </Field>

        {/* title */}
        <Field className="flex flex-col gap-1 w-full">
          <Label>Title</Label>
          <Input
            autoFocus
            type="text"
            placeholder="Product name"
            value={game?.name}
            className="input-field"
            onChange={(e) => {
              setGame({ ...game, name: e.target.value });
            }}
          />
        </Field>

        {/* platform */}
        <Field className="flex flex-col gap-1 w-full bg-white/10 p-4 rounded-lg border border-white/10 hover:border-white/20">
          <Label>Platform</Label>

          <div className="flex flex-wrap gap-4 items-center">
            {platforms.map((platform) => (
              <label
                key={platform.id}
                className="flex items-center gap-2 p-2 rounded-lg bg-black/20 hover:bg-black/30 flex-1"
              >
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  value={platform.id}
                  checked={game?.platform_ids?.includes(platform.id) || false}
                  onChange={() => {
                    setGame({
                      ...game,
                      platform_ids: game.platform_ids.includes(platform.id)
                        ? game.platform_ids.filter((id) => id !== platform.id)
                        : [...game.platform_ids, platform.id],
                    });
                  }}
                />
                {platform.name}
              </label>
            ))}
          </div>
        </Field>

        {/* tag_line */}
        <Field className="flex flex-col gap-1 w-full">
          <Label>Tag Line</Label>
          <Input
            type="text"
            placeholder="Product tagline"
            value={game?.tag_line}
            className="input-field"
            onChange={(e) => {
              setGame({ ...game, tag_line: e.target.value });
            }}
          />
        </Field>

        {/* description */}
        <Field className="flex flex-col gap-1 w-full">
          <Label>Description</Label>
          <Textarea
            placeholder="Product description"
            value={game?.description}
            className="input-field"
            rows={5}
            onChange={(e) => {
              setGame({ ...game, description: e.target.value });
            }}
          />
        </Field>

        {/* price & tax */}
        <div className="flex flex-wrap gap-4 w-full">
          {/* Price */}
          <Field className="flex flex-col gap-1 flex-1">
            <Label>Price</Label>
            <Input
              type="number"
              placeholder="$200"
              value={game?.price}
              className="input-field"
              onChange={(e) => {
                setGame({ ...game, price: e.target.value });
              }}
            />
          </Field>

          {/* tax */}
          <Field className="flex flex-col gap-1 flex-1">
            <Label>Tax</Label>
            <Input
              type="number"
              placeholder="0.2"
              value={game?.tax}
              className="input-field"
              onChange={(e) => {
                setGame({ ...game, tax: e.target.value });
              }}
            />
          </Field>
        </div>

        {/* image */}
        <Field className="flex flex-col gap-1 w-full bg-white/10 p-4 rounded-lg border border-white/10 hover:border-white/20">
          <Label>Image</Label>
          <div className="flex flex-wrap gap-4 flex-1 items-center">
            {game?.image && (
              <div className="group relative cursor-pointer">
                <Image
                  src={game?.image}
                  alt="Product image"
                  width={200}
                  height={200}
                  className="rounded-lg bg-white/10 p-2"
                />
                <IoMdClose
                  className="h-8 w-8 group-hover:opacity-100 opacity-0 absolute top-0 right-0 p-2 m-2 hover:bg-black rounded-lg border border-white/10 bg-black/80"
                  onClick={() =>
                    setGame({ ...game, image: null, remove_image: "true" })
                  }
                />
              </div>
            )}
            <div className="flex flex-col gap-2 flex-1">
              <label
                for="dropzone-file"
                className="relative flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-800/10 border-gray-600 hover:border-gray-500"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <BiUpload className="h-8 w-8 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    Click or drag and drop your image here
                  </p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  accept="image/*"
                  className="absolute border h-full w-full opacity-0"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setGame({
                          ...game,
                          image: reader.result,
                          remove_image: "false",
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

        {/* bg_image */}
        <Field className="flex flex-col gap-1 w-full bg-white/10 p-4 rounded-lg border border-white/10 hover:border-white/20">
          <Label>Background Image</Label>

          <div className="flex flex-wrap gap-4 flex-1">
            {game?.bg_image && (
              <div className="group relative cursor-pointer">
                <Image
                  src={game?.bg_image}
                  alt="background image"
                  width={200}
                  height={200}
                  className="rounded-lg bg-white/10 p-2"
                />
                <IoMdClose
                  className="h-8 w-8 group-hover:opacity-100 opacity-0 absolute top-0 right-0 p-2 m-2 hover:bg-black rounded-lg border border-white/10 bg-black/80"
                  onClick={() =>
                    setGame({
                      ...game,
                      bg_image: null,
                      remove_bg_image: "true",
                    })
                  }
                />
              </div>
            )}

            <label
              for="dropzone-file"
              className="relative flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-800/10 border-gray-600 hover:border-gray-500"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <BiUpload className="h-8 w-8 text-gray-500" />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  Click or drag and drop your image here
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                accept="image/*"
                className="absolute border h-full w-full opacity-0"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setGame({
                        ...game,
                        bg_image: reader.result,
                        remove_bg_image: "false",
                      });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </label>
          </div>
        </Field>

        {/* primary & secondary color */}
        <div className="flex flex-wrap gap-4 w-full">
          {/* primary color */}
          <Field className="flex flex-col gap-1 flex-1 bg-white/10 p-4 rounded-lg border border-white/10 hover:border-white/20">
            <Label>Primary color</Label>
            <div className="flex flex-wrap gap-1 flex-1 items-center">
              <Input
                type="text"
                placeholder="#FFFFFF"
                value={game?.primary_color}
                className="input-field"
                onChange={(e) => {
                  setGame({ ...game, primary_color: e.target.value });
                }}
              />
              <Input
                type="color"
                value={game.primary_color}
                onChange={(e) =>
                  handleColorChange(e.target.value, "primary_color")
                }
                className="h-8 rounded-lg"
              />
            </div>
          </Field>

          {/* secondary color */}
          <Field className="flex flex-col gap-1 flex-1 bg-white/10 p-4 rounded-lg border border-white/10 hover:border-white/20">
            <Label>Secondary color</Label>
            <div className="flex flex-wrap gap-1 flex-1 items-center">
              <Input
                type="text"
                placeholder="#000000"
                value={game?.secondary_color}
                className="input-field"
                onChange={(e) => {
                  setGame({ ...game, secondary_color: e.target.value });
                }}
              />

              <Input
                type="color"
                value={game.secondary_color}
                onChange={(e) =>
                  handleColorChange(e.target.value, "secondary_color")
                }
                className="h-8 rounded-lg"
              />
            </div>
          </Field>
        </div>

        {/* Feature List with Add and Remove Buttons */}
        <Field className="space-y-4 w-full">
          <div className="flex items-center justify-between gap-4">
            <Label>Features</Label>
            <button
              onClick={addFeature}
              className="p-2 rounded-lg hover:bg-white/10 flex gap-2 items-center border border-white/10"
            >
              <IoMdAdd className="h-5 w-5" />
              Add more feature
            </button>
          </div>

          {game.features.map((feature, index) => (
            <div key={index} className="flex flex-wrap gap-2 items-center">
              <Input
                type="text"
                value={feature}
                placeholder={`Feature ${index + 1}`}
                className="input-field"
                onChange={(e) => handleFeatureChange(index, e.target.value)}
              />
              <button
                onClick={() => removeFeature(index)}
                className="border rounded-lg p-2 hover:bg-white/10 border-white/10"
              >
                <IoMdRemove className="h-6 w-6" />
              </button>
            </div>
          ))}
        </Field>

        {/* Reset Buttons */}
        <button
          onClick={() => setGame(initialValues)}
          className="p-2 rounded-lg hover:bg-white/10 border border-white/10 flex flex-wrap items-center gap-2"
        >
          <GrPowerReset className="w-5 h-5" />
          Reset values
        </button>

        {/* delete game */}
        {game.id && (
          <button
            onClick={() => handleDeleteGame(game.id)}
            className="p-2 rounded-lg border border-red-600 flex flex-wrap items-center gap-2 w-full text-red-600 hover:bg-red-600 hover:text-white justify-center"
          >
            <BiTrash className="w-5 h-5" />
            Delete Product
          </button>
        )}
      </div>
    </div>
  );
};
