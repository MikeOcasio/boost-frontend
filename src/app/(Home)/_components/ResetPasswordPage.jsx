"use client";

import { doesUserExist, resetUserPassword } from "@/lib/actions/user-actions";
import { useUserStore } from "@/store/use-user";
import { Field, Input, Label } from "@headlessui/react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiLoader } from "react-icons/bi";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;

const ResetPasswordPage = () => {
  const router = useRouter();
  const searchParam = useSearchParams();
  const token = searchParam.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { removeToken } = useUserStore();

  const verifyForgotUserToken = useCallback(async () => {
    try {
      setLoading(true);

      const forgotUserToken = localStorage.getItem("forgotUserToken");

      const forgotUserEmail = CryptoJS.AES.decrypt(
        forgotUserToken,
        SECRET_KEY
      ).toString(CryptoJS.enc.Utf8);

      // check if the email exists in the database
      const response = await doesUserExist(forgotUserEmail);

      if (response.error) {
        removeToken();
        router.push("/login");
        toast.error(response.error);
      }
    } catch (error) {
      // console.log("Error fetching current user:", error.message);

      removeToken();
      router.push("/login");
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [removeToken, router]);

  useEffect(() => {
    verifyForgotUserToken();
  }, [verifyForgotUserToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!password || !confirmPassword) {
      toast.error("Password is missing");
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
      const response = await resetUserPassword({ password, token });

      if (response.error) {
        toast.error(response.error || "Error resetting password!");
      } else {
        localStorage.removeItem("forgotUserToken");
        removeToken();
        toast.success("Password reset successfully!");
        router.push("/login");
      }
    } catch (error) {
      // console.log("Error logging in user:", error.message);
      toast.error(error.message);
    } finally {
      setPassword("");
      setConfirmPassword("");
      setShowPassword(false);
      setShowConfirmPassword(false);
      setLoading(false);
    }
  };

  return (
    <div className="mt-16 max-w-7xl mx-auto min-h-[92vh] p-4 flex flex-1 flex-col justify-center gap-6">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Image
          alt="Raven Boost"
          src="/logo.svg"
          width={150}
          height={150}
          className="mx-auto"
        />
        <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-Gold">
          Reset your password
        </h2>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* password */}
          <Field className="flex flex-col gap-1 w-full">
            <Label className="text-sm">New Password</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
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
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
