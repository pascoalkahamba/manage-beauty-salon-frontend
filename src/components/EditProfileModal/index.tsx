"use client";

import {
  Modal,
  Button,
  TextInput,
  Stack,
  Select,
  FileInput,
  Avatar,
  Center,
  MultiSelect,
  PasswordInput,
  Textarea,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { IconUpload } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { ICurrentUser, IModalAtom } from "@/interfaces";
import {
  getAllAcademicLevels,
  getAllCategories,
  getAllServices,
} from "@/servers";
import { useQuery } from "@tanstack/react-query";
import CustomButton from "../CustomButton";
import { IUpdateUserProfile } from "@/@types";
import { profileSchema } from "@/schemas";

// Update the schema to include photo

interface EditProfileModalProps {
  opened: IModalAtom;
  onClose: () => void;
  isPending: boolean;
  initialData: IUpdateUserProfile & { photoUrl?: string }; // Add photoUrl to show current photo
  onSubmit: (values: IUpdateUserProfile) => void;
}

export default function EditProfileModal({
  opened,
  onClose,
  initialData,
  onSubmit,
  isPending,
}: EditProfileModalProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialData.photoUrl || null
  );

  const { data: serviceData, isError: serviceIsError } = useQuery({
    queryKey: ["getAllServices"],
    queryFn: getAllServices,
  });
  const currentUser = JSON.parse(
    localStorage.getItem("userInfo") as string
  ) as ICurrentUser;
  const {
    data: categoryData,

    isError: categoryIsError,
  } = useQuery({
    queryKey: ["getAllCategories"],
    queryFn: getAllCategories,
  });

  const { data: academicLevelData, isError: academicLevelIsError } = useQuery({
    queryKey: ["getAllAcademicLevels"],
    queryFn: getAllAcademicLevels,
  });

  const allServices = useMemo(() => {
    return (
      serviceData?.map((service) => ({
        value: `${service.id}`,
        label: service.name,
      })) || []
    );
  }, [serviceData]);

  const allCategories = useMemo(() => {
    return (
      categoryData?.map((category) => ({
        value: `${category.id}`,
        label: category.name,
      })) || []
    );
  }, [categoryData]);
  const allAcademicLevels = useMemo(() => {
    return (
      academicLevelData?.map((academicLevel) => ({
        value: `${academicLevel.id}`,
        label: academicLevel.name,
      })) || []
    );
  }, [academicLevelData]);

  const form = useForm<IUpdateUserProfile>({
    initialValues: initialData,
    validate: zodResolver(profileSchema),
  });

  const handleSubmit = (values: IUpdateUserProfile) => {
    console.log("values", values);

    if (!isPending) {
      onClose();
      form.reset();
    }
    onSubmit(values);
  };

  const handleFileChange = (file: File | null) => {
    form.setFieldValue("photo", file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(initialData.photoUrl || null);
    }
  };

  if (serviceIsError || categoryIsError || academicLevelIsError) {
    return (
      <p className="p-3 font-bold text-center">
        Algo deu errado tente novamente:
      </p>
    );
  }

  return (
    <Modal
      opened={opened.type === "editProfileInfo" && opened.status}
      onClose={onClose}
      title="Editar informações do perfil"
      size="lg"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack spacing="md">
          <Center>
            <Avatar src={previewUrl} size={120} radius="md" className="mb-4" />
          </Center>
          <FileInput
            label="Carregar nova foto"
            placeholder="Upload new photo"
            name="file"
            itemType="file"
            accept="image/png,image/jpeg,image/jpg"
            icon={<IconUpload size={16} />}
            onChange={handleFileChange}
          />
          <TextInput
            required
            label="Nome"
            placeholder="Digete seu nome"
            {...form.getInputProps("username")}
          />
          <Textarea
            required
            label="Descrição"
            placeholder="Digete uma descrição"
            {...form.getInputProps("bio")}
          />
          <TextInput
            required
            label="Email"
            placeholder="seu.email@examplo.com"
            {...form.getInputProps("email")}
          />
          <TextInput
            required
            label="Telefone"
            placeholder="941900324"
            {...form.getInputProps("cellphone")}
          />
          <PasswordInput
            required
            label="Senha"
            placeholder="Sua nova senha"
            value={form.values.password}
            onChange={(event) =>
              form.setFieldValue("password", event.currentTarget.value)
            }
            radius="md"
            error={form.errors.password}
          />
          {currentUser.role === "CLIENT" && (
            <MultiSelect
              label="Escolhe suas categorias"
              data={allCategories?.map((category) => ({
                value: category.value.toString(),
                label: category.label,
              }))}
              placeholder="Escohe suas categorias"
              value={form.values.categoriesIds?.map((id) => id.toString())}
              nothingFoundMessage="Nenhuma categoria encontrada"
              onChange={(value) =>
                form.setFieldValue("categoriesIds", value.map(Number))
              }
              clearable
              required
              searchable
            />
          )}
          {currentUser.role === "EMPLOYEE" && (
            <MultiSelect
              label="Escolhe seus serviços"
              data={allServices?.map((service) => ({
                value: service.value.toString(),
                label: service.label,
              }))}
              placeholder="Escolhe seus serviços"
              value={form.values.servicesIds?.map((id) => id.toString())}
              onChange={(value) =>
                form.setFieldValue("servicesIds", value.map(Number))
              }
              nothingFoundMessage="Nenhum serviço encontrado"
              clearable
              searchable
              required
            />
          )}{" "}
          {currentUser.role === "EMPLOYEE" && (
            <Select
              label="Escolhe seu nível acadêmico"
              placeholder="Escolhe seu nível acadêmico"
              data={allAcademicLevels}
              value={form.values.academicLevelId}
              nothingFoundMessage="Nenhum nível acadêmico encontrado"
              onChange={(value) =>
                form.setFieldValue("academicLevelId", `${value}`)
              }
            />
          )}{" "}
          <div className="flex items-center gap-6 w-full">
            <CustomButton
              type="submit"
              target="Salvar"
              targetPedding="Salvando..."
              isPending={isPending}
            />
            <Button color="red" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </Stack>
      </form>
    </Modal>
  );
}
