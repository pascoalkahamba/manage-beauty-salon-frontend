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
import { TRole } from "@/@types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createService,
  deleteService,
  getAllCategories,
  getAllServices,
  getUserById,
  updaateService,
  updateUserProfile,
} from "@/servers";
import SkeletonComponent from "@/components/Skeleton";
import { currentUserCanManagerProfile, showNameOfCurrentUser } from "@/utils";
import EmployeeAppointmentsModal from "@/components/EmployeeAppointmentsModal";
import EditProfileModal from "@/components/EditProfileModal";
import { useAtom } from "jotai";
import { modalAtom } from "@/storage/atom";
import { useState } from "react";
import {
  CategoriesModal,
  Category,
  CategoryFormModal,
} from "@/components/CategoryManagementModals";

import {
  ICurrentUser,
  IServiceToCreate,
  IUpdateService,
  IUpdateUserProfile,
} from "@/interfaces";
import { notifications } from "@mantine/notifications";
import ServicesManagementModal from "@/components/ServicesManagementModal";
import MenuInfo from "../MenuInfo";

interface UserProfilePageProps {
  id: number;
  role: TRole;
}

export default function UserProfilePage({ id, role }: UserProfilePageProps) {
  const [modalOpened, setModalOpened] = useAtom(modalAtom);
  const [categoriesModalOpened, setCategoriesModalOpened] = useState(false);
  const [categoryFormModalOpened, setCategoryFormModalOpened] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >(undefined);

  const { data: categorieds, isPending: isPendingCategory } = useQuery({
    queryKey: ["getAllCategories"],
    queryFn: getAllCategories,
  });
  // Example categories data
  const [categories, setCategories] = useState<Category[]>([
    {
      id: "1",
      name: "Cortes de Cabelo",
      description: "Diversos tipos de cortes de cabelo",
      services: [
        {
          id: "1",
          name: "Corte Masculino",
          description: "Corte tradicional masculino",
          price: 50.0,
          duration: 30,
        },
        // More services...
      ],
    },
    // More categories...
  ]);

  const handleDelete = async (id: string) => {
    try {
      // Add your API call here
      // await deleteCategory(id);

      setCategories(categories.filter((category) => category.id !== id));
      notifications.show({
        title: "Success",
        message: "Category deleted successfully",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to delete category",
        color: "red",
      });
    }
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setCategoryFormModalOpened(true);
  };

  const handleAdd = () => {
    setSelectedCategory(undefined);
    setCategoryFormModalOpened(true);
  };

  const handleSubmitCategory = async (values: CategoryFormValues) => {
    try {
      // Handle file uploads for all services
      const servicesWithUrls = await Promise.all(
        values.services.map(async (service) => {
          let photoUrl = undefined;
          if (service.photo) {
            const formData = new FormData();
            formData.append("photo", service.photo);
            // Add your photo upload API call here
            // const uploadResult = await uploadPhoto(formData);
            // photoUrl = uploadResult.url;
          }
          return { ...service, photoUrl };
        })
      );

      if (selectedCategory) {
        // Update existing category
        // Add your API call here
        // await updateCategory({ ...values, id: selectedCategory.id, services: servicesWithUrls });

        setCategories(
          categories.map((category) =>
            category.id === selectedCategory.id
              ? { ...category, ...values, services: servicesWithUrls }
              : category
          )
        );
      } else {
        // Add new category
        // Add your API call here
        // const newCategory = await createCategory({ ...values, services: servicesWithUrls });

        setCategories([
          ...categories,
          {
            ...values,
            id: Date.now().toString(), // Replace with actual ID from API
            services: servicesWithUrls,
          },
        ]);
      }

      notifications.show({
        title: "Success",
        message: `Category ${
          selectedCategory ? "updated" : "added"
        } successfully`,
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message: `Failed to ${selectedCategory ? "update" : "add"} category`,
        color: "red",
      });
    }
  };

  const queryClient = useQueryClient();
  const { data: serviceData } = useQuery({
    queryKey: ["getAllServices"],
    queryFn: getAllServices,
  });

  const { mutate: mutateDeleteService, isPending: isPendingDeleteService } =
    useMutation({
      mutationFn: (id: number) => deleteService(id),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["getAllServices"],
        });
        notifications.show({
          title: "Exclusão de serviço",
          message: "Serviço excluído com sucesso!",
          color: "green",
          position: "top-right",
        });
      },
      onError: (error) => {
        notifications.show({
          title: "Exclusão de serviço",
          message: "Erro ao excluir serviço!",
          color: "red",
          position: "top-right",
        });
      },
    });

  const { mutate: mutateUpdateService, isPending: isPendingEditService } =
    useMutation({
      mutationFn: (values: IUpdateService) => updaateService(values),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["getAllServices"],
        });
        notifications.show({
          title: "Atualização de serviço",
          message: "Serviço atualizado com sucesso!",
          color: "green",
          position: "top-right",
        });
      },
      onError: (error) => {
        notifications.show({
          title: "Atualização de serviço",
          message: "Erro ao atualizar serviço!",
          color: "red",
          position: "top-right",
        });
      },
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

  const handleUpdateService = async (id: number, service: IServiceToCreate) => {
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

    mutateUpdateService({
      ...service,
      id,
      photo: photoData,
    });
  };

  const handleDeleteService = async (id: number) => {
    console.log(`Deleting service ${id}`);
    mutateDeleteService(id);
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
    academicLevelId: String(user.academicLevel?.id),
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
            {role !== "CLIENT" && (
              <Group>
                <IconClock size={20} />
                <Text>Disponível: Todos os dias</Text>
              </Group>
            )}
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
                (role !== "MANAGER" ? (
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
              {role === "MANAGER" && <MenuInfo />}
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
              isPendingEdit={isPendingEditService}
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
        <div>
          <Button
            onClick={() =>
              setModalOpened({ type: "openListOfCategories", status: true })
            }
          >
            Manage Categories
          </Button>

          <CategoriesModal
            opened={categoriesModalOpened}
            onClose={() => setCategoriesModalOpened(false)}
            categories={categories}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onAdd={handleAdd}
          />

          <CategoryFormModal
            opened={categoryFormModalOpened}
            onClose={() => setCategoryFormModalOpened(false)}
            initialData={selectedCategory}
            onSubmit={handleSubmitCategory}
          />
        </div>
      </div>
    </div>
  );
}
