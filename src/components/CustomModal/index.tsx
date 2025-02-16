import { Modal, Button, TextInput, Stack, Textarea } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { TCustomModal } from "@/@types";
import { EMPLOYEE_CODE_REGEX } from "@/utils";
import { useAtomValue } from "jotai";
import { customModalAtom } from "@/storage/atom";

// Define the possible operation types

// Base interface for all operations
interface BaseModalData {
  id?: number; // Optional because it's only needed for edit operations
  name: string;
  description: string;
}

// Props interface for the modal
interface CustomModalProps {
  opened: boolean;
  onClose: () => void;
  type: TCustomModal;
  initialData?: BaseModalData;
  onSubmit: (values: BaseModalData) => void;
}

// Function to get modal configuration based on operation type
const getModalConfig = (type: TCustomModal) => {
  const configs = {
    editCategory: {
      title: "Editar Categoria",
      nameLabel: "Nome da Categoria",
      namePlaceholder: "Digite o nome da categoria",
      descriptionLabel: "Descrição da Categoria",
      descriptionPlaceholder: "Digite a descrição da categoria",
      validation: {
        nameMin: 6,
        nameMax: 30,
        descriptionMin: 10,
        descriptionMax: 100,
      },
    },
    addCodeValidation: {
      title: "Adicionar codigo de validação",
      nameLabel: "Caracteres para validação",
      namePlaceholder: "Digite os caracteres para validação",
      descriptionLabel: "Descrição do codigo de validação",
      descriptionPlaceholder: "Digite a descrição do codigo de validação",
      validation: {
        nameMin: 1,
        nameMax: 10,
        regax: EMPLOYEE_CODE_REGEX,
        descriptionMin: 5,
        descriptionMax: 100,
      },
    },
    editCodeValidation: {
      title: "Editar codigo de validação",
      nameLabel: "Caracteres para validação",
      namePlaceholder: "Digite os caracteres para validação",
      descriptionLabel: "Descrição do codigo de validação",
      descriptionPlaceholder: "Digite a descrição do codigo de validação",
      validation: {
        nameMin: 1,
        nameMax: 10,
        regax: EMPLOYEE_CODE_REGEX,
        descriptionMin: 5,
        descriptionMax: 100,
      },
    },
    addAcademicLevel: {
      title: "Adicionar nivel academico",
      nameLabel: "Nome do nivel academico",
      namePlaceholder: "Digite o nome do nivel academico",
      descriptionLabel: "Descrição do nivel academico",
      descriptionPlaceholder: "Digite a descrição do nivel academico",
      validation: {
        nameMin: 6,
        nameMax: 30,
        descriptionMin: 10,
        descriptionMax: 150,
      },
    },
    editAcademicLevel: {
      title: "Editar nivel academico",
      nameLabel: "Nome do nivel academico",
      namePlaceholder: "Digite o nome do nivel academico",
      descriptionLabel: "Descrição do nivel academico",
      descriptionPlaceholder: "Digite a descrição do nivel academico",
      validation: {
        nameMin: 6,
        nameMax: 30,
        descriptionMin: 10,
        descriptionMax: 150,
      },
    },
  };

  return configs[type];
};

export default function CustomModal({
  onClose,
  type,
  initialData,
  onSubmit,
}: CustomModalProps) {
  const config = getModalConfig(type);

  const opened = useAtomValue(customModalAtom);
  console.log("initialValues", initialData);

  // Create dynamic validation schema based on operation type
  const createValidationSchema = () => {
    return z.object({
      name: z
        .string()
        .min(
          config.validation.nameMin,
          `${config.nameLabel} deve ter pelo menos ${config.validation.nameMin} characteres`
        )
        .max(
          config.validation.nameMax,
          `${config.nameLabel} deve ter no maximo ${config.validation.nameMax} characteres`
        )
        [
          type === "addCodeValidation" || type === "editCodeValidation"
            ? "regex"
            : "optional"
        ](
          type === "addCodeValidation" || type === "editCodeValidation"
            ? config.validation.regax
            : /./,
          "Caracteres do codigo inválido, deve conter 8 digitos um numero e uma letra e um caracter especial (@$!%*#?&)."
        ),
      description: z
        .string()
        .min(
          config.validation.descriptionMin,
          `${config.descriptionLabel} must be at least ${config.validation.descriptionMin} characters`
        )
        .max(
          config.validation.descriptionMax,
          `${config.descriptionLabel} cannot exceed ${config.validation.descriptionMax} characters`
        ),
    });
  };

  const form = useForm<BaseModalData>({
    initialValues: initialData || {
      name: "",
      description: "",
    },
    validate: zodResolver(createValidationSchema()),
  });

  const handleSubmit = (values: BaseModalData) => {
    onSubmit({
      ...values,
      id: initialData?.id, // Include id if it exists (edit operations)
    });
    onClose();
    form.reset();
  };

  return (
    <Modal
      opened={opened.status && opened.type === "editCategory"}
      onClose={onClose}
      title={config.title}
      style={{ zIndex: 9999, position: "absolute" }}
      size="md"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack spacing="md">
          <TextInput
            label={config.nameLabel}
            placeholder={config.namePlaceholder}
            required
            {...form.getInputProps("name")}
          />

          <Textarea
            label={config.descriptionLabel}
            placeholder={config.descriptionPlaceholder}
            required
            minRows={3}
            {...form.getInputProps("description")}
          />

          <Button type="submit" fullWidth mt="md">
            {initialData?.id ? "Salvar alterações" : "Adicionar"}
          </Button>
        </Stack>
      </form>
    </Modal>
  );
}
