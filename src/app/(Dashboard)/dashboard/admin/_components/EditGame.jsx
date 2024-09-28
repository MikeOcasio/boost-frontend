import {
  Field,
  Input,
  Label,
  Select,
  Switch,
  Textarea,
} from "@headlessui/react";
import Image from "next/image";
import clsx from "clsx";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiChevronDown, BiLoader } from "react-icons/bi";
import { IoCopy } from "react-icons/io5";
import { IoMdAdd, IoMdRemove, IoMdClose } from "react-icons/io";
import { GrPowerReset } from "react-icons/gr";

import { Button } from "@/components/Button";
import { fetchAttribute, fetchCategories, fetchPlatforms } from "@/lib/actions";

export const EditGame = ({ data, setData }) => {
  const [game, setGame] = useState(data || getDefaultGame());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [attribute, setAttribute] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);

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
      product_attribute_category_id: null,
      category: {},
      product_attribute_category: {},
      platform_ids: [],
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
    setError(null); // Reset error
    await Promise.all([loadCategories(), loadAttribute(), loadPlatforms()]);
    setLoading(false); // Stop loading once both are fetched
  };

  useEffect(() => {
    loadData();
  }, []);

  const addFeature = () => {
    setGame({ ...game, features: [...game.features, ""] });
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

    setGame({ ...game, features: updatedFeatures });
  };

  const handleColorChange = (color, field) => {
    setTimeout(() => {
      setGame({ ...game, [field]: color });
    }, 1000);
  };

  const handlePlatformChange = (platformId) => {
    setSelectedPlatforms((prevSelected) => {
      if (prevSelected.includes(platformId)) {
        setGame((prevGame) => ({
          ...prevGame,
          platform_ids: prevGame.platform_ids.filter((id) => id !== platformId),
        }));
        return prevSelected.filter((id) => id !== platformId);
      } else {
        setGame((prevGame) => ({
          ...prevGame,
          platform_ids: [...prevGame.platform_ids, platformId],
        }));
        return [...prevSelected, platformId];
      }
    });
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
        <div className="flex flex-wrap gap-4 w-full bg-white/10 p-4 rounded-lg">
          {["is_priority", "is_active", "most_popular"].map((key, index) => (
            <div
              key={index}
              className="flex min-w-fit items-center gap-4 bg-black/20 p-2 rounded-lg flex-1 justify-center"
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
        <div className="flex flex-wrap gap-4 w-full bg-white/10 p-4 rounded-lg">
          {/* category */}
          <Field className="flex min-w-fit flex-col gap-1 flex-1">
            <Label>Category</Label>
            <div className="relative">
              <Select
                value={game?.category_id}
                onChange={(e) => {
                  const selectedCategory = categories.find(
                    (cat) => cat.id === Number(e.target.value)
                  );

                  setGame({
                    ...game,
                    category_id: Number(e.target.value),
                    category: { name: selectedCategory?.name },
                  });
                }}
                className="block w-full appearance-none rounded-lg bg-white/5 py-1.5 px-3"
              >
                <option
                  value={null}
                  className="bg-neutral-800"
                  unselectable="on"
                >
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

          {/* product attribute category */}
          <Field className="flex min-w-fit flex-col gap-1 flex-1">
            <Label>Product Attribute Category</Label>
            <div className="relative">
              <Select
                value={game?.product_attribute_category_id}
                onChange={(e) => {
                  const selectedAttribute = attribute.find(
                    (attr) => attr.id === Number(e.target.value)
                  );

                  setGame({
                    ...game,
                    product_attribute_category_id: Number(e.target.value),
                    product_attribute_category: {
                      name: selectedAttribute.name,
                    },
                  });
                }}
                className="block w-full appearance-none rounded-lg bg-white/5 py-1.5 px-3"
              >
                <option
                  value={null}
                  className="bg-neutral-800"
                  unselectable="on"
                >
                  Select an attribute
                </option>

                {attribute.map((item, index) => (
                  <option
                    key={index}
                    value={item.id}
                    className="bg-neutral-800"
                  >
                    {item.name}
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

        {/* title */}
        <Field className="flex flex-col gap-1 w-full">
          <Label>Title</Label>
          <Input
            autoFocus
            type="text"
            placeholder="Game name"
            value={game?.name}
            className={clsx(
              "rounded-lg border-none bg-white/10 py-1.5 px-3 text-xl",
              "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
            )}
            onChange={(e) => {
              setGame({ ...game, name: e.target.value });
            }}
          />
        </Field>

        {/* platform */}
        <Field className="flex flex-col gap-1 w-full bg-white/10 p-4 rounded-lg">
          <Label>Platform</Label>

          <div className="flex flex-col gap-2">
            {platforms.map((platform) => (
              <label key={platform.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={platform.id}
                  checked={game?.platform_ids?.includes(platform.id) || false} // Ensure this is checking the game state
                  onChange={() => handlePlatformChange(platform.id)} // Use the updated handler
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 checked:bg-blue-600 focus:checked:border-blue-600"
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
            placeholder="Game tagline"
            value={game?.tag_line}
            className={clsx(
              "rounded-lg border-none bg-white/10 py-1.5 px-3",
              "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
            )}
            onChange={(e) => {
              setGame({ ...game, tag_line: e.target.value });
            }}
          />
        </Field>

        {/* description */}
        <Field className="flex flex-col gap-1 w-full">
          <Label>Description</Label>
          <Textarea
            placeholder="Game description"
            value={game?.description}
            className={clsx(
              "rounded-lg border-none bg-white/10 py-1.5 px-3",
              "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
            )}
            rows={3}
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
              className={clsx(
                "rounded-lg border-none bg-white/10 py-1.5 px-3",
                "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
              )}
              onChange={(e) => {
                setGame({ ...game, price: Number(e.target.value) });
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
              className={clsx(
                "rounded-lg border-none bg-white/10 py-1.5 px-3",
                "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
              )}
              onChange={(e) => {
                setGame({ ...game, tax: Number(e.target.value) });
              }}
            />
          </Field>
        </div>

        {/* image */}
        <Field className="flex flex-col gap-1 w-full bg-white/10 p-4 rounded-lg">
          <Label>Image</Label>
          <div className="flex flex-wrap gap-1 flex-1 items-center">
            {game?.image && (
              <div className="group relative cursor-pointer">
                <Image
                  src={game?.image}
                  alt="game image"
                  width={200}
                  height={200}
                  className="rounded-lg"
                />
                <IoMdClose
                  className="h-8 w-8 group-hover:opacity-100 opacity-0 absolute top-0 right-0 p-2 m-2 hover:bg-black rounded-lg border border-white/10 bg-black/80"
                  onClick={() => setGame({ ...game, image: null })}
                />
              </div>
            )}
            <Input
              type="file"
              accept="image/*"
              className={clsx(
                "rounded-lg border-none bg-white/10 py-1.5 px-3 flex-1",
                "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
              )}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setGame({ ...game, image: reader.result });
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </div>
        </Field>

        {/* bg_image */}
        <Field className="flex flex-col gap-1 w-full bg-white/10 p-4 rounded-lg">
          <Label>Background Image</Label>

          <div className="flex flex-wrap gap-1 flex-1 items-center">
            {game?.bg_image && (
              <div className="group relative cursor-pointer">
                <Image
                  src={game?.bg_image}
                  alt="background image"
                  width={200}
                  height={200}
                  className="rounded-lg"
                />
                <IoMdClose
                  className="h-8 w-8 group-hover:opacity-100 opacity-0 absolute top-0 right-0 p-2 m-2 hover:bg-black rounded-lg border border-white/10 bg-black/80"
                  onClick={() => setGame({ ...game, bg_image: null })}
                />
              </div>
            )}

            <Input
              type="file"
              accept="image/*"
              className={clsx(
                "rounded-lg border-none bg-white/10 py-1.5 px-3 flex-1",
                "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
              )}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setGame({ ...game, bg_image: reader.result });
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </div>
        </Field>

        {/* primary & secondary color */}
        <div className="flex flex-wrap gap-4 w-full">
          {/* primary color */}
          <Field className="flex flex-col gap-1 flex-1 bg-white/10 p-4 rounded-lg">
            <Label>Primary color</Label>
            <div className="flex flex-wrap gap-1 flex-1 items-center">
              <Input
                type="text"
                placeholder="#FFFFFF"
                value={game?.primary_color}
                className={clsx(
                  "rounded-lg border-none bg-white/10 py-1.5 px-3 flex-1",
                  "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
                )}
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
          <Field className="flex flex-col gap-1 flex-1 bg-white/10 p-4 rounded-lg">
            <Label>Secondary color</Label>
            <div className="flex flex-wrap gap-1 flex-1 items-center">
              <Input
                type="text"
                placeholder="#000000"
                value={game?.secondary_color}
                className={clsx(
                  "rounded-lg border-none bg-white/10 py-1.5 px-3 flex-1",
                  "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
                )}
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
                className="rounded-lg bg-white/10 py-1.5 px-3 flex-1"
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
          onClick={() => setGame(getDefaultGame())}
          className="p-2 rounded-lg hover:bg-white/10 border border-white/10 flex flex-wrap items-center gap-2"
        >
          <GrPowerReset className="w-5 h-5" />
          Reset values
        </button>
      </div>
    </div>
  );
};
