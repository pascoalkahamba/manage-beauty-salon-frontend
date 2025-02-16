"use client";

import {
  Modal,
  Button,
  TextInput,
  Stack,
  Group,
  ActionIcon,
  Stepper,
  Card,
  FileInput,
  NumberInput,
  Textarea,
  Avatar,
  Table,
  Text,
  Center,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { IconUpload, IconEdit, IconTrash, IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { useAtom } from "jotai";
import { modalAtom } from "@/storage/atom";
import { ICategory } from "@/interfaces";
import { TCategoriaFormValues } from "@/@types";
import { categoriaSchema } from "@/schemas";
import useTimeConverter from "@/hooks/useTimeConverter";
import { formatCurrency } from "@/utils/formatters";

// Types

interface CategoriesModalProps {
  categories: ICategory[];
  isPending: boolean;
  onDelete: (category: ICategory) => void;
  onEdit: (category: ICategory) => void;
  onAdd: () => void;
}

export function CategoriesModal({
  categories,
  isPending,
  onDelete,
  onEdit,
  onAdd,
}: CategoriesModalProps) {
  const [opened, setOpened] = useAtom(modalAtom);

  function openAddNewCategoria() {
    setOpened({ type: "addNewCategory", status: true });
    onAdd();
  }

  if (isPending) {
    return (
      <Modal
        opened={opened.status && opened.type === "openListOfCategories"}
        onClose={() => setOpened({ status: false, type: "none" })}
        title="Todas categorias"
        size="xl"
      >
        <Center>
          <Text>Carregando...</Text>
        </Center>
      </Modal>
    );
  }
  return (
    <Modal
      opened={opened.status && opened.type === "openListOfCategories"}
      onClose={() => setOpened({ status: false, type: "none" })}
      title="Todas categorias"
      size="xl"
    >
      <Stack spacing="md">
        <Group position="right">
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={openAddNewCategoria}
          >
            Adicionar nova categoria
          </Button>
        </Group>

        <Table striped highlightOnHover>
          <thead style={{ textAlign: "center" }}>
            <tr>
              <th>Nome da categoria</th>
              <th>Descrição</th>
              <th>Quantidade de serviços</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody style={{ textAlign: "center" }}>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td>{category.description}</td>
                <td>{category.services.length}</td>
                <td>
                  <Group spacing="xs" justify="center">
                    <ActionIcon
                      color="blue"
                      onClick={() => onEdit(category)}
                      className="mt-2"
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon
                      color="red"
                      onClick={() => onDelete(category)}
                      className="mt-2"
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Stack>
    </Modal>
  );
}

// New category Form Modal with Services
export interface CategoriaFormModalProps {
  initialData?: ICategory;
  onSubmit: (values: TCategoriaFormValues) => void;
  isLoading: boolean;
}

export function CategoryFormModal({
  initialData,
  onSubmit,
  isLoading,
}: CategoriaFormModalProps) {
  const [active, setActive] = useState(0);
  const [opened, setOpened] = useAtom(modalAtom);

  const { convertMinutes } = useTimeConverter();
  const onClose = () => {
    setOpened({ status: false, type: "none" });
  };

  const [servicePhotos, setServicePhotos] = useState<{ [key: number]: string }>(
    {}
  );

  const form = useForm<TCategoriaFormValues>({
    initialValues: initialData || {
      name: "",
      description: "",
      services: Array(4).fill({
        name: "",
        description: "",
        price: 0,
        duration: 30,
        photo: "",
      }),
    },
    validate: zodResolver(categoriaSchema),
  });

  const handleSubmit = (values: TCategoriaFormValues) => {
    onSubmit(values);
    console.log("values", values);
    onClose();
    form.reset();
    setActive(0);
    setServicePhotos({});
  };

  const handleFileChange = (file: File | null, index: number) => {
    if (file && file instanceof Blob) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        const services = [...form.values.services];
        services[index] = { ...services[index], photo: base64String };
        form.setFieldValue("services", services);
        setServicePhotos((prev) => ({
          ...prev,
          [index]: base64String,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      // Handle file removal or invalid file
      const services = [...form.values.services];
      services[index] = { ...services[index], photo: "" };
      form.setFieldValue("services", services);
      const newPhotos = { ...servicePhotos };
      delete newPhotos[index];
      setServicePhotos(newPhotos);
    }
  };

  const nextStep = () => {
    if (active === 0) {
      if (!form.values.name || !form.values.description) {
        form.validate();
        return;
      }
    }
    setActive((current) => current + 1);
  };

  const prevStep = () => setActive((current) => current - 1);

  return (
    <Modal
      opened={opened.status && opened.type === "addNewCategory"}
      onClose={onClose}
      title={initialData ? "Editar Categoria" : "Adicionar Nova Categoria"}
      size="xl"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stepper active={active} breakpoint="sm" allowNextStepsSelect={false}>
          <Stepper.Step label="Detalhes da Categoria">
            <Stack spacing="md" mt="md">
              <TextInput
                label="Nome da Categoria"
                placeholder="Digite o nome da categoria"
                required
                {...form.getInputProps("name")}
              />

              <Textarea
                label="Descrição da Categoria"
                placeholder="Digite a descrição da categoria"
                required
                minRows={3}
                {...form.getInputProps("description")}
              />
            </Stack>
          </Stepper.Step>

          {[0, 1, 2, 3].map((index) => (
            <Stepper.Step key={index} label={`Serviço ${index + 1}`}>
              <Stack spacing="md" mt="md">
                <Center>
                  <Avatar
                    src={servicePhotos[index]}
                    size={120}
                    radius="md"
                    className="mb-4"
                  />
                </Center>

                <FileInput
                  label="Carregar foto"
                  placeholder="Carregar foto"
                  accept="image/png,image/jpeg,image/jpg"
                  icon={<IconUpload size={16} />}
                  onChange={(file) => handleFileChange(file, index)}
                />

                <TextInput
                  label="Nome do Serviço"
                  placeholder="Digite o nome do serviço"
                  required
                  {...form.getInputProps(`services.${index}.name`)}
                />

                <Textarea
                  label="Descrição do Serviço"
                  placeholder="Digite a descrição do serviço"
                  required
                  minRows={3}
                  {...form.getInputProps(`services.${index}.description`)}
                />

                <NumberInput
                  label="Priço (AKZ)"
                  placeholder="Digite o preço do serviço"
                  required
                  min={0}
                  precision={2}
                  {...form.getInputProps(`services.${index}.price`)}
                />

                <NumberInput
                  label="Duração (minutos)"
                  placeholder="Digite a duração do serviço"
                  required
                  min={1}
                  step={5}
                  {...form.getInputProps(`services.${index}.duration`)}
                />
              </Stack>
            </Stepper.Step>
          ))}

          <Stepper.Completed>
            <Stack spacing="md" mt="md">
              <Text size="lg" weight={500} align="center">
                Detalhes da Categoria
              </Text>

              <Card withBorder p="md">
                <Text weight={500}>Categoria: {form.values.name}</Text>
                <Text size="sm" color="dimmed">
                  {form.values.description}
                </Text>
              </Card>

              <Text weight={500} mt="md">
                Serviços:
              </Text>
              {form.values.services.map((service, index) => (
                <Card key={index} withBorder p="md">
                  <Group position="apart">
                    <div>
                      <Text weight={500}>{service.name}</Text>
                      <Text size="sm" color="dimmed">
                        {service.description}
                      </Text>
                    </div>
                    <div>
                      <Text>{formatCurrency(service.price)}</Text>
                      <Text size="sm">{convertMinutes(service.duration)}</Text>
                    </div>
                  </Group>
                </Card>
              ))}
            </Stack>
          </Stepper.Completed>
        </Stepper>

        <Group position="apart" mt="xl">
          {active > 0 && (
            <Button variant="default" onClick={prevStep}>
              Voltar
            </Button>
          )}
          {active < 5 && <Button onClick={nextStep}>Proximo</Button>}
          {active === 5 && (
            <Button type="submit" color="green" loading={isLoading}>
              Salvar
            </Button>
          )}
        </Group>
      </form>
    </Modal>
  );
}
