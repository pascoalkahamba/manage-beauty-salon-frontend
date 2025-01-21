"use client";
import "@mantine/core/styles.css";
import "@/app/main.css";
import "@mantine/carousel/styles.css";
import "@mantine/notifications/styles.css";
import "aos/dist/aos.css";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { MantineProvider } from "@mantine/core";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MantineProvider defaultColorScheme="dark">
      <ModalsProvider labels={{ confirm: "Submit", cancel: "Cancel" }}>
        <Notifications />
        {children}
      </ModalsProvider>
    </MantineProvider>
  );
}
