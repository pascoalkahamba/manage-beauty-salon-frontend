"use client";

import { useState } from "react";
import {
  IconChevronDown,
  IconDeviceAnalytics,
  IconLogout,
  IconAdjustmentsFilled,
  IconSettings,
  IconCategory,
  IconTrash,
} from "@tabler/icons-react";
import cx from "clsx";
import {
  Avatar,
  Burger,
  Container,
  Group,
  Menu,
  Tabs,
  Text,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "@/components/Header/styles.module.css";
import { ICurrentUser } from "@/interfaces";
import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteUserAccount, getAllCategories, getUserById } from "@/servers";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { notifications } from "@mantine/notifications";
import DeleteConfirmationModal from "../DeleteConfirmationModal";

export default function Header() {
  const theme = useMantineTheme();
  const [opened, { toggle }] = useDisclosure(false);
  const router = useRouter();
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const [openDeleteAccountModal, setOpenDeleteAccountModal] = useState(false);
  const currentUser = JSON.parse(
    localStorage.getItem("userInfo") as string
  ) as ICurrentUser;
  const { data: user } = useQuery({
    queryKey: [`${currentUser.role}-${currentUser.id}-getOneUser`],
    queryFn: () => getUserById(currentUser.id, currentUser.role),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteUserAccount(currentUser.id, currentUser.role),
    onSuccess: () => {
      notifications.show({
        title: "Eliminação de conta",
        message: "Conta eliminada com sucesso!",
        color: "green",
        position: "top-right",
      });
      router.push("/signIn");
    },
    onError: () => {
      notifications.show({
        title: "Eliminação de conta",
        message: "Erro ao eliminar conta!",
        color: "red",
        position: "top-right",
      });
    },
  });

  const { data: allCategories } = useQuery({
    queryKey: ["getAllCategories"],
    queryFn: getAllCategories,
  });

  function logout() {
    router.push("/signIn");
  }

  const deleteAccount = async () => mutate();

  // if (isPending) {
  //   notifications.show({
  //     title: "Eliminação de conta",
  //     message: "Aguarde um momento...",
  //     color: "yellow",
  //     position: "top-right",
  //   });
  //   return;
  // }

  const items = allCategories?.map((category) => (
    <Tabs.Tab value={`${category.id}`} key={category.id}>
      {category.name}
    </Tabs.Tab>
  ));

  return (
    <div className={classes.header}>
      <Container className={classes.mainSection} size="md">
        <Group justify="space-between">
          <h1>
            <Link href="/dashboard">Salao de Beleza</Link>
          </h1>
          <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
          <Group justify="space-between">
            <Menu
              width={260}
              position="bottom-end"
              transitionProps={{ transition: "pop-top-right" }}
              onClose={() => setUserMenuOpened(false)}
              onOpen={() => setUserMenuOpened(true)}
              withinPortal
            >
              <Menu.Target>
                <UnstyledButton
                  className={cx(classes.user, {
                    [classes.userActive]: userMenuOpened,
                  })}
                >
                  <Group gap={7}>
                    <Avatar
                      src={user?.profile.photo.url}
                      alt={user?.profile.photo.name}
                      radius="xl"
                      size={20}
                    />
                    <Text fw={500} size="sm" lh={1} mr={3}>
                      {user?.username}
                    </Text>
                    <IconChevronDown size={12} stroke={1.5} />
                  </Group>
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  leftSection={
                    <IconDeviceAnalytics
                      size={16}
                      color={theme.colors.red[6]}
                      stroke={1.5}
                    />
                  }
                >
                  Serviços
                </Menu.Item>
                <Menu.Item
                  leftSection={
                    <IconCategory
                      size={16}
                      color={theme.colors.yellow[6]}
                      stroke={1.5}
                    />
                  }
                >
                  Categorias
                </Menu.Item>
                <Menu.Item
                  leftSection={
                    <IconAdjustmentsFilled
                      size={16}
                      color={theme.colors.blue[6]}
                      stroke={1.5}
                    />
                  }
                >
                  Agendamentos
                </Menu.Item>

                <Menu.Label>Definições</Menu.Label>
                <Menu.Item
                  leftSection={<IconSettings size={16} stroke={1.5} />}
                >
                  <Link href={`/profile/${currentUser.id}/${currentUser.role}`}>
                    Definições da conta
                  </Link>
                </Menu.Item>
                <Menu.Item
                  onClick={logout}
                  leftSection={<IconLogout size={16} stroke={1.5} />}
                >
                  Terminar sessão
                </Menu.Item>

                <Menu.Divider />

                <Menu.Label>Zona de risco</Menu.Label>
                <Menu.Item
                  color="red"
                  onClick={() => setOpenDeleteAccountModal(true)}
                  leftSection={<IconTrash size={16} stroke={1.5} />}
                >
                  Eliminar conta
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </Container>
      <Container size="md">
        <Tabs
          defaultValue="Home"
          variant="outline"
          visibleFrom="sm"
          classNames={{
            root: classes.tabs,
            list: classes.tabsList,
            tab: classes.tab,
          }}
        >
          <Tabs.List>{items}</Tabs.List>
        </Tabs>
        {openDeleteAccountModal && (
          <DeleteConfirmationModal
            title="Eliminar conta"
            description="Tem certeza que quer eliminar a sua conta?"
            isPending={isPending}
            opened={openDeleteAccountModal}
            setOpened={setOpenDeleteAccountModal}
            type="deleteUserAccount"
            onConfirmDelete={deleteAccount}
          />
        )}
      </Container>
    </div>
  );
}
