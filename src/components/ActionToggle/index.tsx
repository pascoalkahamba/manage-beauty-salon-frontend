"use client";

import { IconMoon, IconSun } from "@tabler/icons-react";
import cx from "clsx";
import {
  ActionIcon,
  Group,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import classes from "@/components/ActionToggle/styles.module.css";

export default function ActionToggle() {
  const { setColorScheme, colorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  console.log("colorScheme", colorScheme);

  return (
    <Group justify="center">
      <ActionIcon
        onClick={() =>
          setColorScheme(computedColorScheme === "light" ? "dark" : "light")
        }
        variant="default"
        size="xl"
        aria-label="Toggle color scheme"
      >
        {colorScheme === "dark" ? (
          <IconSun className={cx(classes.icon, classes.light)} stroke={1.5} />
        ) : (
          <IconMoon className={cx(classes.icon, classes.dark)} stroke={1.5} />
        )}
      </ActionIcon>
    </Group>
  );
}
