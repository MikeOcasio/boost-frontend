import { Suspense } from "react";
import { BiLoader } from "react-icons/bi";
import ResetPasswordPage from "../_components/ResetPasswordPage";

const ResetPassword = () => {
  return (
    <Suspense
      fallback={
        <div className="pt-24 max-w-[1920px] mx-auto min-h-screen flex flex-col items-center justify-center gap-6 p-4">
          <BiLoader className="h-8 w-8 animate-spin mx-auto" />
        </div>
      }
    >
      <ResetPasswordPage />
    </Suspense>
  );
};

export default ResetPassword;
