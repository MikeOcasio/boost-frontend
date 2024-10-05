"use client";

import { Field, Input, Label } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { BiLoader } from "react-icons/bi";
import toast from "react-hot-toast";

import { loginUser } from "@/lib/actions";
import { useUserStore } from "@/store/use-user";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { userToken, setUserToken } = useUserStore();

  useEffect(() => {
    if (userToken) {
      router.push("/");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await loginUser(email, password);

      if (response.error) {
        toast.error(response.error);
      } else {
        setUserToken(response.token);

        toast.success("Login successful!");
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
    <div className="mt-16 max-w-7xl mx-auto min-h-screen p-4 flex flex-1 flex-col justify-center gap-6">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Image
          alt="Raven Boost"
          src="/logo.svg"
          width={150}
          height={150}
          className="mx-auto"
        />
        <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-Gold">
          Login to your account
        </h2>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field className="flex flex-col gap-1 w-full">
            <Label className="text-sm">Email</Label>
            <Input
              type="text"
              placeholder="Email"
              autoFocus
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>

          <div className="flex flex-col gap-1 w-full">
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
              type="button"
              className="text-end text-sm text-blue-600 hover:text-blue-500"
            >
              Forgot your password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center rounded-md bg-Gold px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-Gold/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-Gold gap-2 items-center"
          >
            {loading && <BiLoader className="h-5 w-5 animate-spin" />}
            LOGIN
          </button>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Not a member?{" "}
          <Link
            href="/signin"
            className="font-semibold leading-6 text-blue-600 hover:text-blue-500"
          >
            create an account
          </Link>
        </p>
      </div>
    </div>
  );
}