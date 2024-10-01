"use client";

import { fetchUserById } from "@/lib/actions";
import { Field, Input, Label, Select } from "@headlessui/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiChevronDown, BiLoader, BiPencil, BiUpload } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";
import { IoWarning } from "react-icons/io5";

const AccountPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [platforms, setPlatforms] = useState([]);

  const loadUser = async () => {
    setLoading(true);
    setError(false);

    try {
      const result = await fetchUserById(1);
      if (result.error) {
        setError(true);
        toast.error(result.error);
      } else {
        setUser(result);
      }
    } catch (e) {
      setError(true);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const loadPlatforms = async () => {
    setLoading(true);
    setError(false);

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <h1 className="text-2xl font-semibold">{user?.first_name}'s Account</h1>

        <button
          onClick={() => setIsEditing(true)}
          className="flex flex-wrap gap-2 items-center rounded-lg p-2 hover:bg-white/10 border border-white/10"
        >
          <BiPencil className="h-5 w-5" />
          Edit Details
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
            <Field className="flex flex-col gap-1 w-full bg-white/10 p-4 rounded-lg border border-white/10 hover:border-white/20">
              <Label className="text-sm">Image</Label>
              {!user.image ? (
                <div className="group relative cursor-pointer rounded-lg w-fit mx-auto">
                  <Image
                    src={user.image || "/logo.svg"}
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

            {/* platforms */}
            <div className="flex flex-wrap gap-4 w-full bg-white/10 p-4 rounded-lg border border-white/10 hover:border-white/20">
              <Field className="flex flex-col gap-1 flex-1">
                <Label className="text-sm">Platforms</Label>

                <div className="relative">
                  <Select
                    value={user?.platforms}
                    onChange={(e) => {
                      setUser({ ...user, platforms: e.target.value });
                    }}
                    className="block w-full appearance-none rounded-lg bg-black/20 hover:bg-black/30 py-1.5 px-3"
                  >
                    <option
                      value={null}
                      className="bg-neutral-800"
                      unselectable="on"
                    >
                      Select a platform
                    </option>

                    {platforms.map((item, index) => (
                      <option
                        key={index}
                        value={item}
                        className="bg-neutral-800"
                      >
                        {item}
                      </option>
                    ))}
                  </Select>

                  <BiChevronDown
                    className="group absolute top-1.5 right-4 size-6 fill-white/60"
                    aria-hidden="true"
                  />
                </div>
              </Field>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountPage;
