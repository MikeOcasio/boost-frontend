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

import { BiLoader, BiTrash } from "react-icons/bi";
import Image from "next/image";

export const SkillmasterApplicationDialog = ({
  dialogData,
  dialogOpen,
  onClose,
  loadApplications,
}) => {
  const [application, setApplication] = useState(dialogData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (dialogData) {
      setApplication(dialogData);
    }
  }, [dialogData]);

  if (!application) return null;

  const openImage = (e) => {
    const image = e.target.src;
    window.open(image, "_blank");
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
        <DialogPanel className="w-full max-w-xl rounded-lg bg-Plum/50 backdrop-blur-lg p-6 space-y-4 relative">
          <button
            onClick={onClose}
            className="rounded-lg hover:bg-white/10 absolute right-0 top-0 m-4"
          >
            <IoClose className="h-8 w-8" />
          </button>

          <DialogTitle className="text-lg font-semibold">
            Update Skillmaster Application
          </DialogTitle>

          <div className="flex flex-col gap-4 overflow-y-auto max-h-[80vh] no-scrollbar">
            {/* id */}
            {application?.id && (
              <button
                onClick={(e) => {
                  navigator.clipboard.writeText(application.id);

                  toast.success("Copied to clipboard!");
                }}
                className="flex gap-2 items-center rounded-lg bg-black/30 px-2 py-1 hover:bg-black/40 w-fit"
              >
                <span className="text-sm font-semibold break-all">
                  ID: {application.id}
                </span>
                <IoCopy className="h-8 w-8 ml-2 p-2 hover:bg-white/10 rounded-lg" />
              </button>
            )}

            <div className="flex flex-col gap-2 w-full">
              <p>Gamer Tag: {application?.gamer_tag}</p>
              <p>Reasons: {application?.reasons}</p>
              <p>Images:</p>

              <div className="flex flex-wrap gap-2 items-center">
                {application?.images?.map((image, index) => (
                  <Image
                    key={index}
                    src={image}
                    alt="Product image"
                    width={200}
                    height={200}
                    priority
                    className="rounded-lg bg-white/10 p-2 h-full w-full object-cover min-w-[200px] max-h-[200px]"
                    onClick={openImage}
                  />
                ))}
              </div>
            </div>

            {/* created at */}
            <p className="text-xs font-semibold">
              Created at: {new Date(application.created_at).toLocaleString()}
            </p>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
