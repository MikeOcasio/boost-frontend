import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export function Layout({ children }) {
  return (
    <div>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
