"use client";
import "@mantine/carousel/styles.css";
import "@mantine/dates/styles.css";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import AOS from "aos";
import { useEffect } from "react";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  const queryClient = new QueryClient();

  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <section>{children}</section>
    </QueryClientProvider>
  );
}
