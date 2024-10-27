"use client";

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Field,
  Input,
  Label,
  Select,
} from "@headlessui/react";
import clsx from "clsx";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoClose, IoCopy } from "react-icons/io5";
import {
  BiChevronDown,
  BiLoader,
  BiLock,
  BiTrash,
  BiUpload,
} from "react-icons/bi";
import { IoMdClose } from "react-icons/io";
import Image from "next/image";
import { BsEye, BsEyeSlash, BsUnlock } from "react-icons/bs";

import {
  banUser,
  createUser,
  deleteUser,
  lockUserAction,
  unlockUserAction,
  updateUser,
} from "@/lib/actions/user-actions";
import { useUserStore } from "@/store/use-user";
import { GiCancel } from "react-icons/gi";

export const UserDialog = ({ dialogData, dialogOpen, onClose, loadUsers }) => {
  const { user: currentUser } = useUserStore();

  const [user, setUser] = useState(dialogData || getDefaultUser());
  const [loading, setLoading] = useState(false);

  const [role, setRole] = useState(["customer", "admin", "skillmaster"]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function getDefaultUser() {
    return {
      email: "",
      first_name: "",
      last_name: "",
      role: "customer",
      preferred_skill_master_ids: [],
      platforms: [],
      image_url: null,
      password: null,
      confirmPassword: null,
    };
  }

  useEffect(() => {
    if (dialogData) {
      setUser(dialogData);
    } else {
      setUser(getDefaultUser());
    }
  }, [dialogData]);

  // Function to check if the user data is unchanged
  const isDataUnchanged = () => {
    return (
      user.email === dialogData?.email &&
      user.first_name === dialogData?.first_name &&
      user.last_name === dialogData?.last_name &&
      user.role === dialogData?.role &&
      user.image_url === dialogData?.image_url
    );
  };

  const handleSubmit = async (userData) => {
    if (userData.id && isDataUnchanged()) {
      toast.error("No changes were made.");
      return;
    }

    setLoading(true);
    try {
      if (userData.id) {
        // Update existing user
        const response = await updateUser(userData);

        if (response.error) {
          toast.error(JSON.stringify(response.error));
        } else {
          toast.success("User updated successfully!");
        }
      } else {
        // Add new user
        const response = await createUser({
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          password: user.password,
          confirmPassword: user.confirmPassword,
          image_url: user.image_url,
        });

        if (response.error) {
          toast.error(JSON.stringify(response.error));
        } else {
          toast.success("User added successfully!");
        }
      }

      handleClosed();
    } catch (error) {
      console.log("Error submitting user:", error.message);
      toast.error(error.message);
    } finally {
      loadUsers();
      handleClosed();
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!userId) return;

    const confirmed = confirm(
      "Are you sure you want to delete this user? This action cannot be undone."
    );

    if (!confirmed) return;

    setLoading(true);
    try {
      const response = await deleteUser(userId);

      if (response.error) {
        // toast.error(response.error);
        toast.error("Error deleting user!");
      } else {
        toast.success("User deleted successfully!");
        handleClosed();
      }
    } catch (error) {
      console.log("Error deleting user:", error.message);
      toast.error(error.message);
    } finally {
      loadUsers();
      handleClosed();
      setLoading(false);
    }
  };

  const handleClosed = () => {
    onClose();
    setShowPassword(false);
    setShowConfirmPassword(false);
    setUser(dialogData || getDefaultUser());
  };

  const handelBanUser = async () => {
    if (!user.id) return;

    const confirmed = confirm("Are you sure you want to ban this user?");
    if (!confirmed) return;

    try {
      setLoading(true);
      const response = await banUser(user.id);

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("User banned successfully!");
        handleClosed();
      }
    } catch (error) {
      toast.error("Failed to ban user. Please try again!");
    } finally {
      loadUsers();
      handleClosed();
      setLoading(false);
    }
  };

  const lockUser = async () => {
    if (!user.id) return;

    const confirmed = confirm("Are you sure you want to lock this user?");
    if (!confirmed) return;

    try {
      setLoading(true);
      const response = await lockUserAction(user.id);

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("User locked successfully!");
        handleClosed();
      }
    } catch (error) {
      toast.error("Failed to lock user. Please try again!");
    } finally {
      loadUsers();
      handleClosed();
      setLoading(false);
    }
  };

  const unlockUser = async () => {
    if (!user.id) return;
    const confirmed = confirm(
      "Are you sure you want to unlock this user account?"
    );
    if (!confirmed) return;

    try {
      setLoading(true);
      const response = await unlockUserAction(user.id);

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("User unlocked successfully!");
        handleClosed();
      }
    } catch (error) {
      toast.error("Failed to unlock user. Please try again!");
    } finally {
      loadUsers();
      handleClosed();
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
        <DialogPanel className="w-full max-w-2xl rounded-lg bg-Plum/50 backdrop-blur-lg p-6 space-y-4 relative">
          <button
            onClick={handleClosed}
            className="rounded-lg hover:bg-white/10 absolute right-0 top-0 m-4"
          >
            <IoClose className="h-8 w-8" />
          </button>

          <DialogTitle className="text-lg font-semibold">
            {dialogData ? "Update User" : "Add New User"}
          </DialogTitle>

          <span className="text-xs text-white/80">
            {dialogData
              ? "You can update user role to skillmaster, admin, customer"
              : "To create a new user you need to fill all the fields. User role will be set to customer by default."}
          </span>

          <div className="flex flex-col gap-4 overflow-y-auto max-h-[80vh] no-scrollbar">
            <div className="flex flex-wrap gap-2 justify-between items-center">
              {/* id */}
              {user?.id && (
                <button
                  type="button"
                  onClick={(e) => {
                    navigator.clipboard.writeText(user.id);

                    toast.success("Copied to clipboard!");
                  }}
                  className="flex gap-2 items-center rounded-lg bg-black/30 px-2 py-1 hover:bg-black/40 w-fit"
                >
                  <span className="text-sm font-semibold break-all">
                    ID: {user.id}
                  </span>
                  <IoCopy className="h-8 w-8 ml-2 p-2 hover:bg-white/10 rounded-lg" />
                </button>
              )}

              <div className="flex gap-2 items-center flex-wrap">
                {/* lock user */}
                {user?.id && !user?.locked_by_admin && (
                  <button
                    type="button"
                    onClick={lockUser}
                    className="flex items-center gap-2 border rounded-md px-2 py-1 text-sm border-blue-500/50 text-blue-500 hover:bg-blue-500 hover:text-white"
                  >
                    <BiLock className="h-5 w-5" />
                    Lock User
                  </button>
                )}

                {user?.id && user?.locked_by_admin && (
                  <button
                    type="button"
                    onClick={unlockUser}
                    className="flex items-center gap-2 border rounded-md px-2 py-1 text-sm border-green-500 hover:bg-green-500 hover:text-white text-green-500"
                  >
                    <BsUnlock className="h-5 w-5" />
                    Unlock User
                  </button>
                )}

                {/* ban user */}
                {user?.id && (
                  <button
                    type="button"
                    onClick={handelBanUser}
                    className="flex items-center gap-2 border rounded-md px-2 py-1 text-sm border-red-500 hover:bg-red-500 hover:text-white text-red-500"
                  >
                    <GiCancel className="h-5 w-5" />
                    Ban User
                  </button>
                )}
              </div>
            </div>

            {/* Role */}
            {user?.id && (
              <div className="flex flex-wrap gap-4 w-full bg-white/10 p-4 rounded-lg border border-white/10 hover:border-white/20">
                <Field className="flex flex-col gap-1 flex-1">
                  <Label className="text-sm">Role</Label>

                  <div className="relative">
                    <Select
                      value={user?.role}
                      onChange={(e) => {
                        setUser({ ...user, role: e.target.value });
                      }}
                      className="block w-full appearance-none rounded-lg bg-black/20 hover:bg-black/30 py-1.5 px-3"
                    >
                      <option
                        value=""
                        className="bg-neutral-800"
                        unselectable="on"
                      >
                        Select a role
                      </option>

                      {role.map((item, index) => (
                        <option
                          key={index}
                          value={item}
                          className="bg-neutral-800"
                        >
                          {/* capital first letter */}
                          {item.charAt(0).toUpperCase() + item.slice(1)}
                        </option>
                      ))}

                      {currentUser?.role === "dev" && (
                        <option value="dev" className="bg-neutral-800">
                          Developer
                        </option>
                      )}
                    </Select>

                    <BiChevronDown
                      className="group absolute top-1.5 right-4 size-6 fill-white/60"
                      aria-hidden="true"
                    />
                  </div>
                </Field>
              </div>
            )}

            {/* email */}
            <Field className="flex flex-col gap-1 w-full">
              <Label className="text-sm">Email</Label>
              <Input
                type="email"
                placeholder="john@doe.com"
                autoFocus
                className="input-field"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
            </Field>

            {/* name */}
            <div className="flex flex-wrap gap-4 w-full bg-white/10 p-4 rounded-lg border border-white/10 hover:border-white/20">
              <Field className="flex flex-col gap-1 flex-1">
                <Label className="text-sm">First name</Label>
                <Input
                  type="text"
                  placeholder="First name"
                  autoFocus
                  className="input-field"
                  value={user.first_name}
                  onChange={(e) =>
                    setUser({ ...user, first_name: e.target.value })
                  }
                />
              </Field>

              <Field className="flex flex-col gap-1 flex-1">
                <Label className="text-sm">Last name</Label>
                <Input
                  type="text"
                  placeholder="Last name"
                  autoFocus
                  className="input-field"
                  value={user.last_name}
                  onChange={(e) =>
                    setUser({ ...user, last_name: e.target.value })
                  }
                />
              </Field>
            </div>

            {/* password & confirm password */}
            {!user?.id && (
              <div className="flex flex-wrap gap-4 w-full bg-white/10 p-4 rounded-lg border border-white/10 hover:border-white/20">
                <Field className="flex flex-col gap-1 flex-1">
                  <Label className="text-sm">Password</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      autoFocus
                      className="input-field w-full"
                      value={user.password}
                      onChange={(e) =>
                        setUser({ ...user, password: e.target.value })
                      }
                    />

                    <button
                      type="button"
                      className="absolute right-1 top-1/2 h-7 w-8 p-1.5 rounded-lg hover:bg-white/10 -translate-y-1/2 text-gray-400 hover:text-gray-500 flex items-center justify-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <BsEyeSlash /> : <BsEye />}
                    </button>
                  </div>
                </Field>

                <Field className="flex flex-col gap-1 flex-1">
                  <Label className="text-sm">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      autoFocus
                      className="input-field w-full"
                      value={user.confirmPassword}
                      onChange={(e) =>
                        setUser({ ...user, confirmPassword: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      className="absolute right-1 top-1/2 h-7 w-8 p-1.5 rounded-lg hover:bg-white/10 -translate-y-1/2 text-gray-400 hover:text-gray-500 flex items-center justify-center"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? <BsEyeSlash /> : <BsEye />}
                    </button>
                  </div>
                </Field>
              </div>
            )}
            {/* user image */}
            {user?.id && (
              <Field className="flex flex-col gap-1 w-full bg-white/10 p-4 rounded-lg border border-white/10 hover:border-white/20">
                <Label className="text-sm">Image</Label>
                {user.image_url ? (
                  <div className="group relative cursor-pointer rounded-lg mx-auto max-h-[200px]">
                    <Image
                      src={user.image_url}
                      alt="User Image"
                      width={150}
                      height={150}
                      priority
                      className="mx-auto w-full h-full rounded-lg object-cover bg-white/10"
                    />
                    <IoMdClose
                      type="button"
                      className="h-8 w-8 group-hover:opacity-100 opacity-0 absolute top-0 right-0 p-2 m-2 hover:bg-black rounded-lg border border-white/10 bg-black/80"
                      onClick={() =>
                        setUser({
                          ...user,
                          image_url: null,
                        })
                      }
                    />
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 justify-center w-full">
                    <label
                      htmlFor="dropzone-file"
                      className="relative flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-800/10 border-gray-600 hover:border-gray-500"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <BiUpload className="h-8 w-8 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
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
                              setUser({
                                ...user,
                                image_url: reader.result,
                              });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                )}
              </Field>
            )}
            {/* platforms */}

            {/* delete & submit button */}
            <div className="flex items-center justify-between gap-4">
              {/* Delete Button */}
              {dialogData && (
                <button
                  title="Delete User"
                  onClick={() => handleDelete(user.id)}
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
                onClick={() => handleSubmit(user)}
                disabled={loading || !user.role || isDataUnchanged()}
                className={clsx(
                  "bg-Gold/80 p-2 rounded-lg hover:bg-Gold/60 disabled:bg-gray-500/20 flex-1",
                  {
                    "cursor-not-allowed":
                      loading || !user.role || isDataUnchanged(),
                  }
                )}
              >
                {loading
                  ? "Submitting..."
                  : dialogData
                  ? "Update user"
                  : "Add user"}
              </button>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
