"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BiCopy, BiLink, BiLoader, BiShield } from "react-icons/bi";
import { PassCodeScreen } from "./PassCodeScreen";
import toast from "react-hot-toast";
import clsx from "clsx";
import Link from "next/link";
import { getOtpOnEmail } from "@/lib/actions/user-actions";

export const QrCodeDialog = ({
  dialogOpen,
  onClose,
  email,
  password,
  dialogData,
  rememberMe,
}) => {
  const [passCodeScreen, setPassCodeScreen] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState("email");
  const [loading, setLoading] = useState(false);

  const qrCodeBase64 = dialogData?.qr_code
    ? `data:image/svg+xml;base64,${btoa(dialogData?.qr_code)}`
    : null;

  useEffect(() => {
    if (dialogOpen) {
      !dialogData.qr_code && setPassCodeScreen(true);
    }
  }, [dialogData?.qr_code, dialogOpen, passCodeScreen]);

  const handleEmailVerification = async () => {
    setLoading(true);

    try {
      const res = await getOtpOnEmail(email);

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("OTP sent to your email");
        setPassCodeScreen(true);
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={dialogOpen}
      onClose={() => {}}
      as="div"
      className="relative z-50 text-white"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-xl rounded-lg bg-Plum/50 backdrop-blur-lg p-6 space-y-4 relative">
          <DialogTitle className="text-lg font-semibold">
            {passCodeScreen && "Verify your account"}
          </DialogTitle>

          {!passCodeScreen && (
            <div className="flex flex-col gap-4 overflow-y-auto max-h-[80vh] no-scrollbar">
              <div className="flex items-center justify-center bg-white/10 rounded-lg overflow-hidden">
                <button
                  className={clsx(
                    "flex-1 p-2 rounded-lg",
                    verificationMethod === "email" && "bg-Gold"
                  )}
                  onClick={() => setVerificationMethod("email")}
                >
                  Verify with Email
                </button>

                <button
                  className={clsx(
                    "flex-1 p-2 rounded-lg",
                    verificationMethod === "qr_code" && "bg-Gold"
                  )}
                  onClick={() => setVerificationMethod("qr_code")}
                >
                  Scan QR Code
                </button>
              </div>

              {verificationMethod === "qr_code" && (
                <div className="flex flex-col gap-4">
                  <Link
                    href="https://www.authy.com/download/"
                    target="_blank"
                    className="p-2 px-4 bg-red-500/30 rounded-lg text-center w-fit mx-auto flex items-center justify-center gap-2 hover:bg-white/20"
                  >
                    Get the Authy App to scan the QR code
                    <BiLink className="h-5 w-5 text-white/80" />
                  </Link>

                  <div className="flex items-center justify-center overflow-auto w-fit mx-auto bg-white p-4 rounded-lg">
                    {qrCodeBase64 && (
                      <Link
                        href="https://www.authy.com/download/"
                        target="_blank"
                      >
                        <Image
                          src={qrCodeBase64}
                          alt="QR Code"
                          width={300}
                          height={300}
                          className="max-w-full h-auto object-contain"
                        />
                      </Link>
                    )}
                  </div>

                  {dialogData?.otp_secret && (
                    <div className="text-center space-y-2 text-sm">
                      <p>
                        Having trouble with the QR code? Enter it manually using
                        this secret
                      </p>

                      <p
                        className="p-2 bg-white/10 w-fit flex items-center justify-center rounded-lg cursor-pointer mx-auto gap-2 hover:bg-white/20"
                        onClick={() => {
                          navigator.clipboard.writeText(dialogData?.otp_secret);
                          toast.success("Copied to clipboard");
                        }}
                      >
                        <BiCopy className="h-5 w-5 text-white/80" />
                        {dialogData?.otp_secret}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="text-xs text-white/80 flex gap-2">
                <BiShield className="h-5 w-5 text-green-500" />
                <span className="font-semibold flex-1">
                  Our platform requires two-factor authentication (2FA) by
                  default to protect your account and sensitive information,
                  supporting Authy and Google Authenticator.
                </span>
              </div>
              <div className="text-xs text-white/80 flex gap-2">
                <BiShield className="h-5 w-5 text-green-500" />
                <span className="font-semibold flex-1">
                  2FA adds an extra layer of security, ensuring only you can
                  access your account, even if your password is compromised
                </span>
              </div>

              {verificationMethod === "email" && (
                <div className="flex flex-col items-center justify-center bg-white/10 p-6 rounded-xl gap-4">
                  <p className="text-xl font-semibold">
                    Get the OTP to your Email
                  </p>

                  <button
                    onClick={handleEmailVerification}
                    disabled={loading}
                    className="bg-Gold p-2 px-6 rounded-lg hover:bg-Gold/60 font-bold flex justify-center items-center gap-2 disabled:bg-gray-500/20"
                  >
                    {loading && <BiLoader className="h-5 w-5 animate-spin" />}
                    Get OTP
                  </button>
                </div>
              )}

              {/* Continue to Verify */}
              {verificationMethod !== "email" && (
                <button
                  onClick={() => setPassCodeScreen(true)}
                  className="bg-Gold/80 p-2 rounded-lg hover:bg-Gold/60 disabled:bg-gray-500/20 flex-1"
                >
                  Continue to Verify
                </button>
              )}
            </div>
          )}

          {passCodeScreen && (
            <PassCodeScreen
              onClose={onClose}
              setPassCodeScreen={setPassCodeScreen}
              email={email}
              password={password}
              dialogData={dialogData}
              rememberMe={rememberMe}
            />
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
};
