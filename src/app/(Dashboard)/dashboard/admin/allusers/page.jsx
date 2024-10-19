"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiLoader, BiPencil, BiPlus } from "react-icons/bi";
import { IoWarning } from "react-icons/io5";
import Image from "next/image";
import { IoMdPerson } from "react-icons/io";
import clsx from "clsx";
import { FaDeleteLeft } from "react-icons/fa6";

import { fetchAllUsers } from "@/lib/actions/user-actions";
import { UserDialog } from "../_components/UserDialog";

const AllUsers = () => {
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [dialogData, setDialogData] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");

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

  useEffect(() => {
    loadUsers();
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
  const filteredUsers = users?.filter((user) => {
    const term = normalize(searchTerm);
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
      ("deleted-banned".includes(term) && isDeleted)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <h1 className="text-xl font-semibold">All Users</h1>

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
              </div>

              <div className="flex flex-wrap gap-4 justify-between">
                {!loading &&
                  !error &&
                  filteredUsers?.map((user, index) => (
                    <button
                      key={index}
                      disabled={user?.deleted_at}
                      onClick={() => editUser(user)}
                      className={clsx(
                        "flex justify-between items-end flex-1 min-w-fit flex-wrap-reverse rounded-lg p-2 px-4 bg-gray-500/20 hover:bg-gray-500/30 gap-2 disabled:cursor-not-allowed",
                        user?.deleted_at && "bg-red-500/20 hover:bg-red-500/30"
                      )}
                    >
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex max-h-[200px] mx-auto bg-white/10 rounded-lg p-2">
                          {user.image_url ? (
                            <Image
                              src={user.image_url || "/logo.svg"}
                              alt="User Image"
                              width={150}
                              height={150}
                              className="mx-auto h-full object-contain rounded-lg"
                            />
                          ) : (
                            <IoMdPerson className="h-28 w-28 rounded-full mx-auto" />
                          )}
                        </div>

                        <div className="flex flex-col gap-2 items-start">
                          {user?.deleted_at && (
                            <p className="text-xs break-all flex gap-2 flex-wrap items-center -mt-2">
                              User is Deleted
                              <FaDeleteLeft />
                            </p>
                          )}

                          <p className="text-lg flex flex-wrap gap-2">
                            <span>
                              {user.first_name} {user.last_name}{" "}
                              {user.gamer_tag && `(${user.gamer_tag})`}
                            </span>
                            <span className="bg-black/20 px-2 py-1 rounded-md text-sm">
                              {user.role}
                            </span>
                          </p>

                          <p className="text-sm font-semibold break-all flex items-center gap-2 flex-wrap">
                            <span>Platforms:</span>
                            {user.platforms.length < 1 ? (
                              <span className="bg-black/20 px-2 py-1 rounded-md">
                                N/A
                              </span>
                            ) : (
                              user.platforms.map((platform) => (
                                <span className="bg-black/20 px-2 py-1 rounded-md">
                                  {platform.name}
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
                                (skillMaster) => (
                                  <span className="bg-black/20 px-2 py-1 rounded-md">
                                    {skillMaster.name}
                                    name
                                  </span>
                                )
                              )
                            )}
                          </p>

                          <div className="flex flex-wrap gap-2">
                            <span className="bg-black/20 px-2 py-1 rounded-md text-sm">
                              ID: {user.id}
                            </span>

                            <p className="text-sm font-semibold break-all border border-white/10 rounded-lg px-2 py-1">
                              {user.email}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-x-4 gap-y-2 items-center justify-between">
                            <p className="text-xs break-all">
                              Created At:{" "}
                              {new Date(user.created_at).toLocaleString()}
                            </p>

                            {user.deleted_at && (
                              <p className="text-xs break-all">
                                Deleted At:{" "}
                                {new Date(user.deleted_at).toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <BiPencil className="h-8 w-8 ml-auto hover:bg-white/10 rounded-lg p-2" />
                    </button>
                  ))}
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
