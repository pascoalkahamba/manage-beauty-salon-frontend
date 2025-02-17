"use client";
import {
  IconBrandInstagram,
  IconBrandTwitter,
  IconBrandYoutube,
} from "@tabler/icons-react";
import { ActionIcon, Anchor, Group } from "@mantine/core";
import classes from "@/components/Footer/styles.module.css";
import { useQuery } from "@tanstack/react-query";
import { getAllCategories } from "@/servers";
import { ICurrentUser } from "@/interfaces";
import ActionToggle from "@/components/ActionToggle";

export default function Footer() {
  const currentUser = JSON.parse(
    localStorage.getItem("userInfo") as string
  ) as ICurrentUser;
  const { data: allCategories } = useQuery({
    queryKey: [`${currentUser?.id}-allCategories`],
    queryFn: getAllCategories,
  });

  const items = allCategories?.map((category) => (
    <Anchor
      c="dimmed"
      key={category.id}
      href={category.name}
      lh={1}
      onClick={(event) => event.preventDefault()}
      size="sm"
    >
      {category.name}
    </Anchor>
  ));

  return (
    <div className={classes.footer}>
      <div className={classes.inner}>
        <h1>Salao de Beleza</h1>
        <Group className={classes.links}>{items}</Group>

        <Group gap="xs" justify="flex-end" wrap="nowrap">
          <ActionIcon size="lg" variant="default" radius="xl">
            <ActionToggle />
          </ActionIcon>
          <ActionIcon size="lg" variant="default" radius="xl">
            <IconBrandTwitter size={18} stroke={1.5} />
          </ActionIcon>
          <ActionIcon size="lg" variant="default" radius="xl">
            <IconBrandYoutube size={18} stroke={1.5} />
          </ActionIcon>
          <ActionIcon size="lg" variant="default" radius="xl">
            <IconBrandInstagram size={18} stroke={1.5} />
          </ActionIcon>
        </Group>
      </div>
    </div>
  );
}
