import { useState } from "react";
import {
  Modal,
  TextInput,
  Button,
  Group,
  Stack,
  ActionIcon,
  Text,
  Card,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconEdit, IconTrash, IconPlus } from "@tabler/icons-react";
import { modalAtom } from "@/storage/atom";
import { useAtom } from "jotai";
import { academicLevelSchema, codeValidationToEmployeeSchema } from "@/schemas";
import {
  IAcademicLevel,
  ICodeValidationToEmployee,
  ICreateAdemicLevel,
  ICreateCodeValidationToEmployee,
  ICurrentUser,
} from "@/interfaces";
import {
  createAcademicLevel,
  createCodeValidationToEmployee,
  deleteAcademicLevel,
  deleteCodeValidationToEmployee,
  getAllAcademicLevels,
  getAllCodeValidationToCreateEmployee,
  updateAcademicLevel,
  updateCodeValidationToEmployee,
} from "@/servers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Schema for validation

// Types

export default function AcademicLevelAndCodeToCreateEmployeeModal() {
  const [opened, setOpened] = useAtom(modalAtom);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAcademicLevel, setSelectedAcademicLevel] =
    useState<IAcademicLevel | null>(null);
  const [
    selectedCodeValidationToEmployee,
    setSelectedCodeValidationToEmployee,
  ] = useState<ICodeValidationToEmployee | null>(null);

  const currentUser = JSON.parse(
    localStorage.getItem("userInfo") as string
  ) as ICurrentUser;

  const { data: academicLevelData } = useQuery({
    queryKey: ["getAllAcademicLevels"],
    queryFn: getAllAcademicLevels,
  });

  const queryClient = useQueryClient();

  const {
    mutate: mutateCreateAcadmicLevel,
    isPending: createAcademicLevelIsPending,
  } = useMutation({
    mutationFn: (values: ICreateAdemicLevel) => createAcademicLevel(values),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getAllAcademicLevels"],
      });
      notifications.show({
        title: "Novo nível acadêmico",
        message: "Nível acadêmico criado com sucesso!",
        color: "green",
        position: "top-right",
      });
    },
    onError: () => {
      notifications.show({
        title: "Novo nível acadêmico",
        message: "Erro ao criar nível acadêmico!",
        color: "red",
        position: "top-right",
      });
    },
  });

  const {
    mutate: mutateCreateCodeValidationToEmployee,
    isPending: createCodeValidationToEmployeeIsPending,
  } = useMutation({
    mutationFn: (values: ICreateCodeValidationToEmployee) =>
      createCodeValidationToEmployee(values),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["codeValidationToCreateEmployee"],
      });
      notifications.show({
        title: "Novo código de validação",
        message: "Código de validação criado com sucesso!",
        color: "green",
        position: "top-right",
      });
    },
    onError: () => {
      notifications.show({
        title: "Novo código de validação",
        message: "Erro ao criar código de validação!",
        color: "red",
        position: "top-right",
      });
    },
  });

  const {
    mutate: mutateUpdateAcademicLevel,
    isPending: updateAcademicLevelIsPending,
  } = useMutation({
    mutationFn: (values: IAcademicLevel) => updateAcademicLevel(values),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getAllAcademicLevels"],
      });
      notifications.show({
        title: "Atualização de nível acadêmico",
        message: "Nível acadêmico atualizado com sucesso!",
        color: "green",
        position: "top-right",
      });
    },
    onError: () => {
      notifications.show({
        title: "Atualização de nível acadêmico",
        message: "Erro ao atualizar nível acadêmico!",
        color: "red",
        position: "top-right",
      });
    },
  });

  const {
    mutate: mutateUpdateCodeValidationToEmployee,
    isPending: updateCodeValidationToEmployeeIsPending,
  } = useMutation({
    mutationFn: (values: ICodeValidationToEmployee) =>
      updateCodeValidationToEmployee(values),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["codeValidationToCreateEmployee"],
      });
      notifications.show({
        title: "Atualização de código de validação",
        message: "Código de validação atualizado com sucesso!",
        color: "green",
        position: "top-right",
      });
    },
    onError: () => {
      notifications.show({
        title: "Atualização de código de validação",
        message: "Erro ao atualizar código de validação!",
        color: "red",
        position: "top-right",
      });
    },
  });

  const { mutate: mutateDeleteAcademicLevel } = useMutation({
    mutationFn: (id: number) => deleteAcademicLevel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getAllAcademicLevels"],
      });
      notifications.show({
        title: "Exclusão de nível acadêmico",
        message: "Nível acadêmico excluído com sucesso!",
        color: "green",
        position: "top-right",
      });
    },
    onError: () => {
      notifications.show({
        title: "Exclusão de nível acadêmico",
        message: "Erro ao excluir nível acadêmico!",
        color: "red",
        position: "top-right",
      });
    },
  });

  const { mutate: mutateDeleteCodeValidationToEmployee } = useMutation({
    mutationFn: (id: number) => deleteCodeValidationToEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["codeValidationToCreateEmployee"],
      });
      notifications.show({
        title: "Exclusão de código de validação",
        message: "Código de validação excluído com sucesso!",
        color: "green",
        position: "top-right",
      });
    },
    onError: () => {
      notifications.show({
        title: "Exclusão de código de validação",
        message: "Erro ao excluir código de validação!",
        color: "red",
        position: "top-right",
      });
    },
  });

  const { data: codeValidationToCreateEmployee } = useQuery({
    queryKey: ["codeValidationToCreateEmployee"],
    queryFn: getAllCodeValidationToCreateEmployee,
  });

  // Form handling
  const form = useForm({
    initialValues: {
      name: "",
      description: "",
    },
    validate: zodResolver(
      opened.type === "listOfAcademicLevel"
        ? academicLevelSchema
        : codeValidationToEmployeeSchema
    ),
  });

  const handleSubmit = (values: typeof form.values) => {
    if (
      (isEditing && selectedAcademicLevel) ||
      (isEditing && selectedCodeValidationToEmployee)
    ) {
      // Update existing level
      if (opened.type === "listOfAcademicLevel") {
        mutateUpdateAcademicLevel({
          id: selectedAcademicLevel?.id as number,
          name: values.name,
          description: values.description,
        });
      } else {
        mutateUpdateCodeValidationToEmployee({
          id: selectedCodeValidationToEmployee?.id as number,
          characters: values.name,
          description: values.description,
        });
      }
    } else {
      // Add new level

      if (opened.type === "listOfAcademicLevel") {
        mutateCreateAcadmicLevel({
          name: values.name,
          description: values.description,
        });
      } else {
        mutateCreateCodeValidationToEmployee({
          characters: values.name,
          description: values.description,
        });
      }
    }
    resetForm();
  };

  const handleEdit = (
    levelOrCode: IAcademicLevel | ICodeValidationToEmployee
  ) => {
    if (opened.type === "listOfAcademicLevel") {
      setSelectedAcademicLevel(levelOrCode as IAcademicLevel);
      form.setValues({
        name: levelOrCode.name,
        description: levelOrCode.description,
      });
    }

    if (opened.type === "listOfCodeToCreateEmployee") {
      setSelectedCodeValidationToEmployee(
        levelOrCode as ICodeValidationToEmployee
      );
      form.setValues({
        name: levelOrCode.characters,
        description: levelOrCode.description,
      });
    }

    setIsEditing(true);
  };

  const handleDelete = (levelOrCodeId: number) => {
    if (opened.type === "listOfAcademicLevel") {
      mutateDeleteAcademicLevel(levelOrCodeId);
    } else {
      mutateDeleteCodeValidationToEmployee(levelOrCodeId);
    }
  };

  const onClose = () => {
    setOpened({ status: false, type: "none" });
  };

  const resetForm = () => {
    form.reset();
    setIsEditing(false);
    setSelectedAcademicLevel(null);
  };

  return (
    <Modal
      opened={
        (opened.status && opened.type === "listOfAcademicLevel") ||
        opened.type === "listOfCodeToCreateEmployee"
      }
      onClose={() => {
        onClose();
        resetForm();
      }}
      title={`${
        opened.type === "listOfAcademicLevel"
          ? "Todos nives académicos"
          : "Todos códigos para criar um funcionário"
      }`}
      size="lg"
    >
      <Stack spacing="md">
        {/* Form Section */}
        <Card withBorder>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack spacing="sm">
              <TextInput
                label="Nome"
                placeholder="Digite o nome"
                required
                {...form.getInputProps("name")}
              />
              <TextInput
                label="Descrição"
                placeholder="Digite a descrição"
                required
                {...form.getInputProps("description")}
              />
              <Group justify="flex-end">
                {isEditing && (
                  <Button variant="light" color="gray" onClick={resetForm}>
                    Cancelar
                  </Button>
                )}
                <Button
                  type="submit"
                  leftSection={<IconPlus size={16} />}
                  loading={
                    createAcademicLevelIsPending ||
                    createCodeValidationToEmployeeIsPending ||
                    updateAcademicLevelIsPending ||
                    updateCodeValidationToEmployeeIsPending
                  }
                >
                  {isEditing ? "Atualizar" : "Adicionar"}
                </Button>
              </Group>
            </Stack>
          </form>
        </Card>

        {/* List Section */}
        <Stack spacing="sm">
          {opened.type === "listOfAcademicLevel" ? (
            academicLevelData?.map((level) => (
              <Card key={level.id} withBorder>
                <Group justify="space-between" align="flex-start">
                  <Stack spacing="xs">
                    <Group>
                      <Text fw={500}>{level.name}</Text>
                    </Group>
                    <Text size="sm" c="dimmed">
                      {level.description}
                    </Text>
                  </Stack>
                  <Group>
                    <ActionIcon
                      variant="light"
                      color="blue"
                      onClick={() => handleEdit(level)}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon
                      variant="light"
                      color="red"
                      onClick={() => handleDelete(level.id)}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Group>
              </Card>
            ))
          ) : codeValidationToCreateEmployee?.length === 0 ? (
            <div className="flex w-full justify-center items-center">
              Nehum Código encontrado cria um novo código
            </div>
          ) : (
            codeValidationToCreateEmployee?.map((code) => (
              <Card key={code.id} withBorder>
                <Group justify="space-between" align="flex-start">
                  <Stack spacing="xs">
                    <Group>
                      <Text fw={500}>{code.characters}</Text>
                    </Group>
                    <Text size="sm" c="dimmed">
                      {code.description}
                    </Text>
                  </Stack>
                  <Group>
                    <ActionIcon
                      variant="light"
                      color="blue"
                      onClick={() => handleEdit(code)}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon
                      variant="light"
                      color="red"
                      onClick={() => handleDelete(code.id)}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Group>
              </Card>
            ))
          )}
        </Stack>
      </Stack>
    </Modal>
  );
}
