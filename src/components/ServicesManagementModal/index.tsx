// types.ts
"use client";

import { useMemo, useState } from "react";
import {
  Modal,
  Button,
  Group,
  Stack,
  Table,
  Text,
  ActionIcon,
  TextInput,
  Drawer,
  Badge,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconSearch,
  IconEdit,
  IconTrash,
  IconPlus,
  IconUpload,
} from "@tabler/icons-react";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import { useAtomValue } from "jotai";
import { modalAtom } from "@/storage/atom";
import { useQuery } from "@tanstack/react-query";
import { getAllCategories } from "@/servers";

// ServiceForm.tsx
import { useForm, zodResolver } from "@mantine/form";
import {
  Avatar,
  Center,
  FileInput,
  NumberInput,
  Select,
  Textarea,
} from "@mantine/core";
import { IService } from "@/interfaces";
import useTimeConverter from "@/hooks/useTimeConverter";
import { formatCurrency } from "@/utils/formatters";
import { serviceSchema } from "@/schemas";
import { ICreateService } from "@/@types";

interface ServiceFormProps {
  initialValues?: ICreateService;
  onSubmit: (values: ICreateService) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

function ServiceForm({
  initialValues,
  onSubmit,
  onCancel,
  loading,
}: ServiceFormProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialValues?.photoUrl || null
  );

  const { data: categoryData, isError: categoryIsError } = useQuery({
    queryKey: ["getAllCategories"],
    queryFn: getAllCategories,
  });

  const form = useForm({
    initialValues: initialValues || {
      name: "",
      categoryId: "0",
      description: "",
      price: 0,
      duration: 30,
      photoUrl: "",
    },
    validate: zodResolver(serviceSchema),
  });

  const handleFileChange = (file: File | null) => {
    form.setFieldValue("photo", file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(initialValues?.photoUrl || null);
    }
  };
  function handleSubmit(values: ICreateService) {
    console.log("values", values);

    onSubmit(values);
  }

  const allCategories = useMemo(() => {
    return (
      categoryData?.map((category) => ({
        value: `${category.id}`,
        label: category.name,
      })) || []
    );
  }, [categoryData]);

  if (categoryIsError) {
    return (
      <p className="p-3 font-bold text-center">
        Algo deu errado tente novamente:
      </p>
    );
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack spacing="md">
        <Center>
          <Avatar src={previewUrl} size={120} radius="md" className="mb-6" />
        </Center>

        <FileInput
          label="Carregar nova foto"
          placeholder="Carregar foto"
          name="file"
          itemType="file"
          accept="image/png,image/jpeg,image/jpg"
          icon={<IconUpload size={16} />}
          onChange={handleFileChange}
        />

        <TextInput
          required
          label="Nome do serviço"
          placeholder="escreva o nome do serviço"
          {...form.getInputProps("name")}
          mb="md"
        />
        <Textarea
          required
          label="Descrição"
          placeholder="Digete uma descrição"
          {...form.getInputProps("description")}
        />

        <Select
          required
          label="Escolha a categoria"
          placeholder="Escolha uma categoria"
          data={allCategories}
          {...form.getInputProps("categoryId")}
          mb="md"
        />

        <Group grow mb="md">
          <NumberInput
            required
            label="Preço (AKZ)"
            placeholder="0.00"
            min={0}
            {...form.getInputProps("price")}
          />

          <NumberInput
            required
            label="Duração (minutos)"
            placeholder="30"
            min={15}
            step={15}
            {...form.getInputProps("duration")}
          />
        </Group>

        <Group position="right">
          <Button variant="subtle" onClick={onCancel} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" loading={loading}>
            {initialValues ? "Atualizar serviço" : "Adicionar serviço"}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

// ServicesManagementModal.tsx

interface ServicesManagementModalProps {
  onClose: () => void;
  services: IService[];
  isPendingEdit: boolean;
  isPendingAdd: boolean;
  onAddService: (service: ICreateService) => Promise<void>;
  onUpdateService: (id: number, service: ICreateService) => Promise<void>;
  onDeleteService: (id: number) => Promise<void>;
}

export default function ServicesManagementModal({
  onClose,
  services,
  isPendingEdit,
  isPendingAdd,
  onAddService,
  onUpdateService,
  onDeleteService,
}: ServicesManagementModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [formDrawerOpened, setFormDrawerOpened] = useState(false);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [editingService, setEditingService] = useState<IService | null>(null);
  const [selectedService, setSelectedService] = useState<IService | null>(null);
  const [loading, setLoading] = useState(false);

  const { convertMinutes } = useTimeConverter();

  const opened = useAtomValue(modalAtom);

  const filteredServices = services.filter(
    (service) =>
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = async (values: ICreateService) => {
    await onAddService(values);
    setFormDrawerOpened(false);
  };

  const handleUpdate = async (values: ICreateService) => {
    if (!editingService) return;
    await onUpdateService(editingService.id, values);
    setFormDrawerOpened(false);
    setEditingService(null);
  };

  const handleDelete = async (id: number) => {
    await onDeleteService(id);
    setDeleteModalOpened(false);
    setSelectedService(null);
  };
  return (
    <>
      <Modal
        opened={opened.type === "openModalServices" && opened.status}
        onClose={onClose}
        title="Todos Serviços"
        size="xl"
      >
        <Stack spacing="md">
          <Group position="apart">
            <TextInput
              placeholder="Pesquisar serviços..."
              icon={<IconSearch size={14} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              style={{ flex: 1 }}
            />
            <Button
              leftIcon={<IconPlus size={16} />}
              onClick={() => {
                setEditingService(null);
                setFormDrawerOpened(true);
              }}
            >
              Adicionar Serviço
            </Button>
          </Group>

          {filteredServices.length === 0 ? (
            <Text color="dimmed" align="center" py="xl">
              Nenhum serviço encontrado.
            </Text>
          ) : (
            <Table striped highlightOnHover>
              <thead style={{ textAlign: "center" }}>
                <tr>
                  <th>Nome</th>
                  <th>Categoria</th>
                  <th>Duração</th>
                  <th>Preço</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody style={{ textAlign: "center" }}>
                {filteredServices.map((service) => (
                  <tr key={service.id}>
                    <td>{service.name}</td>
                    <td>
                      <Badge>{service.category.name}</Badge>
                    </td>
                    <td>{convertMinutes(service.duration)}</td>
                    <td>{formatCurrency(service.price)}</td>
                    <td className="flex gap-3 items-center justify-center mt-2 w-full">
                      <ActionIcon
                        color="blue"
                        onClick={() => {
                          setEditingService(service);
                          setFormDrawerOpened(true);
                        }}
                      >
                        <IconEdit size={16} />
                      </ActionIcon>
                      <ActionIcon
                        color="red"
                        onClick={() => {
                          setSelectedService(service);
                          setDeleteModalOpened(true);
                        }}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Stack>
      </Modal>

      <Drawer
        opened={formDrawerOpened}
        onClose={() => {
          setFormDrawerOpened(false);
          setEditingService(null);
        }}
        title={editingService ? "Editar serviço" : "Adicionar serviço"}
        padding="lg"
        position="right"
      >
        <ServiceForm
          initialValues={editingService || undefined}
          onSubmit={editingService ? handleUpdate : handleAdd}
          onCancel={() => {
            setFormDrawerOpened(false);
            setEditingService(null);
          }}
          loading={editingService ? isPendingEdit : isPendingAdd}
        />
      </Drawer>

      {selectedService && (
        <DeleteConfirmationModal
          opened={deleteModalOpened}
          setOpened={setDeleteModalOpened}
          type="deleteService"
          title="Eliminar Serviço"
          description={`Você tem certesa que deseja eliminar o serviço "${selectedService.name}"?`}
          onConfirmDelete={() => handleDelete(selectedService.id)}
          isPending={loading}
        />
      )}
    </>
  );
}
