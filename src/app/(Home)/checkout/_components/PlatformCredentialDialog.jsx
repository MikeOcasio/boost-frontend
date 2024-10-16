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
import { useState } from "react";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";

import { addPlatformCredentials } from "@/lib/actions/user-actions";

export const PlatformCredentialDialog = ({
  dialogId,
  dialogOpen,
  onClose,
  loadOrders,

  handleUserFetch,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async ({ username, password }) => {
    if (!dialogId?.id) {
      toast.error("something went wrong");
      handleClosed();
      return;
    }

    setLoading(true);
    try {
      const response = await addPlatformCredentials({
        platform_id: dialogId?.id,
        username: username,
        password: password,
      });

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Platform added successfully!");
        handleClosed();
      }
    } catch (error) {
      console.log("Error submitting platform:", error.message);
      toast.error(error.message);
    } finally {
      handleUserFetch();
      loadOrders && loadOrders();
      setLoading(false);
    }
  };

  const handleClosed = () => {
    onClose();
    setUsername("");
    setPassword("");
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
            Add {dialogId?.name} credentials
          </DialogTitle>

          <div className="flex flex-col gap-4">
            {/* platform Name Field */}
            <Field className="flex flex-col gap-1 w-full">
              <Label className="text-sm">Username</Label>
              <Input
                type="text"
                placeholder="username"
                autoFocus
                className="input-field"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Field>

            {/* password Field */}
            <Field className="flex flex-col gap-1 w-full">
              <Label className="text-sm">Password</Label>
              <Input
                type="password"
                placeholder="password"
                autoFocus
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>

            <div className="flex items-center justify-between gap-4">
              {/* Submit Button */}
              <button
                onClick={() => handleSubmit({ username, password })}
                disabled={loading || !username.trim() || !password.trim()}
                className={clsx(
                  "bg-Gold/80 p-2 rounded-lg hover:bg-Gold/60 disabled:bg-gray-500/20 flex-1",
                  {
                    "cursor-not-allowed":
                      loading || !username.trim() || !password.trim(),
                  }
                )}
              >
                {loading ? "Submitting..." : "Add credentials"}
              </button>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
