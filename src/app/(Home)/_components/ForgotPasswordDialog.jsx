"use client";

import { forgotPassword } from "@/lib/actions/user-actions";
import { Dialog, DialogPanel, DialogTitle, Input } from "@headlessui/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { BiLoader } from "react-icons/bi";
import { IoClose } from "react-icons/io5";

export const ForgotPasswordDialog = ({ dialogOpen, onClose, dialogData }) => {
  const [email, setEmail] = useState(dialogData || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is missing");
      return;
    }

    setLoading(true);

    try {
      const response = await forgotPassword({ email });

      if (response.error) {
        toast.success(
          "Reset password link sent to your email, check your inbox."
        );
      } else {
        toast.success("Password reset link sent to your email");
        onClose();
      }
    } catch (error) {
      console.log("Error logging in user:", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
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
        <DialogPanel className="w-full max-w-md rounded-lg bg-Plum/50 backdrop-blur-lg p-6 space-y-4 relative">
          <button
            onClick={() => onClose()}
            className="rounded-lg hover:bg-white/10 absolute right-0 top-0 m-4"
          >
            <IoClose className="h-8 w-8" />
          </button>

          <DialogTitle className="text-lg font-semibold">
            Email address to reset your password
          </DialogTitle>

          <p className="text-xs">
            A password reset link will be sent to your email address.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 overflow-y-auto max-h-[80vh] no-scrollbar"
          >
            <Input
              type="email"
              placeholder="Email"
              disabled={loading || dialogData}
              autoFocus
              required
              className="input-field w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-md bg-Gold px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-Gold/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-Gold gap-2 items-center"
            >
              {loading && <BiLoader className="h-5 w-5 animate-spin" />}
              Send Reset Link
            </button>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
