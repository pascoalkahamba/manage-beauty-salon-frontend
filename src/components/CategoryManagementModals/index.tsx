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
import { z } from "zod";
import { IconUpload, IconEdit, IconTrash, IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { useAtom } from "jotai";
import { modalAtom } from "@/storage/atom";

// Types
export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  photoUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  services: Service[];
}

// Schema for single service validation
const serviceSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0, "Price must be positive"),
  duration: z.number().min(1, "Duration must be at least 1 minute"),
  photo: z.any().optional(),
});

// Schema for Category with services
const CategoriaSchema = z.object({
  name: z.string().min(3, "Category name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  services: z.array(serviceSchema).min(4, "At least 4 services are required"),
});

type CategoriaFormValues = z.infer<typeof CategoriaSchema>;

// Categories List Modal
export interface CategoriesModalProps {
  opened: boolean;
  onClose: () => void;
  categories: Category[];
  onDelete: (id: string) => void;
  onEdit: (Category: Category) => void;
  onAdd: () => void;
}

export function CategoriesModal({
  categories,
  onDelete,
  onEdit,
  onAdd,
}: CategoriesModalProps) {
  const [opened, setOpened] = useAtom(modalAtom);

  function openAddNewCategoria() {
    setOpened({ status: true, type: "addNewCategory" });
    onAdd();
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
            leftIcon={<IconPlus size={16} />}
            onClick={openAddNewCategoria}
          >
            Adicionar nova categoria
          </Button>
        </Group>

        <Table striped highlightOnHover>
          <thead>
            <tr>
              <th>Nome da categoria</th>
              <th>Descrição</th>
              <th>Quantidade de serviços</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((Category) => (
              <tr key={Category.id}>
                <td>{Category.name}</td>
                <td>{Category.description}</td>
                <td>{Category.services.length}</td>
                <td>
                  <Group spacing="xs">
                    <ActionIcon color="blue" onClick={() => onEdit(Category)}>
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon
                      color="red"
                      onClick={() => onDelete(Category.id)}
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

// New Category Form Modal with Services
export interface CategoriaFormModalProps {
  opened: boolean;
  onClose: () => void;
  initialData?: Category;
  onSubmit: (values: CategoriaFormValues) => void;
}

export function CategoryFormModal({
  initialData,
  onSubmit,
}: CategoriaFormModalProps) {
  const [active, setActive] = useState(0);
  const [opened, setOpened] = useAtom(modalAtom);

  const onClose = () => {
    setOpened({ status: false, type: "none" });
  };

  const [servicePhotos, setServicePhotos] = useState<{ [key: number]: string }>(
    {}
  );

  const form = useForm<CategoriaFormValues>({
    initialValues: initialData || {
      name: "",
      description: "",
      services: Array(4).fill({
        name: "",
        description: "",
        price: 0,
        duration: 30,
        photo: null,
      }),
    },
    validate: zodResolver(CategoriaSchema),
  });

  const handleSubmit = (values: CategoriaFormValues) => {
    onSubmit(values);
    onClose();
    form.reset();
    setActive(0);
    setServicePhotos({});
  };

  const handleFileChange = (file: File | null, index: number) => {
    const services = [...form.values.services];
    services[index] = { ...services[index], photo: file };
    form.setFieldValue("services", services);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setServicePhotos((prev) => ({
          ...prev,
          [index]: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    } else {
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
                      <Text>R$ {service.price}</Text>
                      <Text size="sm">{service.duration} min</Text>
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
            <Button type="submit" color="green">
              Salvar
            </Button>
          )}
        </Group>
      </form>
    </Modal>
  );
}
