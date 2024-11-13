"use client";

import {
  Field,
  Input,
  Label,
  Popover,
  PopoverButton,
  PopoverPanel,
  Textarea,
} from "@headlessui/react";
import clsx from "clsx";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  BiLoader,
  BiPencil,
  BiPlus,
  BiShield,
  BiTrophy,
  BiUpload,
} from "react-icons/bi";
import { BsUpload } from "react-icons/bs";
import { IoMdAdd, IoMdClose, IoMdPerson, IoMdRemove } from "react-icons/io";
import { IoInformation, IoWarning } from "react-icons/io5";
import { PiGameControllerFill } from "react-icons/pi";

import { PlatformCredentialDialog } from "@/app/(Home)/checkout/_components/PlatformCredentialDialog";
import { fetchCurrentUser, updateUser } from "@/lib/actions/user-actions";
import { fetchPlatforms } from "@/lib/actions/platforms-action";
import { useUserStore } from "@/store/use-user";

const AccountPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [platforms, setPlatforms] = useState([]);

  // dialog
  const [dialogId, setDialogId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const { removeToken } = useUserStore();

  const loadUser = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchCurrentUser();

      if (result.error) {
        toast.error(result.error);

        await removeToken();
        router.push("/login");
      } else {
        const gameplayInfo = result.gameplay_info.map((gameplay) => {
          // parsing array of objects
          const gameplayData = JSON.parse(
            gameplay.replace(/"=>/g, '":').replace(/=>/g, ":")
          );
          return gameplayData;
        });

        setUser({ ...result, gameplay_info: gameplayInfo });
      }
    } catch (e) {
      setError(true);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }, [removeToken]);

  const loadPlatforms = async () => {
    try {
      setLoading(true);
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

  // load data
  useEffect(() => {
    loadPlatforms();
    loadUser();
  }, [loadUser]);

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
      loadUser();
    }
  };

  const handleEdit = () => {
    if (isEditing) {
      handleUpdateProfile();
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleDiscardChanges = () => {
    setIsEditing(false);
    loadData();
  };

  if (!user) return null;

  // credential dialog
  const handleCredentialDialog = (platform) => {
    setDialogId(platform);
    setOpenDialog(true);
  };

  const handleAchievementChange = (index, value) => {
    const updatedAchievements = [...user.achievements];
    updatedAchievements[index] = value;

    // Prevent empty strings from being added
    if (value.trim() !== "" || index < updatedAchievements.length - 1) {
      setUser({ ...user, achievements: updatedAchievements });
    }
  };

  const addAchievement = () => {
    if (user.achievements[user.achievements.length - 1] !== "") {
      setUser({ ...user, achievements: [...user.achievements, ""] });
    } else {
      toast.error(
        "Please fill in the current achievement before adding a new one."
      );
    }
  };

  const removeAchievement = (index) => {
    setUser({
      ...user,
      achievements: user.achievements.filter((_, i) => i !== index),
    });
  };

  const handleGameplayNameChange = (index, value) => {
    const updatedGameplayInfo = [...user.gameplay_info];
    updatedGameplayInfo[index] = { ...updatedGameplayInfo[index], name: value };

    setUser({ ...user, gameplay_info: updatedGameplayInfo });
  };

  const handleGameplayUrlChange = (index, value) => {
    const updatedGameplayInfo = [...user.gameplay_info];
    updatedGameplayInfo[index] = { ...updatedGameplayInfo[index], url: value };

    setUser({ ...user, gameplay_info: updatedGameplayInfo });
  };

  const addGameplayInfo = () => {
    // Allow adding a new entry if at least one field is filled
    if (
      user.gameplay_info[user.gameplay_info.length - 1]?.name !== "" &&
      user.gameplay_info[user.gameplay_info.length - 1]?.url !== ""
    ) {
      setUser({
        ...user,
        gameplay_info: [...user.gameplay_info, { name: "", url: "" }],
      });
    } else {
      toast.error(
        "Please provide at least one field in the current gameplay info before adding a new one."
      );
    }
  };

  const removeGameplay = (index) => {
    setUser({
      ...user,
      gameplay_info: user.gameplay_info.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <h1 className="text-2xl font-semibold flex gap-2 items-center">
          {user?.first_name}&apos;s Account
          {(user.role === "admin" ||
            user.role === "dev" ||
            user.role === "skillmaster") && (
            <span className="px-2 py-1 rounded-md bg-white/10 ml-2 text-xs">
              {user.role}
            </span>
          )}
        </h1>

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
        <div className="flex flex-col gap-4 max-w-3xl mx-auto">
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
                      priority
                      className="mx-auto w-auto h-auto rounded-lg object-contain bg-white/10"
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
            ) : (
              <Field className="flex flex-col gap-1 w-full bg-white/10 p-4 rounded-lg border border-white/10 hover:border-white/20">
                <Label className="text-sm">Profile Image</Label>
                {user.image_url ? (
                  <Image
                    src={user.image_url}
                    alt="User Image"
                    width={150}
                    height={150}
                    priority
                    className="mx-auto h-auto w-auto rounded-lg object-contain bg-white/10"
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
            <Field className="flex flex-col gap-1 w-full bg-white/10 p-4 rounded-lg border border-white/10 hover:border-white/20">
              <Label>Preferred Platforms</Label>

              <div className="flex flex-col gap-2 items-center mt-2">
                {platforms.map((platform) => (
                  <div
                    key={platform.id}
                    className="flex flex-wrap gap-4 items-center justify-between w-full"
                  >
                    <p
                      key={platform.id}
                      className="font-semibold bg-white/5 p-2 rounded-md flex gap-4 flex-1 min-w-sm items-center"
                    >
                      <PiGameControllerFill className="h-5 w-5" />
                      <span className="w-full">{platform.name}</span>
                    </p>

                    {/* add platform */}
                    {user?.platforms.find(
                      (p) => p.id === platform.id && !p.has_sub_platforms
                    ) ? (
                      <div className="bg-white/10 rounded-lg p-2 flex gap-2 items-center flex-1 justify-center">
                        <BiShield className="h-5 w-5 text-green-500" />
                        <span>Added securely</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleCredentialDialog(platform)}
                        disabled={loading}
                        className="bg-Gold/80 hover:bg-Gold/60 rounded-lg p-2 flex gap-2 items-center flex-1 justify-center"
                      >
                        <BiPlus className="h-5 w-5" />
                        Add {platform.has_sub_platforms ? "Sub" : ""} Platform
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </Field>

            {/* gamer tag */}
            {(user.role === "admin" ||
              user.role === "dev" ||
              user.role === "skillmaster") &&
              (isEditing || user.gamer_tag) && (
                <Field className="flex flex-col gap-1 w-full">
                  <Label className="text-sm">Gamer Tag</Label>
                  <Input
                    disabled={!isEditing}
                    type="text"
                    placeholder="Gamer tag name"
                    className="input-field"
                    value={user.gamer_tag}
                    onChange={(e) =>
                      setUser({ ...user, gamer_tag: e.target.value })
                    }
                  />
                </Field>
              )}

            {/* bio */}
            {(user.role === "admin" ||
              user.role === "dev" ||
              user.role === "skillmaster") &&
              (isEditing || user.bio) && (
                <Field className="flex flex-col gap-1 w-full">
                  <Label className="text-sm">Bio</Label>
                  <Textarea
                    disabled={!isEditing}
                    placeholder="Bio"
                    className="input-field"
                    value={user.bio}
                    onChange={(e) => setUser({ ...user, bio: e.target.value })}
                  />
                </Field>
              )}

            {/* user achievements */}
            {(user.role === "admin" ||
              user.role === "dev" ||
              user.role === "skillmaster") &&
              (isEditing || user.achievements.length > 0) && (
                <Field className="flex flex-col gap-1 w-full bg-white/10 p-4 rounded-lg border border-white/10 hover:border-white/20">
                  <div className="flex items-center justify-between gap-4">
                    <Label>Achievements</Label>
                    {isEditing && (
                      <button
                        onClick={addAchievement}
                        className="p-2 rounded-lg hover:bg-white/10 flex gap-2 items-center border border-white/10"
                      >
                        <IoMdAdd className="h-5 w-5" />
                        Add more
                      </button>
                    )}
                  </div>

                  {user.achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="flex flex-wrap gap-2 items-center"
                    >
                      <BiTrophy className="h-5 w-5 text-Gold" />
                      <Input
                        type="text"
                        autoFocus
                        disabled={!isEditing}
                        value={achievement}
                        placeholder={`Achievement ${index + 1}`}
                        className="input-field"
                        onChange={(e) =>
                          handleAchievementChange(index, e.target.value)
                        }
                      />
                      {isEditing && (
                        <button
                          onClick={() => removeAchievement(index)}
                          className="border rounded-lg p-2 hover:bg-white/10 border-white/10"
                        >
                          <IoMdRemove className="h-6 w-6" />
                        </button>
                      )}
                    </div>
                  ))}
                </Field>
              )}

            {/* game play info */}
            {(user.role === "admin" ||
              user.role === "dev" ||
              user.role === "skillmaster") &&
              (isEditing || user.gameplay_info.length > 0) && (
                <Field className="flex flex-col gap-1 w-full bg-white/10 p-4 rounded-lg border border-white/10 hover:border-white/20">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <Label>Gameplay Info</Label>

                      {isEditing && (
                        <div
                          title="Gameplay Url only supports Youtube, Twitch, Mp4 formats"
                          className="cursor-pointer"
                        >
                          <Popover>
                            <PopoverButton>
                              <IoInformation className="h-5 w-5 text-Gold border border-Gold rounded-full p-0.5" />
                            </PopoverButton>
                            <PopoverPanel
                              transition
                              anchor="bottom"
                              className="rounded-xl bg-neutral-800/50 border border-white/10 backdrop-blur-md text-sm/6 transition duration-200 ease-in-out z-10 mt-2"
                            >
                              <div className="p-3">
                                <span>
                                  Gameplay Url only supports Youtube, Twitch,
                                  Mp4 formats
                                </span>
                              </div>
                            </PopoverPanel>
                          </Popover>
                        </div>
                      )}
                    </div>

                    {isEditing && (
                      <button
                        onClick={addGameplayInfo}
                        className="p-2 rounded-lg hover:bg-white/10 flex gap-2 items-center border border-white/10"
                      >
                        <IoMdAdd className="h-5 w-5" />
                        Add more
                      </button>
                    )}
                  </div>

                  {user.gameplay_info.map((gameplay, index) => (
                    <div
                      key={index}
                      className="flex flex-wrap gap-2 items-center"
                    >
                      <Input
                        type="text"
                        autoFocus
                        disabled={!isEditing}
                        value={gameplay.name}
                        placeholder={`Gameplay Name ${index + 1}`}
                        className="input-field"
                        onChange={(e) =>
                          handleGameplayNameChange(index, e.target.value)
                        }
                      />

                      <Input
                        type="text"
                        disabled={!isEditing}
                        value={gameplay.url}
                        placeholder={`Gameplay URL ${index + 1}`}
                        className="input-field"
                        onChange={(e) =>
                          handleGameplayUrlChange(index, e.target.value)
                        }
                      />

                      {isEditing && (
                        <button
                          onClick={() => removeGameplay(index)}
                          className="border rounded-lg p-2 hover:bg-white/10 border-white/10"
                        >
                          <IoMdRemove className="h-6 w-6" />
                        </button>
                      )}
                    </div>
                  ))}
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

      {/* dialog */}
      <PlatformCredentialDialog
        dialogId={dialogId}
        dialogOpen={openDialog}
        onClose={() => setOpenDialog(false)}
        handleUserFetch={loadUser}
      />
    </div>
  );
};

export default AccountPage;
