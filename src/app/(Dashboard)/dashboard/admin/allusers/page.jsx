"use client";

import { fetchAllUsers } from "@/lib/actions";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { UserDialog } from "../_components/UserDialog";
import { BiLoader, BiPencil, BiPlus } from "react-icons/bi";
import { IoWarning } from "react-icons/io5";
import Image from "next/image";

const AllUsers = () => {
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [dialogData, setDialogData] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    setError(false);

    try {
      const result = await fetchAllUsers();
      if (result.error) {
        setError(true);
        toast.error(result.error);
      } else {
        setUsers(result);
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

      <div className="flex flex-wrap gap-4 justify-between items-center">
        {users?.length < 1 ? (
          <p className="text-center w-full">No users have been added yet!</p>
        ) : (
          !loading &&
          !error &&
          users &&
          [...users, ...users]?.map((user, index) => (
            <button
              key={index}
              onClick={() => editUser(user)}
              className="flex justify-between items-end flex-1 min-w-fit flex-wrap-reverse rounded-lg p-2 px-4 bg-gray-500/20 hover:bg-gray-500/30 gap-2"
            >
              <div className="flex flex-wrap items-center gap-4">
                <Image
                  src={user.image_url || "/logo.svg"}
                  alt="User Image"
                  width={150}
                  height={150}
                  className="rounded-lg bg-black/20"
                />

                <div className="flex flex-col gap-2 items-start">
                  <p className="text-lg">
                    {user.first_name} {user.last_name} |{" "}
                    <span className="bg-black/20 px-2 py-1 rounded-md text-sm">
                      {user.role}
                    </span>
                  </p>

                  <p className="text-sm font-semibold break-all">
                    Platforms:{" "}
                    {user.platforms.map((platform) => (
                      <span className="bg-black/20 px-2 py-1 rounded-md">
                        {platform.name}
                      </span>
                    ))}
                    <span className="bg-black/20 px-2 py-1 rounded-md">PC</span>
                  </p>

                  <p className="text-sm font-semibold break-all flex flex-wrap gap-2">
                    Preferred Skill Masters:{" "}
                    {user.preferred_skill_master_ids.map((skillMaster) => (
                      <span className="bg-black/20 px-2 py-1 rounded-md">
                        {skillMaster.name}
                        name
                      </span>
                    ))}
                    <span className="bg-black/20 px-2 py-1 rounded-md">
                      Nik
                    </span>
                    <span className="bg-black/20 px-2 py-1 rounded-md">
                      Rick
                    </span>
                    <span className="bg-black/20 px-2 py-1 rounded-md">
                      Sick
                    </span>
                  </p>

                  <p className="text-sm font-semibold break-all border border-white/10 rounded-lg px-2 py-1">
                    {user.email}
                  </p>
                  <p className="text-xs break-all">
                    Created At: {new Date(user.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              <BiPencil className="h-8 w-8 ml-auto hover:bg-white/10 rounded-lg p-2" />
            </button>
          ))
        )}
      </div>

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
