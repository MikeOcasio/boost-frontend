import { Suspense } from "react";
import ThankyouPage from "../_components/ThankyouPage";
import { BiLoader } from "react-icons/bi";

const Thankyou = () => {
  return (
    <Suspense
      fallback={
        <div className="pt-24 max-w-[1920px] mx-auto min-h-screen flex flex-col items-center justify-center gap-6 p-4">
          <BiLoader className="h-8 w-8 animate-spin mx-auto" />
        </div>
      }
    >
      <ThankyouPage />
    </Suspense>
  );
};

export default Thankyou;
