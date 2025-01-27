import Footer from "@/components/Footer";
import Header from "@/components/Header";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <section className="w-full mt-28">
      <Header />
      {children}
      <Footer />
    </section>
  );
}
