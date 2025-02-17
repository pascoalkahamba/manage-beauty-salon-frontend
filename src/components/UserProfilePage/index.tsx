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
import { TCategoriaFormValues, TCustomModal, TRole } from "@/@types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCategory,
  createService,
  deleteCategory,
  deleteService,
  getAllCategories,
  getAllServices,
  getUserById,
  updaateService,
  updateCategory,
  updateUserProfile,
} from "@/servers";
import SkeletonComponent from "@/components/Skeleton";
import { currentUserCanManagerProfile, showNameOfCurrentUser } from "@/utils";
import EmployeeAppointmentsModal from "@/components/EmployeeAppointmentsModal";
import EditProfileModal from "@/components/EditProfileModal";
import { useAtom } from "jotai";
import { customModalAtom, modalAtom } from "@/storage/atom";
import { useState } from "react";
import {
  CategoriesModal,
  CategoryFormModal,
} from "@/components/CategoryManagementModals";

import {
  ICategory,
  ICreateCategory,
  ICurrentUser,
  IServiceToCreate,
  IUpdateCategory,
  IUpdateService,
  IUpdateUserProfile,
} from "@/interfaces";
import { notifications } from "@mantine/notifications";
import ServicesManagementModal from "@/components/ServicesManagementModal";
import MenuInfo from "../MenuInfo";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import CustomModal from "@/components/CustomModal";
import EmployeesModal from "../EmployeesModal";
import AcademicLevelAndCodeToCreateEmployeeModal from "@/components/AcademicLevelAndCodeToCreateEmployeeModal";

interface UserProfilePageProps {
  id: number;
  role: TRole;
}

export default function UserProfilePage({ id, role }: UserProfilePageProps) {
  const [modalOpened, setModalOpened] = useAtom(modalAtom);
  const [isDeleteCategoryModalOpen, setIsDeleteCategoryModalOpen] =
    useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null
  );

  const { mutate: mutateUpdateCategory, isPendingUpdateCategory } = useMutation(
    {
      mutationFn: (values: IUpdateCategory) => updateCategory(values),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["getAllCategories"],
        });
        notifications.show({
          title: "Atualização de categoria",
          message: "Categoria atualizada com sucesso",
          color: "green",
          position: "top-right",
        });
      },
      onError: () => {
        notifications.show({
          title: "Atualização de categoria",
          message: "Erro ao atualizar categoria",
          color: "red",
          position: "top-right",
        });
      },
    }
  );

  const [customModalOpened, setCustomModalOpened] = useAtom(customModalAtom);
  const [selectedItem, setSelectedItem] = useState<{
    id?: number;
    name: string;
    description: string;
  } | null>(null);

  const handleOperation = (type: TCustomModal, item?: typeof selectedItem) => {
    setCustomModalOpened({ type: type, status: true });
    setSelectedItem(item || null);
  };

  const handleSubmitCustomModal = async (values: {
    id?: number;
    name: string;
    description: string;
  }) => {
    // Handle different operations based on modalType
    switch (customModalOpened.type) {
      case "editCategory":
        mutateUpdateCategory({
          id: values.id as number,
          name: values.name,
          description: values.description,
        });
        break;
      case "addCodeValidation":
        // await addCodeValidation(values);
        break;
      case "editCodeValidation":
        // await updateCodeValidation(values);
        break;
      case "addAcademicLevel":
        // await addAcademicLevel(values);
        break;
      case "editAcademicLevel":
        // await updateAcademicLevel(values);
        break;
    }
  };

  const { data: categories, isPending: isPendingCategory } = useQuery({
    queryKey: ["getAllCategories"],
    queryFn: getAllCategories,
  });

  const { mutate: mutateDeleteCategory, isPending: isPendingDeleteCategory } =
    useMutation({
      mutationFn: (id: number) => deleteCategory(id),
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ["getAllCategories"],
        });
        await queryClient.invalidateQueries({
          queryKey: ["getAllServices"],
        });
        notifications.show({
          title: "Deletar categoria",
          message: "Categoria deletada com sucesso",
          color: "green",
          position: "top-right",
        });
      },
      onError: () => {
        notifications.show({
          title: "Deletar categoria",
          message: "Erro ao deletar categoria",
          color: "red",
          position: "top-right",
        });
      },
    });

  const { mutate: mutateCreateCategory, isPending: isPendingCreateCategory } =
    useMutation({
      mutationFn: (values: ICreateCategory) => createCategory(values),
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ["getAllCategories"],
        });
        await queryClient.invalidateQueries({
          queryKey: ["getAllServices"],
        });

        notifications.show({
          title: "Criação de categoria",
          message: "Categoria criada com sucesso",
          color: "green",
          position: "top-right",
        });
      },
      onError: () => {
        notifications.show({
          title: "Criação de categoria",
          message: "Erro ao criar categoria",
          color: "red",
          position: "top-right",
        });
      },
    });

  const onDeleteCategory = async () => {
    mutateDeleteCategory(selectedCategory?.id as number);

    if (!isPendingDeleteCategory) {
      setIsDeleteCategoryModalOpen(false);
    }
  };

  const handleDelete = async (category: ICategory) => {
    console.log("category delete", id);
    setSelectedCategory(category);
    setIsDeleteCategoryModalOpen(true);
  };

  const handleEdit = (category: ICategory) => {
    setSelectedCategory(category);
    setSelectedItem({
      id: category.id,
      name: category.name,
      description: category.description,
    });

    console.log("category edit", category);
    console.log("selectItem", selectedItem);

    setCustomModalOpened({ type: "editCategory", status: true });
  };

  const handleAdd = () => {
    console.log("category add");
    console.log("modalOpened", modalOpened);
  };

  const handleSubmitCategory = async (values: TCategoriaFormValues) => {
    // Handle file uploads for all services
    const servicesWithUrls = await Promise.all(
      values.services.map(async (service) => {
        let photo = undefined;
        if (service.photo instanceof File) {
          const reader = new FileReader();
          const base64Promise = new Promise<string>((resolve) => {
            reader.onload = () => {
              resolve(reader.result as string);
            };
          });
          reader.readAsDataURL(service.photo);
          photo = await base64Promise;
        }
        return { ...service, photo };
      })
    );

    if (selectedCategory) {
      // Update existing category
      // Add your API call herej
      // await updateCategory({ ...values, id: selectedCategory.id, services: servicesWithUrls });
    } else {
      console.log("create category");
      // Add new category
      // Add your API call here
      // const newCategory = await createCategory({ ...values, services: servicesWithUrls });
      mutateCreateCategory({ ...values, services: servicesWithUrls });
    }
  };

  const queryClient = useQueryClient();
  const { data: serviceData } = useQuery({
    queryKey: ["getAllServices"],
    queryFn: getAllServices,
  });

  const { mutate: mutateDeleteService } = useMutation({
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
    onError: () => {
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
      onError: () => {
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
      onError: () => {
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

  const handleSubmitEdit = async (
    id: string,
    values: { name: string; description: string }
  ) => {};

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
    onError: () => {
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

      {/* <Group>
        <Button onClick={() => handleOperation("editCategory")}>
          Edit Category
        </Button>

        <Button onClick={() => handleOperation("addCodeValidation")}>
          Add Code Validation
        </Button>

        <Button onClick={() => handleOperation("addAcademicLevel")}>
          Add Academic Level
        </Button>
      </Group> */}

      <CustomModal
        opened={customModalOpened.status}
        onClose={() => {
          setCustomModalOpened({ type: "editCategory", status: false });
          setSelectedItem(null);
        }}
        type={customModalOpened.type}
        initialData={selectedItem || undefined}
        onSubmit={handleSubmitCustomModal}
      />

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

        <EmployeesModal />

        {categories && (
          <CategoriesModal
            categories={categories}
            onDelete={handleDelete}
            isPending={isPendingCategory}
            onEdit={handleEdit}
            onAdd={handleAdd}
          />
        )}

        <DeleteConfirmationModal
          description="Deseja realmente excluir esta categoria?"
          title="Excluir Categoria"
          opened={isDeleteCategoryModalOpen}
          setOpened={setIsDeleteCategoryModalOpen}
          type="deleteCategory"
          onConfirmDelete={onDeleteCategory}
          isPending={isPendingDeleteCategory}
        />

        <AcademicLevelAndCodeToCreateEmployeeModal />

        {/* <CustomModal
          onSubmit={handleSubmitEdit}
          type="editCategory"
          initialData={{
            id: "1",
            name: "Cortes de Cabelo",
            description: "Diversos tipos de cortes de cabelo",
          }}
        /> */}

        <CategoryFormModal
          initialData={selectedCategory as ICategory}
          onSubmit={handleSubmitCategory}
          isLoading={isPendingCreateCategory}
        />
      </div>
    </div>
  );
}
