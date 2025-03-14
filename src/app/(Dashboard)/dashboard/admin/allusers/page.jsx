"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { BiLoader, BiLock, BiPencil, BiPlus } from "react-icons/bi";
import { IoWarning } from "react-icons/io5";
import Image from "next/image";
import { IoMdPerson } from "react-icons/io";
import clsx from "clsx";
import { FaDeleteLeft } from "react-icons/fa6";

import { fetchAllUsers, fetchBannedUsers } from "@/lib/actions/user-actions";
import { UserDialog } from "../_components/UserDialog";
import { BsEye, BsEyeSlash } from "react-icons/bs";

// Helper function to highlight matching terms
const highlightMatch = (text, searchTerm) => {
  if (!searchTerm) return text; // If no search term, return the original text
  const regex = new RegExp(`(${searchTerm})`, "gi"); // Case-insensitive match
  const parts = text.split(regex); // Split the text into matching and non-matching parts

  return parts.map((part, index) =>
    regex.test(part) ? <mark key={index}>{part}</mark> : part
  );
};

const AllUsers = () => {
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [dialogData, setDialogData] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeletedUsers, setShowDeletedUsers] = useState(false);
  const [showBannedUsers, setShowBannedUsers] = useState(false);
  const [bannedUsers, setBannedUsers] = useState([]);

  const loadUsers = async () => {
    setLoading(true);
    setError(false);

    try {
      const result = await fetchAllUsers();
      if (result.error) {
        setError(true);
        toast.error(result.error);
      } else {
        // sort to newest first
        const sortedUsers = result.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        setUsers(sortedUsers);
      }
    } catch (e) {
      setError(true);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // get banned users
  const getBannedUsers = async () => {
    try {
      setLoading(true);

      const result = await fetchBannedUsers();
      if (result.error) {
        setError(true);
        toast.error(result.error);
      } else {
        const sortedUsers = result.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        setBannedUsers(sortedUsers);
      }
    } catch (e) {
      setError(true);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    getBannedUsers();
  }, []);

  const newUser = () => {
    setDialogData(null);
    setDialogOpen(true);
  };

  const editUser = (user) => {
    setDialogData(user);
    setDialogOpen(true);
  };

  // Helper function: Normalize strings (remove extra spaces and convert to lowercase)
  const normalize = (str) => str?.toLowerCase().replace(/\s+/g, "").trim();

  // Filter and search logic
  const filteredUsers = useMemo(() => {
    const term = normalize(searchTerm);

    return users?.filter((user) => {
      const isDeleted = !!user.deleted_at;

      return (
        !term ||
        normalize(user.first_name + user.last_name).includes(term) ||
        normalize(user.role).includes(term) ||
        normalize(user.email).includes(term) ||
        normalize(String(user.id)).includes(term) ||
        user.platforms.some((platform) =>
          normalize(platform.name).includes(term)
        ) ||
        (user.gamer_tag && normalize(user.gamer_tag).includes(term)) ||
        ("deleted-banned".includes(term) && isDeleted) ||
        (user.locked_by_admin && "locked".includes(term))
      );
    });
  }, [users, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <h1 className="text-xl font-semibold">All Users ({users?.length})</h1>

        <button
          onClick={newUser}
          disabled={loading}
          className="bg-Gold/60 hover:bg-Gold/80 border border-black rounded-lg p-2 flex items-center justify-center gap-2 w-fit mt-6 backdrop-blur-sm disabled:bg-gray-500/20"
        >
          <BiPlus className="h-5 w-5" />
          New User
        </button>
      </div>

      {loading && <BiLoader className="h-8 w-8 animate-spin mx-auto" />}

      {error && (
        <p className="w-fit bg-red-500/50 p-4 rounded-lg mx-auto flex items-center justify-center gap-2">
          <IoWarning className="h-5 w-5 mr-2" />
          Failed to load users. Please try again!
          {/* reload */}
          <button
            onClick={() => {
              loadUsers();
              getBannedUsers();
            }}
            className="p-2 rounded-lg bg-white/10"
          >
            Reload
          </button>
        </p>
      )}

      {!loading &&
        !error &&
        (users?.length < 1 ? (
          <p className="text-center w-full">No users have been added yet!</p>
        ) : (
          users?.length > 0 && (
            <>
              <div className="flex flex-wrap items-center gap-4">
                <input
                  type="text"
                  autoFocus
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search users..."
                  className="flex-1 min-w-fit p-2 rounded-lg bg-white/10 border border-white/10 hover:border-white/20"
                />

                <div className="w-full flex gap-2 flex-wrap">
                  {/* show deleted users */}
                  <button
                    onClick={() => setShowDeletedUsers(!showDeletedUsers)}
                    disabled={loading}
                    className="border border-white/10 rounded-lg p-2 w-fit hover:bg-white/10 disabled:bg-gray-500/20 flex items-center justify-center gap-2"
                  >
                    {showDeletedUsers ? (
                      <BsEyeSlash className="h-5 w-5 text-white/80" />
                    ) : (
                      <BsEye className="h-5 w-5 text-white/80" />
                    )}{" "}
                    Deleted Users
                  </button>

                  {/* show banned users */}
                  {bannedUsers?.length > 0 && (
                    <button
                      onClick={() => setShowBannedUsers(!showBannedUsers)}
                      disabled={loading}
                      className="border border-white/10 rounded-lg p-2 w-fit hover:bg-white/10 disabled:bg-gray-500/20 flex items-center justify-center gap-2"
                    >
                      {showBannedUsers ? (
                        <BsEyeSlash className="h-5 w-5 text-white/80" />
                      ) : (
                        <BsEye className="h-5 w-5 text-white/80" />
                      )}{" "}
                      Banned Users
                    </button>
                  )}
                </div>
              </div>

              {/* deleted users list */}
              {showDeletedUsers && (
                <div className="flex flex-wrap gap-6 justify-between">
                  {filteredUsers?.map(
                    (user, index) =>
                      user.deleted_at && (
                        <button
                          key={index}
                          disabled={user?.deleted_at}
                          onClick={() => editUser(user)}
                          className={clsx(
                            "flex justify-between flex-1 min-w-fit flex-wrap-reverse rounded-2xl p-2 px-4 bg-gray-500/20 hover:bg-gray-500/30 gap-2 disabled:cursor-not-allowed",
                            user?.deleted_at &&
                              "bg-red-500/20 hover:bg-red-500/30",
                            user?.locked_by_admin &&
                              "bg-blue-500/20 hover:bg-blue-500/30"
                          )}
                          style={{
                            backgroundColor:
                              user?.locked_by_admin && "#3b82f650",
                          }}
                        >
                          <div className="flex flex-wrap gap-4">
                            <div className="flex max-w-[200px] w-fit mx-auto bg-white/10 rounded-xl p-2">
                              {user.image_url ? (
                                <Image
                                  src={user.image_url || "/logo.svg"}
                                  alt="User Image"
                                  width={150}
                                  height={150}
                                  priority
                                  className="mx-auto w-auto h-auto object-cover rounded-lg"
                                />
                              ) : (
                                <IoMdPerson className="h-28 w-28 rounded-full m-auto" />
                              )}
                            </div>

                            <div className="flex flex-col gap-2 items-start">
                              {user?.deleted_at && (
                                <p className="text-xs break-all flex gap-2 flex-wrap items-center -mt-2">
                                  User is{" "}
                                  {highlightMatch("Deleted", searchTerm)}
                                  <FaDeleteLeft />
                                </p>
                              )}

                              {user?.locked_by_admin && (
                                <p className="text-xs break-all flex gap-2 flex-wrap items-center -mt-2">
                                  User is account{" "}
                                  {highlightMatch("Locked", searchTerm)}
                                  <BiLock />
                                </p>
                              )}

                              <p className="text-lg flex flex-wrap gap-2">
                                <span>
                                  {highlightMatch(user.first_name, searchTerm)}{" "}
                                  {highlightMatch(user.last_name, searchTerm)}
                                  {user.gamer_tag &&
                                    highlightMatch(
                                      " | " + user.gamer_tag,
                                      searchTerm
                                    )}
                                </span>
                                <span className="bg-black/20 px-2 py-1 rounded-md text-sm">
                                  {highlightMatch(user.role, searchTerm)}
                                </span>
                              </p>

                              <p className="text-sm font-semibold break-all flex items-center gap-2 flex-wrap">
                                <span>Platforms:</span>
                                {user.platforms.length < 1 ? (
                                  <span className="bg-black/20 px-2 py-1 rounded-md">
                                    N/A
                                  </span>
                                ) : (
                                  user.platforms.map((platform, index) => (
                                    <span
                                      key={index}
                                      className="bg-black/20 px-2 py-1 rounded-md"
                                    >
                                      {highlightMatch(
                                        platform.name,
                                        searchTerm
                                      )}
                                    </span>
                                  ))
                                )}
                              </p>

                              <p className="text-sm font-semibold break-all flex flex-wrap gap-2">
                                Preferred Skill Masters:{" "}
                                {user.preferred_skill_master_ids.length < 1 ? (
                                  <span className="bg-black/20 px-2 py-1 rounded-md">
                                    N/A
                                  </span>
                                ) : (
                                  user.preferred_skill_master_ids.map(
                                    (skillMaster, index) => (
                                      <span
                                        key={index}
                                        className="bg-black/20 px-2 py-1 rounded-md"
                                      >
                                        {highlightMatch(
                                          skillMaster.name,
                                          searchTerm
                                        )}
                                      </span>
                                    )
                                  )
                                )}
                              </p>

                              <div className="flex flex-wrap gap-2">
                                <span className="bg-black/20 px-2 py-1 rounded-md text-sm">
                                  ID:{" "}
                                  {highlightMatch(
                                    user.id.toString(),
                                    searchTerm
                                  )}
                                </span>

                                <p className="text-sm font-semibold break-all border border-white/10 rounded-lg px-2 py-1">
                                  {highlightMatch(user.email, searchTerm)}
                                </p>
                              </div>

                              <div className="flex flex-wrap gap-x-4 gap-y-2 items-center justify-between">
                                <p className="text-xs break-all">
                                  Created At:{" "}
                                  {user.created_at
                                    ? new Intl.DateTimeFormat("en-US", {
                                        dateStyle: "medium",
                                        timeStyle: "short",
                                      }).format(new Date(user.created_at))
                                    : "Not set"}
                                </p>

                                {user.deleted_at && (
                                  <p className="text-xs break-all">
                                    Deleted At:{" "}
                                    {user.deleted_at
                                      ? new Intl.DateTimeFormat("en-US", {
                                          dateStyle: "medium",
                                          timeStyle: "short",
                                        }).format(new Date(user.deleted_at))
                                      : "Not set"}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          <BiPencil className="h-8 w-8 ml-auto mb-auto hover:bg-white/10 rounded-lg p-2" />
                        </button>
                      )
                  )}
                </div>
              )}

              {/* banned users email list */}
              {showBannedUsers && (
                <div className="flex flex-wrap gap-4 justify-between items-start">
                  {bannedUsers?.map((user, index) => (
                    <button
                      key={index}
                      className={clsx(
                        "flex-1 min-w-fit rounded-lg p-2 px-4 bg-gray-500/50 gap-2 flex flex-col text-start"
                      )}
                    >
                      <p>{user.email}</p>
                      <p className="text-xs">{user.created_at}</p>
                    </button>
                  ))}
                </div>
              )}

              {/* all users list */}
              <div className="flex flex-wrap gap-6 justify-between">
                {!loading &&
                  !error &&
                  filteredUsers?.map(
                    (user, index) =>
                      !user.deleted_at && (
                        <button
                          key={index}
                          disabled={user?.deleted_at}
                          onClick={() => editUser(user)}
                          className={clsx(
                            "flex justify-between flex-1 min-w-fit flex-wrap-reverse rounded-2xl p-2 px-4 bg-gray-500/20 hover:bg-gray-500/30 gap-2 disabled:cursor-not-allowed",
                            user?.deleted_at &&
                              "bg-red-500/20 hover:bg-red-500/30",
                            user?.locked_by_admin &&
                              "bg-blue-500/20 hover:bg-blue-500/30"
                          )}
                          style={{
                            backgroundColor:
                              user?.locked_by_admin && "#3b82f650",
                          }}
                        >
                          <div className="flex flex-wrap gap-4">
                            <div className="flex max-w-[200px] w-fit mx-auto bg-white/10 rounded-xl p-2">
                              {user.image_url ? (
                                <Image
                                  src={user.image_url || "/logo.svg"}
                                  alt="User Image"
                                  width={150}
                                  height={150}
                                  priority
                                  className="mx-auto w-auto h-auto object-cover rounded-lg"
                                />
                              ) : (
                                <IoMdPerson className="h-28 w-28 rounded-full m-auto" />
                              )}
                            </div>

                            <div className="flex flex-col gap-2 items-start">
                              {user?.deleted_at && (
                                <p className="text-xs break-all flex gap-2 flex-wrap items-center -mt-2">
                                  User is{" "}
                                  {highlightMatch("Deleted", searchTerm)}
                                  <FaDeleteLeft />
                                </p>
                              )}

                              {user?.locked_by_admin && (
                                <p className="text-xs break-all flex gap-2 flex-wrap items-center -mt-2">
                                  User is account{" "}
                                  {highlightMatch("Locked", searchTerm)}
                                  <BiLock />
                                </p>
                              )}

                              <p className="text-lg flex flex-wrap gap-2">
                                <span>
                                  {highlightMatch(user.first_name, searchTerm)}{" "}
                                  {highlightMatch(user.last_name, searchTerm)}
                                  {user.gamer_tag &&
                                    highlightMatch(
                                      " | " + user.gamer_tag,
                                      searchTerm
                                    )}
                                </span>
                                <span className="bg-black/20 px-2 py-1 rounded-md text-sm">
                                  {highlightMatch(user.role, searchTerm)}
                                </span>
                              </p>

                              <p className="text-sm font-semibold break-all flex items-center gap-2 flex-wrap">
                                <span>Platforms:</span>
                                {user.platforms.length < 1 ? (
                                  <span className="bg-black/20 px-2 py-1 rounded-md">
                                    N/A
                                  </span>
                                ) : (
                                  user.platforms.map((platform, index) => (
                                    <span
                                      key={index}
                                      className="bg-black/20 px-2 py-1 rounded-md"
                                    >
                                      {highlightMatch(
                                        platform.name,
                                        searchTerm
                                      )}
                                    </span>
                                  ))
                                )}
                              </p>

                              <p className="text-sm font-semibold break-all flex flex-wrap gap-2">
                                Preferred Skill Masters:{" "}
                                {user.preferred_skill_master_ids.length < 1 ? (
                                  <span className="bg-black/20 px-2 py-1 rounded-md">
                                    N/A
                                  </span>
                                ) : (
                                  user.preferred_skill_master_ids.map(
                                    (skillMaster, index) => (
                                      <span
                                        key={index}
                                        className="bg-black/20 px-2 py-1 rounded-md"
                                      >
                                        {highlightMatch(
                                          skillMaster.name,
                                          searchTerm
                                        )}
                                      </span>
                                    )
                                  )
                                )}
                              </p>

                              <div className="flex flex-wrap gap-2">
                                <span className="bg-black/20 px-2 py-1 rounded-md text-sm">
                                  ID:{" "}
                                  {highlightMatch(
                                    user.id.toString(),
                                    searchTerm
                                  )}
                                </span>

                                <p className="text-sm font-semibold break-all border border-white/10 rounded-lg px-2 py-1">
                                  {highlightMatch(user.email, searchTerm)}
                                </p>
                              </div>

                              <div className="flex flex-wrap gap-x-4 gap-y-2 items-center justify-between">
                                <p className="text-xs break-all">
                                  Created At:{" "}
                                  {user.created_at
                                    ? new Intl.DateTimeFormat("en-US", {
                                        dateStyle: "medium",
                                        timeStyle: "short",
                                      }).format(new Date(user.created_at))
                                    : "Not set"}
                                </p>

                                {user.deleted_at && (
                                  <p className="text-xs break-all">
                                    Deleted At:{" "}
                                    {user.deleted_at
                                      ? new Intl.DateTimeFormat("en-US", {
                                          dateStyle: "medium",
                                          timeStyle: "short",
                                        }).format(new Date(user.deleted_at))
                                      : "Not set"}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          <BiPencil className="h-8 w-8 ml-auto mb-auto hover:bg-white/10 rounded-lg p-2" />
                        </button>
                      )
                  )}
              </div>
            </>
          )
        ))}

      {/* Dialog Component */}
      <UserDialog
        dialogData={dialogData}
        dialogOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        loadUsers={loadUsers}
      />
    </div>
  );
};

export default AllUsers;
