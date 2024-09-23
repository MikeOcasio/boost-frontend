import { Button } from "@/components/Button";
import { Field, Input, Label } from "@headlessui/react";
import clsx from "clsx";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiCopy } from "react-icons/bi";

export const EditGame = ({ data, setData }) => {
  const [game, setGame] = useState(data || getDefaultGame());
  const [loading, setLoading] = useState(false);

  function getDefaultGame() {
    return {
      name: "",
      id: "ascadsfsdf",
      href: "",
      isActive: false,
      mostPopular: true,
      tagLine: "",
      description: "",
      features: [],
      image: "",
      altText: "",
      bgImage: "",
      primaryColor: "",
    };
  }

  useEffect(() => {
    setData(game);
  }, [game, setData]);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex justify-between items-start flex-wrap-reverse gap-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Field>
            <Label>Title</Label>
            <Input
              type="text"
              placeholder="Game Name"
              value={game?.name}
              className={clsx(
                "mt-3 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white",
                "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
              )}
              onChange={(e) => {
                setGame({ ...game, name: e.target.value });
              }}
            />
          </Field>
          <div className="text-sm text-muted-foreground">
            Game Name must be short and descriptive
          </div>
        </div>

        {data?.id && (
          <Button
            onClick={(e) => {
              navigator.clipboard.writeText(data?.id);

              toast.success("Copied to clipboard!");
            }}
            className="flex gap-2 items-center rounded-lg"
          >
            ID : {data.id}
            <BiCopy className="h-5 w-5 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};
