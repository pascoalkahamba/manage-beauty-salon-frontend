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
import { IconClock, IconCalendarEvent } from "@tabler/icons-react";
import { ICreateService, TRole } from "@/@types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createService,
  getAllServices,
  getUserById,
  updateUserProfile,
} from "@/servers";
import SkeletonComponent from "@/components/Skeleton";
import { currentUserCanManagerProfile, showNameOfCurrentUser } from "@/utils";
import EmployeeAppointmentsModal from "@/components/EmployeeAppointmentsModal";
import EditProfileModal from "@/components/EditProfileModal";
import { useAtom } from "jotai";
import { modalAtom } from "@/storage/atom";
import {
  ICurrentUser,
  IServiceToCreate,
  IUpdateUserProfile,
} from "@/interfaces";
import { notifications } from "@mantine/notifications";
import ServicesManagementModal, {
  ICreateService,
} from "@/components/ServicesManagementModal";

interface UserProfilePageProps {
  id: number;
  role: TRole;
}

export default function UserProfilePage({ id, role }: UserProfilePageProps) {
  const [modalOpened, setModalOpened] = useAtom(modalAtom);
  const queryClient = useQueryClient();
  const { data: serviceData } = useQuery({
    queryKey: ["getAllServices"],
    queryFn: getAllServices,
  });

  const { mutate: mutateCreateService, isPending: isPendingCreateService } =
    useMutation({
      mutationFn: (values: IServiceToCreate) => createService(values),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["getAllServices"],
        });
        notifications.show({
          title: "Criação de serviço",
          message: "Serviço criado com sucesso!",
          color: "green",
          position: "top-right",
        });
      },
      onError: (error) => {
        notifications.show({
          title: "Criação de serviço",
          message: "Erro ao criar serviço!",
          color: "red",
          position: "top-right",
        });
      },
    });
  const currentUser = JSON.parse(
    localStorage.getItem("userInfo") as string
  ) as ICurrentUser;

  const heCan = currentUserCanManagerProfile({ id, role }, currentUser);

  const { mutate, isPending: isPendingProfile } = useMutation({
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

  const handleAddService = async (service: IServiceToCreate) => {
    let photoData: Blob = service.photo;

    if (service.photo instanceof File) {
      // Convert file to base64
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(service.photo);
      });
      photoData = base64 as Blob;
    }

    mutateCreateService({
      ...service,
      photo: photoData,
    });
  };

  const handleUpdateService = async (
    id: string,
    service: Omit<ICreateService, "id">
  ) => {
    console.log(`Updating service ${id}:`, service);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const handleDeleteService = async (id: string) => {
    console.log(`Deleting service ${id}`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const handleSubmit = async (values: IUpdateUserProfile) => {
    let photoData: Blob = values.photo;

    if (values.photo instanceof File) {
      // Convert file to base64
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(values.photo);
      });
      photoData = base64 as Blob;
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
    photo: user.profile.photo as unknown as Blob,
  };

  const availability = user.appointments.some(
    (appointment) => appointment.status === "CONFIRMED"
  );

  const openListOfAppointments = () => {
    setModalOpened({
      type: "listOfAppointments",
      status: true,
    });
  };
  const openListOfServices = () => {
    setModalOpened({
      type: "openModalServices",
      status: true,
    });
  };

  return (
    <div
      className="flex items-center gap-4 w-full"
      data-aos="fade-right"
      data-aos-delay="200"
      data-duration="200"
    >
      <div className="w-3/4">
        <Card shadow="md" radius="md" p="md">
          <Stack align="center" spacing="md">
            <Avatar src={user?.profile.photo.url} size={100} radius="xl" />
            <Title order={2}>{user?.username}</Title>
            <Text>{user?.email}</Text>
            <Text>{user?.cellphone}</Text>
            <Text>{user?.academicLevel?.name}</Text>
            <Text>{showNameOfCurrentUser(user?.role)}</Text>
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
            {role !== "CLIENT" ? (
              <Group>
                <IconCalendarEvent size={20} />
                Especialidades:{" "}
                {user?.services?.map((service) => (
                  <Text key={service.id}>{service.name},</Text>
                ))}
              </Group>
            ) : (
              <Group>
                <IconCalendarEvent size={20} />
                Preferências:{" "}
                {user?.categories?.map((category) => (
                  <Text key={category.id}> {category.name}</Text>
                ))}
              </Group>
            )}
            <Divider />
            <Title order={3}>Sobre Mim</Title>
            <Text>{user?.profile.bio}</Text>
            <Divider />
            <div className="flex gap-2 items-center w-full">
              {heCan &&
                (role === "EMPLOYEE" ? (
                  <Button
                    variant="light"
                    color="orange"
                    onClick={openListOfAppointments}
                  >
                    Agendamentos
                  </Button>
                ) : (
                  role === "MANAGER" && (
                    <Button
                      variant="light"
                      color="orange"
                      onClick={openListOfServices}
                    >
                      Serviços
                    </Button>
                  )
                ))}
              {heCan && (
                <Button
                  variant="light"
                  color="blue"
                  onClick={() =>
                    setModalOpened({ type: "editProfileInfo", status: true })
                  }
                >
                  Editar
                </Button>
              )}
              {currentUser.role !== "CLIENT" && availability ? (
                <Button variant="light" color="red" fullWidth={!heCan}>
                  Ocupado
                </Button>
              ) : (
                <Button variant="light" color="green" fullWidth={!heCan}>
                  {role !== "CLIENT" ? "Disponível" : "Activo"}
                </Button>
              )}
            </div>
          </Stack>

          <EmployeeAppointmentsModal
            onClose={() =>
              setModalOpened({ type: "listOfAppointments", status: false })
            }
            appointments={user.appointments}
          />

          {serviceData && (
            <ServicesManagementModal
              onClose={() =>
                setModalOpened({ type: "openModalServices", status: false })
              }
              services={serviceData}
              onAddService={handleAddService}
              isPendingEdit={false}
              isPendingAdd={isPendingCreateService}
              onUpdateService={handleUpdateService}
              onDeleteService={handleDeleteService}
            />
          )}
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
