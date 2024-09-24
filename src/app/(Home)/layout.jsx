import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

const HomeLayout = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default HomeLayout;
