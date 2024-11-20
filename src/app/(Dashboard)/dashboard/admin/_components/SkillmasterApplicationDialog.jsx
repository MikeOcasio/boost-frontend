"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoClose, IoCopy } from "react-icons/io5";

import Image from "next/image";
import { useUserStore } from "@/store/use-user";
import { updateSkillmasterApplication } from "@/lib/actions/skillmasters-action";
import { BiLink } from "react-icons/bi";
import Link from "next/link";
import { updateUser } from "@/lib/actions/user-actions";

export const SkillmasterApplicationDialog = ({
  dialogData,
  dialogOpen,
  onClose,
  loadApplications,
}) => {
  const [application, setApplication] = useState(dialogData);
  const [loading, setLoading] = useState(false);

  const statusOptions = [
    { label: "Approved", value: "approved" },
    { label: "Denied", value: "denied" },
  ];
  const [updatedStatus, setUpdatedStatus] = useState("");

  const { user } = useUserStore();

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

  const handleClosed = () => {
    setUpdatedStatus("");
    onClose();
  };

  const updateStatus = async () => {
    if (!updatedStatus) {
      toast.error("Please select a status");
      return;
    }

    setLoading(true);

    try {
      const response = await updateSkillmasterApplication({
        id: application.id,
        status: updatedStatus,
        userId: user?.id,
      });

      if (response.error) {
        toast.error(response.error);
      } else {
        if (response.data.status === "approved") {
          await updateUserRole({ role: "skillmaster" });
        }
        if (response.data.status === "denied") {
          await updateUserRole({ role: "customer" });
        }

        handleClosed();
      }
    } catch (error) {
      console.log(error);

      toast.error("Something went wrong! Please try again later.");
    } finally {
      setLoading(false);
      loadApplications();
    }
  };

  const updateUserRole = async ({ role }) => {
    const user = {
      id: application.user_id,
      role: role,
      gamer_tag: application.gamer_tag,
    };

    setLoading(true);

    try {
      const response = await updateUser(user);

      console.log("updates user role ", response.data);

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Application status updated successfully");
        handleClosed();
      }
    } catch (error) {
      console.log(error);

      toast.error("Something went wrong! Please try again later.");
    } finally {
      setLoading(false);
    }
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
        <DialogPanel className="w-full max-w-xl rounded-lg bg-Plum/50 backdrop-blur-lg p-6 space-y-4 relative">
          <button
            onClick={handleClosed}
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

            {/* change status */}
            <div className="flex flex-wrap gap-2 items-center">
              <select
                className="rounded-lg border border-white/10 bg-white/5 p-2 text-sm flex-1"
                value={updatedStatus}
                onChange={(e) => setUpdatedStatus(e.target.value)}
              >
                <option value="pending">Select Status</option>
                {statusOptions.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <button
                disabled={loading || !application.id}
                onClick={updateStatus}
                className="bg-Gold px-4 py-2 rounded-full text-white flex-1 text-center"
              >
                {loading ? "Updating..." : "Update Status"}
              </button>
            </div>

            <div className="flex flex-col gap-2 w-full">
              <p>GamerTag: {application?.gamer_tag}</p>
              <p>User ID: {application?.user_id}</p>

              <p className="text-xs font-semibold">
                Status:
                <span className="ml-2 border border-white/10 rounded-md px-2 py-1 bg-white/5">
                  {application?.status}
                </span>
              </p>

              <p>Reasons: {application?.reasons}</p>

              {application.reviewer_id && (
                <p className="text-xs font-semibold">
                  Reviewer ID: {application.reviewer_id}
                </p>
              )}

              {application.reviewer_id && (
                <p className="text-xs font-semibold">
                  reviewed at:{" "}
                  {new Date(application.reviewed_at).toLocaleString()}
                </p>
              )}

              {application?.channels.length > 0 && (
                <div className="border border-white/10 rounded-lg p-2 space-y-2 bg-white/5">
                  <p>Channels Links</p>

                  <div className="flex flex-wrap gap-2 items-center">
                    {application?.channels?.map((channel, index) => (
                      <Link
                        key={index}
                        href={channel}
                        target="_blank"
                        className="rounded-md w-full p-2 border border-white/10 hover:border-white/20 bg-white/5 flex items-center gap-2 justify-between flex-wrap-reverse"
                      >
                        <span>{channel}</span>
                        <BiLink className="h-8 w-8 hover:bg-white/10 rounded-lg p-1 border border-white/10" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="border border-white/10 rounded-lg p-2 space-y-2 bg-white/5">
                <p>Images</p>

                <div className="flex flex-wrap gap-2 items-center bg-white/10 p-2 rounded-lg">
                  {application?.images?.map((image, index) => (
                    <Image
                      key={index}
                      src={image}
                      alt="Product image"
                      width={200}
                      height={200}
                      priority
                      className="rounded-md w-full object-cover sm:min-w-[200px] h-[200px] flex-1"
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
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
