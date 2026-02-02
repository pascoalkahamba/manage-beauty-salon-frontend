import CardsCarousel from "@/components/CardsCarousel";
import DashboardChild from "@/components/DashboardChild";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Salão de Beleza | Pagina Inicial",
  description: "Page to user creates your account on the website.",
};

export default function Dashboard() {
  return (
    <section className="flex flex-col gap-3 justify-center items-center w-full px-2">
      <CardsCarousel />
      <DashboardChild />
    </section>
  );
}
