"use client";

import { Field, Input, Label } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { BiLoader } from "react-icons/bi";
import toast from "react-hot-toast";

import { useUserStore } from "@/store/use-user";
import { createUser, loginUser } from "@/lib/actions/user-actions";
import { QrCodeDialog } from "../_components/QrCodeDialog";

export default function SignIn() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState(null);

  const { userToken } = useUserStore();

  useEffect(() => {
    if (userToken) {
      router.push("/");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstName || !email || !password || !confirmPassword) {
      toast.error("All fields are required.");
      return;
    }

    // Password complexity check: 8 characters, at least one uppercase, one special character
    const passwordComplexityRegex = /^(?=.*[A-Z])(?=.*[!@#$&*]).{8,}$/;
    if (!passwordComplexityRegex.test(password)) {
      toast.error(
        "Password must be at least 8 characters long, include one uppercase letter, and one special character."
      );
      return;
    }

    // Confirm password check
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await createUser({
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
      });

      if (response.error) {
        toast.error("Error signing in user!");
      } else {
        fetchQrCode();
      }
    } catch (error) {
      console.log("Error logging in user:", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchQrCode = async () => {
    if (!email || !password) {
      toast.error("Email or password is missing");
      return;
    }

    try {
      setLoading(true);

      const response = await loginUser({ email, password });

      if (response.error) {
        toast.error(response.error);
      } else {
        setDialogData(response);
        setDialogOpen(true);
      }
    } catch (error) {
      console.log("Error fetching QR code:", error.message);
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
          {/* first name & last name */}
          <div className="flex flex-wrap gap-4 w-full">
            <Field className="flex flex-col gap-1 flex-1">
              <Label className="text-sm">First Name</Label>
              <Input
                type="text"
                placeholder="Jone"
                autoFocus
                required
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
              required
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
                required
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

          {/* confirm password */}
          <Field className="flex flex-col gap-1 w-full">
            <Label className="text-sm">Confirm password</Label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                className="input-field w-full"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <button
                type="button"
                className="absolute right-1 top-1/2 h-7 w-8 p-1.5 rounded-lg hover:bg-white/10 -translate-y-1/2 text-gray-400 hover:text-gray-500 flex items-center justify-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <BsEyeSlash /> : <BsEye />}
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

      {/* Qr Code Dialog */}
      <QrCodeDialog
        dialogOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        email={email}
        password={password}
        dialogData={dialogData}
      />
    </div>
  );
}
