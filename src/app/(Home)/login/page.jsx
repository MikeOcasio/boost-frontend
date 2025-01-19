"use client";

import { Field, Input, Label } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { BiLoader } from "react-icons/bi";
import toast from "react-hot-toast";

import {
  getOtpOnEmail,
  getQrCode,
  loginUser,
} from "@/lib/actions/user-actions";
import { useUserStore } from "@/store/use-user";
import { QrCodeDialog } from "../_components/QrCodeDialog";
import { ForgotPasswordDialog } from "../_components/ForgotPasswordDialog";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState(null);
  const [openForgotDialog, setOpenForgotDialog] = useState(false);

  const { userToken } = useUserStore();

  useEffect(() => {
    if (userToken) {
      router.push("/");
    }
  }, [router, userToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!email || !password) {
      toast.error("Email or password is missing");
      return;
    }

    setLoading(true);

    try {
      const response = await loginUser({ email, password, rememberMe });

      if (response.error === "OTP required") {
        setDialogData(response.res);
        setDialogOpen(true);
        return;
      }

      if (response.error) {
        toast.error(response.error);
      } else if (
        !dialogData?.user?.otp_required_for_login ||
        !dialogData?.user?.otp_setup_complete
      ) {
        const qrCode = await loadQrCode(response.token);

        if (!qrCode.qr_code) {
          await handleEmailVerification();
        }

        setDialogData({
          ...response,
          qr_code: qrCode.qr_code,
          otp_secret: qrCode.otp_secret,
        });

        setDialogOpen(true);
      } else {
        await handleEmailVerification();

        setDialogData(response);
        setDialogOpen(true);
      }
    } catch (error) {
      // console.log("Error logging in user:", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadQrCode = async (token) => {
    try {
      const response = await getQrCode(token);

      if (response.error) {
        toast.error(response.error);
      } else {
        return response;
      }
    } catch (error) {
      // console.log("Error fetching QR code:", error.message);
      toast.error(error.message);
    }
  };

  const handleEmailVerification = async () => {
    setLoading(true);

    try {
      const res = await getOtpOnEmail(email);

      if (res.error) {
        toast.error("Something went wrong. Please try again");
      } else {
        toast.success("OTP sent to your email");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again");
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
              type="email"
              required
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
                  required
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
              onClick={() => setOpenForgotDialog(true)}
              className="text-end text-sm text-blue-600 hover:text-blue-500 w-fit ml-auto"
            >
              Forgot your password?
            </button>
          </div>

          {/* add rember me checkbox */}
          <div className="flex items-center gap-2">
            <input
              id="rememberMe"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-Gold focus:ring-Gold"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="rememberMe" className="text-sm">
              Remember me
            </label>
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
            href="/signup"
            className="font-semibold leading-6 text-blue-600 hover:text-blue-500"
          >
            create an account
          </Link>
        </p>
      </div>

      {/* Qr Code Dialog */}
      <QrCodeDialog
        dialogOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        rememberMe={rememberMe}
        email={email}
        password={password}
        dialogData={dialogData}
      />

      {/* Forgot Password Dialog */}
      <ForgotPasswordDialog
        dialogOpen={openForgotDialog}
        onClose={() => setOpenForgotDialog(false)}
      />
    </div>
  );
}
