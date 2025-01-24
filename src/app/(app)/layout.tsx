import Footer from "@/components/Footer";
import Header from "@/components/Header";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <section>
      <Header />
      {children}
      <Footer />
    </section>
  );
}
