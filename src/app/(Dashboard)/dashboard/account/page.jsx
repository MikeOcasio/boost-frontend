"use client";

import { fetchCurrentUser, fetchPlatforms, updateUser } from "@/lib/actions";
import { Field, Input, Label } from "@headlessui/react";
import clsx from "clsx";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiLoader, BiPencil, BiUpload } from "react-icons/bi";
import { BsUpload } from "react-icons/bs";
import { IoMdClose, IoMdPerson } from "react-icons/io";
import { IoWarning } from "react-icons/io5";

const AccountPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [platforms, setPlatforms] = useState([]);

  const loadUser = async () => {
    try {
      const result = await fetchCurrentUser();
      if (result.error) {
        setError(true);
        toast.error(result.error);
      } else {
        setUser(result);
      }
    } catch (e) {
      setError(true);
      toast.error("An unexpected error occurred.");
    }
  };

  const loadPlatforms = async () => {
    try {
      const result = await fetchPlatforms();
      if (result.error) {
        setError(true);
        toast.error(result.error);
      } else {
        setPlatforms(result);
      }
    } catch (e) {
      setError(true);
      toast.error("An unexpected error occurred.");
    }
  };

  //  load user data by default and if edititng is true, load the platform data
  const loadData = async () => {
    setLoading(true);
    setError(false);

    Promise.all([loadPlatforms(), loadUser()]).then(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateProfile = async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(false);

    try {
      const result = await updateUser(user);

      if (result.error) {
        setError(true);
        toast.error(result.error);
      } else {
        toast.success("Profile updated successfully!");
      }
    } catch (e) {
      setError(true);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (isEditing) {
      setIsEditing(false);
      handleUpdateProfile();
    } else {
      setIsEditing(true);
    }
  };

  const handleDiscardChanges = () => {
    setIsEditing(false);
    loadData();
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <h1 className="text-2xl font-semibold">{user?.first_name}'s Account</h1>

        <button
          type="button"
          onClick={handleEdit}
          className={clsx(
            "flex flex-wrap gap-2 items-center rounded-lg p-2 hover:bg-white/10 border border-white/10",
            isEditing && "bg-Gold/80 hover:bg-Gold/60"
          )}
        >
          {isEditing ? (
            <BsUpload className="h-5 w-5" />
          ) : (
            <BiPencil className="h-5 w-5" />
          )}
          {isEditing ? "Save Changes" : "Edit Details"}
        </button>
      </div>

      {loading && <BiLoader className="h-8 w-8 animate-spin mx-auto" />}

      {error && (
        <p className="w-fit bg-red-500/50 p-4 rounded-lg mx-auto flex items-center justify-center gap-2">
          <IoWarning className="h-5 w-5 mr-2" />
          Failed to load user details. Please try again!
        </p>
      )}

      {user && (
        <div className="flex flex-col gap-4 max-w-2xl mx-auto">
          <div className="flex flex-wrap gap-4">
            {/* user image */}
            {isEditing ? (
              <Field className="flex flex-col gap-1 w-full bg-white/10 p-4 rounded-lg border border-white/10 hover:border-white/20">
                <Label className="text-sm">Profile Image</Label>
                {user.image_url ? (
                  <div className="group relative cursor-pointer rounded-lg w-fit mx-auto">
                    <Image
                      src={user.image_url}
                      alt="User Image"
                      width={200}
                      height={200}
                      className="mx-auto rounded-lg object-cover bg-white/10"
                    />
                    <IoMdClose
                      type="button"
                      className="h-8 w-8 group-hover:opacity-100 opacity-0 absolute top-0 right-0 p-2 m-2 hover:bg-black rounded-lg border border-white/10 bg-black/80"
                      onClick={() =>
                        setUser({
                          ...user,
                          image: null,
                          remove_image: "true",
                        })
                      }
                    />
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 justify-center w-full">
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
                              setUser({
                                ...user,
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
                )}
              </Field>
            ) : (
              <Field className="flex flex-col gap-1 w-full bg-white/10 p-4 rounded-lg border border-white/10 hover:border-white/20">
                <Label className="text-sm">Profile Image</Label>
                {user.image_url ? (
                  <Image
                    src={user.image_url}
                    alt="User Image"
                    width={150}
                    height={150}
                    className="mx-auto rounded-lg object-cover bg-white/10"
                  />
                ) : (
                  <IoMdPerson className="h-28 w-28 bg-white/10 rounded-full p-4 mx-auto" />
                )}
              </Field>
            )}

            {/* name */}
            <div className="flex flex-wrap gap-4 w-full bg-white/10 p-4 rounded-lg border border-white/10 hover:border-white/20">
              <Field className="flex flex-col gap-1 flex-1">
                <Label className="text-sm">First name</Label>
                <Input
                  disabled={!isEditing}
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
                  disabled={!isEditing}
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

            {/* email */}
            <Field className="flex flex-col gap-1 w-full">
              <Label className="text-sm">Email</Label>
              <Input
                disabled
                type="email"
                placeholder="john@doe.com"
                autoFocus
                className="input-field"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
            </Field>

            {/* platforms */}
            {isEditing ? (
              <Field className="flex flex-col gap-1 w-full bg-white/10 p-4 rounded-lg border border-white/10 hover:border-white/20">
                <Label>Platform</Label>

                <div className="flex flex-wrap gap-4 items-center">
                  {platforms.map((platform) => (
                    <label
                      key={platform.id}
                      className="flex items-center gap-2 p-2 rounded-lg bg-black/20 hover:bg-black/30 flex-wrap flex-1"
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        value={platform.id}
                        checked={user?.platforms.includes(platform.id) || false}
                        onChange={() => {
                          setUser({
                            ...user,
                            platforms: user.platforms.includes(platform.id)
                              ? user.platforms.filter(
                                  (id) => id !== platform.id
                                )
                              : [...user.platforms, platform.id],
                          });
                        }}
                      />
                      {platform.name}
                    </label>
                  ))}
                </div>
              </Field>
            ) : (
              <Field className="flex flex-col gap-1 w-full bg-white/10 p-4 rounded-lg border border-white/10 hover:border-white/20">
                <Label>Preferred Platforms</Label>

                <div className="flex flex-wrap gap-4 items-center">
                  {user.platforms.map((platform) => (
                    <p
                      key={platform}
                      className="text-xs text-gray-300 bg-black/10 px-1 rounded-md"
                    >
                      {platform} asd
                    </p>
                  ))}
                </div>
              </Field>
            )}
          </div>

          {isEditing && (
            <button
              onClick={handleDiscardChanges}
              disabled={loading}
              type="button"
              className="border border-red-500 p-2 px-4 text-red-500 hover:bg-red-500/10 hover:text-white rounded-lg"
            >
              Discard Changes
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AccountPage;
