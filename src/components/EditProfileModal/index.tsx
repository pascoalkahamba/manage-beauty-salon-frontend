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
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { IconUpload } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { IModalAtom } from "@/interfaces";
import {
  getAllAcademicLevels,
  getAllCategories,
  getAllServices,
} from "@/servers";
import { useQuery } from "@tanstack/react-query";

// Update the schema to include photo
const profileSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().regex(/^\d{9}$/, "Phone number must be exactly 9 digits"),
  specialties: z.string().min(1, "Please select a specialty"),
  servicesIds: z
    .number()
    .array()
    .min(1, "Please select at least one service")
    .optional(),
  categoriesIds: z
    .number()
    .array()
    .min(1, "Please select at least one service")
    .optional(),
  education: z.string().min(3, "Education must be at least 3 characters"),
  academicLevelId: z.string().min(1, "Please select an academic level"),
  role: z.string().min(3, "Role must be at least 3 characters"),
  availability: z.string().min(1, "Please select availability"),
  photo: z.any().optional(), // File upload is optional
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface EditProfileModalProps {
  opened: IModalAtom;
  onClose: () => void;
  initialData: ProfileFormValues & { photoUrl?: string }; // Add photoUrl to show current photo
  onSubmit: (values: ProfileFormValues) => void;
}

export default function EditProfileModal({
  opened,
  onClose,
  initialData,
  onSubmit,
}: EditProfileModalProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialData.photoUrl || null
  );

  const { data: serviceData, isError: serviceIsError } = useQuery({
    queryKey: ["getAllServices"],
    queryFn: getAllServices,
  });

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

  const form = useForm<ProfileFormValues>({
    initialValues: initialData,
    validate: zodResolver(profileSchema),
  });

  const handleSubmit = (values: ProfileFormValues) => {
    onSubmit(values);
    onClose();
    form.reset();
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
            accept="image/png,image/jpeg,image/jpg"
            icon={<IconUpload size={16} />}
            onChange={handleFileChange}
          />

          <TextInput
            label="Nome"
            placeholder="Digete seu nome"
            {...form.getInputProps("name")}
          />

          <TextInput
            label="Email"
            placeholder="seu.email@example.com"
            {...form.getInputProps("email")}
          />

          <TextInput
            label="Telefone"
            placeholder="941900324"
            {...form.getInputProps("phone")}
          />
          <TextInput
            label="Senha"
            placeholder="********"
            {...form.getInputProps("password")}
          />

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

          <Button type="submit" fullWidth>
            Salvar alterações
          </Button>
        </Stack>
      </form>
    </Modal>
  );
}
