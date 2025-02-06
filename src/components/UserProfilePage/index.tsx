"use client";

import {
  Card,
  Title,
  Text,
  Button,
  Avatar,
  Group,
  Stack,
  Divider,
} from "@mantine/core";
import {
  IconClock,
  IconCalendarEvent,
  IconUserCheck,
} from "@tabler/icons-react";
import { TRole } from "@/@types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserById, updateUserProfile } from "@/servers";
import SkeletonComponent from "@/components/Skeleton";
import { showNameOfCurrentUser } from "@/utils";
import EmployeeAppointmentsModal from "@/components/EmployeeAppointmentsModal";
import EditProfileModal from "@/components/EditProfileModal";
import { useAtom } from "jotai";
import { modalAtom } from "@/storage/atom";
import { IUpdateUserProfile } from "@/interfaces";
import { notifications } from "@mantine/notifications";

interface UserProfilePageProps {
  id: number;
  role: TRole;
}

export default function UserProfilePage({ id, role }: UserProfilePageProps) {
  const [modalOpened, setModalOpened] = useAtom(modalAtom);
  const queryClient = useQueryClient();

  const formdata = new FormData();
  const {
    mutate,
    isPending: isPendingProfile,
    isError,
  } = useMutation({
    mutationFn: (values: IUpdateUserProfile) => updateUserProfile(values),
    onSuccess: () => {
      setModalOpened({
        type: "editProfileInfo",
        status: false,
      });
      queryClient.invalidateQueries({
        queryKey: [`${role}-${id}-getOneUser`],
      });
      notifications.show({
        title: "Atualização de perfil",
        message: "Perfil atualizado com sucesso!",
        color: "green",
        position: "top-right",
      });
    },
    onError: (error) => {
      console.log(error);
      notifications.show({
        title: "Atualização de perfil",
        message: "Perfil não atualizado, tente novamente mais tarde!",
        color: "red",
        position: "top-right",
      });
    },
  });

  const handleSubmit = async (values: IUpdateUserProfile) => {
    let photoData = values.photo;

    if (values.photo instanceof File) {
      // Convert file to base64
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(values.photo);
      });
      photoData = base64;
    }

    const initialValues = {
      ...values,
      id: id,
      role: role,
      photo: photoData,
    };

    mutate(initialValues);
  };
  const {
    data: user,
    isPending,
    error,
  } = useQuery({
    queryKey: [`${role}-${id}-getOneUser`],
    queryFn: () => getUserById(id, role),
  });

  if (isPending)
    return (
      <SkeletonComponent
        isPending={isPending}
        skeletons={[1]}
        width={50}
        height={300}
      />
    );
  if (error)
    return (
      <p className="font-bold text-center">
        Algo deu errado tente novamente: Usuário não encontrado
      </p>
    );

  const initialData: IUpdateUserProfile = {
    id: id,
    role: role,
    username: user.username,
    email: user.email,
    cellphone: user.cellphone,
    servicesIds: user.services?.map((service) => service.id),
    academicLevelId: user.academicLevel?.id,
    password: "",
    categoriesIds: user.categories?.map((category) => category.id),
    bio: user.profile.bio,
    photo: user.profile.photo,
  };

  const availability = user.appointments.some(
    (appointment) => appointment.status === "CONFIRMED"
  );

  return (
    <div className="flex items-center gap-4 w-full">
      <div className="w-3/4">
        <Card shadow="md" radius="md" p="md">
          <Stack align="center" spacing="md">
            <Avatar src={user?.profile.photo.url} size={100} radius="xl" />
            <Title order={2}>{user?.username}</Title>
            <Text>{user?.email}</Text>
            <Text>{user?.cellphone}</Text>
            <Text>{user?.academicLevel?.name}</Text>
            <Text>{showNameOfCurrentUser(user?.role)}</Text>
            <Group>
              <IconUserCheck size={20} />
              <Text> 23 avaliações positivas</Text>
            </Group>
            <Group>
              <IconUserCheck size={20} />
              <Text> 23 avaliações negativas </Text>
            </Group>
          </Stack>
        </Card>
      </div>

      <div className="w-4/5">
        <Card shadow="md" radius="md" p="xl">
          <Stack spacing="md">
            <Title order={2}>Informações</Title>
            <Divider />
            <Group>
              <IconClock size={20} />
              <Text>Disponível: Todos os dias</Text>
            </Group>
            <Group>
              <IconCalendarEvent size={20} />
              <Text>
                Especialidades:{" "}
                {user?.services?.map((service) => (
                  <span key={service.id}>{service.name}, </span>
                ))}
              </Text>
            </Group>
            <Divider />
            <Title order={3}>Sobre Mim</Title>
            <Text>{user?.profile.bio}</Text>
            <Divider />
            <div className="flex gap-2 items-center w-full">
              <Button
                variant="light"
                color="orange"
                onClick={() =>
                  setModalOpened({
                    type: "listOfAppointments",
                    status: true,
                  })
                }
              >
                Agendamentos
              </Button>
              <Button
                variant="light"
                color="blue"
                onClick={() =>
                  setModalOpened({ type: "editProfileInfo", status: true })
                }
              >
                Editar
              </Button>
              {availability ? (
                <Button variant="light" color="red">
                  Ocupado
                </Button>
              ) : (
                <Button variant="light" color="green">
                  Disponivel
                </Button>
              )}
            </div>
          </Stack>

          <EmployeeAppointmentsModal
            opened={modalOpened}
            onClose={() =>
              setModalOpened({ type: "listOfAppointments", status: false })
            }
            appointments={user.appointments}
          />

          <EditProfileModal
            opened={modalOpened}
            onClose={() =>
              setModalOpened({ type: "editProfileInfo", status: false })
            }
            isPending={isPendingProfile}
            initialData={initialData}
            onSubmit={handleSubmit}
          />
        </Card>
      </div>
    </div>
  );
}
