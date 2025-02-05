import {
  Modal,
  Button,
  TextInput,
  Stack,
  Select,
  FileInput,
  Avatar,
  Center,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { IconUpload } from "@tabler/icons-react";
import { useState } from "react";
import { IModalAtom } from "@/interfaces";

// Update the schema to include photo
const profileSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\d{9}$/, "Phone number must be exactly 9 digits"),
  specialties: z.string().min(1, "Please select a specialty"),
  education: z.string().min(3, "Education must be at least 3 characters"),
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

  return (
    <Modal
      opened={opened.type === "editProfileInfo" && opened.status}
      onClose={onClose}
      title="Edit Profile Information"
      size="lg"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack spacing="md">
          <Center>
            <Avatar src={previewUrl} size={120} radius="md" className="mb-4" />
          </Center>

          <FileInput
            label="Profile Photo"
            placeholder="Upload new photo"
            accept="image/png,image/jpeg,image/jpg"
            icon={<IconUpload size={16} />}
            onChange={handleFileChange}
          />

          <TextInput
            label="Name"
            placeholder="Enter your full name"
            {...form.getInputProps("name")}
          />

          <TextInput
            label="Email"
            placeholder="your.email@example.com"
            {...form.getInputProps("email")}
          />

          <TextInput
            label="Phone Number"
            placeholder="941900324"
            {...form.getInputProps("phone")}
          />

          <Select
            label="Specialties"
            placeholder="Select your specialty"
            data={[
              { value: "corte-frances", label: "Corte Frances" },
              { value: "corte-classico", label: "Corte Clássico" },
              { value: "tratamento-cabelo", label: "Tratamento de Cabelo" },
              { value: "manicure", label: "Manicure" },
            ]}
            {...form.getInputProps("specialties")}
          />

          <TextInput
            label="Education"
            placeholder="Your educational background"
            {...form.getInputProps("education")}
          />

          <TextInput
            label="Role"
            placeholder="Your role in the salon"
            {...form.getInputProps("role")}
          />

          <Select
            label="Availability"
            placeholder="Select your availability"
            data={[
              { value: "todos-os-dias", label: "Todos os dias" },
              { value: "dias-uteis", label: "Dias úteis" },
              { value: "fins-de-semana", label: "Fins de semana" },
            ]}
            {...form.getInputProps("availability")}
          />

          <Button type="submit" fullWidth>
            Save Changes
          </Button>
        </Stack>
      </form>
    </Modal>
  );
}
