"use client";

import { Field, Input, Label } from "@headlessui/react";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { BiLoader, BiUpload } from "react-icons/bi";
import toast from "react-hot-toast";
import { IoMdClose } from "react-icons/io";
import { createUser } from "@/lib/actions";

export default function SignIn() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const response = await createUser({
        firstName,
        lastName,
        email,
        password,
        image,
      });

      console.log("response", response);

      if (response.error) {
        // toast.error(response.error);
        toast.error("Error signing in user!");
      } else {
        toast.success("Sign in successful!");
        router.push("/");
      }
    } catch (error) {
      console.log("Error logging in user:", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-16 min-h-screen p-4 flex flex-col justify-center items-center gap-6">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Image
          alt="Raven Boost"
          src="/logo.svg"
          width={150}
          height={150}
          className="mx-auto"
        />
        <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-Gold">
          Create new account
        </h2>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* image upload */}
          {image ? (
            <div className="space-y-2 bg-white/10 p-4 rounded-lg border border-white/10 hover:border-white/20">
              <p>Profile Image</p>
              <div className="group relative cursor-pointer rounded-lg w-fit mx-auto">
                <Image
                  src={image}
                  alt="Profile Image"
                  width={150}
                  height={150}
                  className="mx-auto rounded-lg object-cover bg-white/10"
                />
                <IoMdClose
                  type="button"
                  className="h-8 w-8 group-hover:opacity-100 opacity-0 absolute top-0 right-0 p-2 m-2 hover:bg-black rounded-lg border border-white/10 bg-black/80"
                  onClick={() => setImage(null)}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2 justify-center w-full">
              <label htmlFor="dropzone-file">Profile Image</label>
              <label
                for="dropzone-file"
                className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-800/10 border-gray-600 hover:border-gray-500"
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
                        setImage(reader.result);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            </div>
          )}

          {/* first name & last name */}
          <div className="flex flex-wrap gap-4 w-full">
            <Field className="flex flex-col gap-1 flex-1">
              <Label className="text-sm">First Name</Label>
              <Input
                type="text"
                placeholder="Jone"
                autoFocus
                className="input-field"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Field>

            <Field className="flex flex-col gap-1 flex-1">
              <Label className="text-sm">Last Name</Label>
              <Input
                type="text"
                placeholder="Doe"
                className="input-field"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </Field>
          </div>

          {/* email */}
          <Field className="flex flex-col gap-1 w-full">
            <Label className="text-sm">Email</Label>
            <Input
              type="text"
              placeholder="Email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>

          {/* password */}
          <Field className="flex flex-col gap-1 w-full">
            <Label className="text-sm">Password</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="input-field w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center rounded-md bg-Gold px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-Gold/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-Gold gap-2 items-center"
          >
            {loading && <BiLoader className="h-5 w-5 animate-spin" />}
            Sign in
          </button>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Already a member?{" "}
          <Link
            href="/login"
            className="font-semibold leading-6 text-blue-600 hover:text-blue-500"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
