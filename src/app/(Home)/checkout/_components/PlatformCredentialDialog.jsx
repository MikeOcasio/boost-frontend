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
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";

import { addPlatformCredentials } from "@/lib/actions/user-actions";
import { fetchSubplatforms } from "@/lib/actions/platforms-action";
import { useUserStore } from "@/store/use-user";

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
  const [subplatforms, setSubplatforms] = useState([]);
  const [selectedSubplatform, setSelectedSubplatform] = useState(null);

  const { user } = useUserStore();

  const handleSubmit = async ({ username, password, sub_platform_id }) => {
    if (!dialogId?.id) {
      toast.error("something went wrong");
      handleClosed();
      return;
    }

    if (dialogId?.has_sub_platforms && !sub_platform_id) {
      toast.error("Please select a subplatform");
      handleClosed();
      return;
    }

    setLoading(true);
    try {
      const response = await addPlatformCredentials({
        platform_id: dialogId?.id,
        username: username,
        password: password,
        sub_platform_id: sub_platform_id,
      });

      if (response.error) {
        toast.error(JSON.stringify(response.error));
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
    setSelectedSubplatform(null);
  };

  // use usememo
  const loadSubplatforms = useMemo(() => {
    return async (id) => {
      try {
        setLoading(true);
        const result = await fetchSubplatforms(id);
        if (result.error) {
          toast.error(result.error);
        } else {
          setSubplatforms(result);
        }
      } catch (error) {
        toast.error("Failed to load subplatforms. Please try again!");
      } finally {
        setLoading(false);
      }
    };
  }, []);

  useEffect(() => {
    if (dialogId?.has_sub_platforms) {
      loadSubplatforms(dialogId?.id);
    }
  }, [dialogId, loadSubplatforms]);

  return (
    <Dialog
      open={dialogOpen}
      onClose={handleClosed}
      as="div"
      className="relative z-50 text-white"
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

          <div className="flex flex-col gap-4 overflow-y-auto max-h-[80vh] no-scrollbar">
            {/* Subplatforms */}
            {dialogId?.has_sub_platforms && (
              <Field className="flex flex-col gap-2">
                <Label className="text-sm">Subplatform</Label>
                <select
                  value={selectedSubplatform}
                  onChange={(e) => {
                    setSelectedSubplatform(e.target.value);
                    setPassword("");
                    setUsername("");
                  }}
                  className="input-field"
                >
                  <option value="">Select a subplatform</option>
                  {subplatforms.map((subplatform) => (
                    <option key={subplatform.id} value={subplatform.id}>
                      {subplatform.name}
                    </option>
                  ))}
                </select>
              </Field>
            )}

            {user?.sub_platforms.find(
              (p) => p.id === Number(selectedSubplatform)
            ) ? (
              <p>Subplatform credential already added</p>
            ) : (
              (!dialogId?.has_sub_platforms || selectedSubplatform) && (
                <>
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
                </>
              )
            )}
            <div className="flex items-center justify-between gap-4">
              {/* Submit Button */}
              <button
                onClick={() =>
                  handleSubmit({
                    username,
                    password,
                    sub_platform_id: selectedSubplatform,
                  })
                }
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
