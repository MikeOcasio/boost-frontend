"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import Image from "next/image";
import { useState } from "react";
import { BiShield } from "react-icons/bi";
import { PassCodeScreen } from "./PassCodeScreen";

export const LoginPassCodeDialog = ({
  dialogOpen,
  onClose,
  dialogData,
  email,
  password,
}) => {
  return (
    <Dialog
      open={dialogOpen}
      onClose={onClose}
      as="div"
      className="relative z-50 text-white"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-xl rounded-lg bg-Plum/50 backdrop-blur-lg p-6 space-y-4 relative">
          <DialogTitle className="text-lg font-semibold">
            {passCodeScreen ? "Verify your account" : "Scan QR Code"}
          </DialogTitle>

          {!passCodeScreen && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-center overflow-auto w-fit mx-auto bg-white p-4 rounded-lg">
                {qrCodeBase64 && (
                  <Image
                    src={qrCodeBase64}
                    alt="QR Code"
                    width={300}
                    height={300}
                    className="max-w-full h-auto object-contain"
                  />
                )}
              </div>

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

              {/* Continue to Verify */}
              <button
                onClick={() => setPassCodeScreen(true)}
                className="bg-Gold/80 p-2 rounded-lg hover:bg-Gold/60 disabled:bg-gray-500/20 flex-1"
              >
                Continue to Verify
              </button>
            </div>
          )}

          {passCodeScreen && (
            <PassCodeScreen
              onClose={onClose}
              dialogData={dialogData}
              setPassCodeScreen={setPassCodeScreen}
              email={email}
              password={password}
            />
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
};
