import { loginUser, verifyQrCode } from "@/lib/actions/user-actions";
import { useUserStore } from "@/store/use-user";
import { useRouter } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";

export const PassCodeScreen = ({
  onClose,
  setPassCodeScreen,
  email,
  password,
  dialogData,
  rememberMe,
}) => {
  const { setUserToken } = useUserStore();
  const router = useRouter();

  const inputRefs = useRef([]);

  const [passcode, setPasscode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  //   login with passcode
  const handleVerifyPasscode = async (e) => {
    e.preventDefault();

    if (passcode.every((digit) => digit === "")) {
      toast.error("Please enter a passcode");
      return;
    }

    // verify qr code passcode
    try {
      setLoading(true);

      const response = await verifyQrCode(passcode.join(""), dialogData.token);

      if (response.error) {
        toast.error(response.error);
        return;
      }
    } catch (error) {
      console.log("Error verifying QR code:", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }

    // login user with passcode
    try {
      setLoading(true);

      const response = await loginUser({
        passcode: passcode.join(""),
        email,
        password,
        rememberMe,
      });

      if (response.error) {
        toast.error(response.error);
      } else {
        setUserToken(response.token);

        toast.success("Passcode verified successfully!");
        setPassCodeScreen(false);
        onClose();

        router.push("/");
      }
    } catch (error) {
      console.log("Error verifying QR code:", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    if (value.length <= 1) {
      const newPasscode = [...passcode];
      newPasscode[index] = value;
      setPasscode(newPasscode);

      // Move to next input if value is entered
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !passcode[index] && index > 0) {
      // Move to previous input on backspace if current input is empty
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const newPasscode = [...passcode];

    [...pastedData].forEach((char, index) => {
      if (index < 6) {
        newPasscode[index] = char;
      }
    });

    setPasscode(newPasscode);
  };

  return (
    <form className="flex flex-col gap-4">
      <p className="text-sm -mt-2">
        Enter the 6-digit passcode shown on your authentication app to continue.
      </p>

      {/* Passcode Field */}
      <div className="flex gap-2 mb-4 mx-auto flex-wrap justify-center">
        {passcode.map((digit, index) => (
          <div key={index} className="flex items-center">
            {index === 3 && (
              <span
                key={`separator-${index}`}
                className="w-5 h-1.5 bg-white/10 rounded-lg m-auto hidden sm:block mr-2"
              />
            )}

            <input
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) =>
                handleChange(index, e.target.value.replace(/\D/g, ""))
              }
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="bg-white/10 sm:w-12 sm:h-16 w-8 h-12 text-center border-2 border-white/10 rounded-lg focus:border-Gold/50 focus:outline-none text-xl"
            />
          </div>
        ))}
      </div>

      {/* Continue Button */}
      <button
        type="submit"
        onClick={handleVerifyPasscode}
        disabled={!passcode.every((digit) => digit !== "")}
        className="bg-Gold/80 p-2 rounded-lg hover:bg-Gold/60 disabled:bg-gray-500/20 flex-1"
      >
        {loading ? "Verifying..." : "Verify Passcode"}
      </button>

      {/* Go back button */}
      {dialogData?.qr_code && (
        <button
          type="button"
          onClick={() => setPassCodeScreen(false)}
          className="text-xs hover:underline"
        >
          Go back to QR Code
        </button>
      )}
    </form>
  );
};

export default PassCodeScreen;
