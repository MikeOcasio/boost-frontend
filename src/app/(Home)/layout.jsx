import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import VerifyAppStatus from "@/components/verify-app-status";

const HomeLayout = ({ children }) => {
  return (
    <>
      <VerifyAppStatus />
      <Header />
      <main className="text-white">{children}</main>
      <Footer />
    </>
  );
};

export default HomeLayout;
