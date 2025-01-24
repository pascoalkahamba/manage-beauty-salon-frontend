"use client";

import ServiceCard from "@/components/ServiceCard";

export default function DashboardChild() {
  return (
    <div className="flex items-center gap-3 w-full mt-10 flex-wrap justify-center">
      <ServiceCard />
      <ServiceCard />
      <ServiceCard />
      <ServiceCard />
      <ServiceCard />
      <ServiceCard />
    </div>
  );
}
