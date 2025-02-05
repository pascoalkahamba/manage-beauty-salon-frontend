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
import { useQuery } from "@tanstack/react-query";
import { getUserById } from "@/servers";
import SkeletonComponent from "@/components/Skeleton";
import { showNameOfCurrentUser } from "@/utils";
import EmployeeAppointmentsModal from "@/components/EmployeeAppointmentsModal";
import EditProfileModal from "@/components/EditProfileModal";
import { useAtom } from "jotai";
import { modalAtom } from "@/storage/atom";

interface UserProfilePageProps {
  id: number;
  role: TRole;
}

export default function UserProfilePage({ id, role }: UserProfilePageProps) {
  const [modalOpened, setModalOpened] = useAtom(modalAtom);
  const initialData = {
    name: "Antonio Eduardo",
    email: "antonioEduardo25@gmail.com",
    phone: "941900324",
    specialties: "corte-frances",
    education: "Licenciado em Administração de Empresas",
    role: "Funcionário",
    availability: "todos-os-dias",
  };

  const handleSubmit = (values: any) => {
    console.log("Updated values:", values);
    // Here you would typically make an API call to update the profile
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
                  <span key={service.id}>{service.name}</span>
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
            initialData={initialData}
            onSubmit={handleSubmit}
          />
        </Card>
      </div>
    </div>
  );
}
