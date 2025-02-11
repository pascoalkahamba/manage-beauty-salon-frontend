// types.ts
"use client";
export interface ServiceType {
  id: string;
  name: string;
  category: string;
  price: number;
  photoUrl: string;
  duration: number;
}

// ServiceForm.tsx
import { useForm } from "@mantine/form";
import {
  Avatar,
  Center,
  FileInput,
  NumberInput,
  Select,
  Textarea,
} from "@mantine/core";

interface ServiceFormProps {
  initialValues?: ServiceType;
  onSubmit: (values: Omit<ServiceType, "id">) => Promise<void>;
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

  const form = useForm({
    initialValues: initialValues || {
      name: "",
      category: "",
      price: 0,
      duration: 30,
      photoUrl: "",
    },
    validate: {
      name: (value) =>
        value.length < 2 ? "Name must be at least 2 characters" : null,
      category: (value) => (!value ? "Category is required" : null),
      price: (value) => (value < 0 ? "Price must be positive" : null),
      duration: (value) =>
        value < 15 ? "Duration must be at least 15 minutes" : null,
    },
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

  const categories = [
    "Hair Care",
    "Nail Care",
    "Skin Care",
    "Massage",
    "Makeup",
    "Other",
  ];

  return (
    <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
      <Stack spacing="md">
        <Center>
          <Avatar src={previewUrl} size={120} radius="md" className="mb-6" />
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
          label="Nome do serviço"
          placeholder="e.g., Haircut"
          {...form.getInputProps("name")}
          mb="md"
        />
        <Textarea
          required
          label="Descrição"
          placeholder="Digete uma descrição"
          {...form.getInputProps("bio")}
        />

        <Select
          required
          label="Escolha a categoria"
          placeholder="Escolha uma categoria"
          data={categories}
          {...form.getInputProps("category")}
          mb="md"
        />

        <Group grow mb="md">
          <NumberInput
            required
            label="Preço (AKZ)"
            placeholder="0.00"
            min={0}
            precision={2}
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
import { useState } from "react";
import {
  Modal,
  Button,
  Group,
  Stack,
  Table,
  Text,
  ActionIcon,
  Card,
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

interface ServicesManagementModalProps {
  opened: boolean;
  onClose: () => void;
  services: ServiceType[];
  onAddService: (service: Omit<ServiceType, "id">) => Promise<void>;
  onUpdateService: (
    id: string,
    service: Omit<ServiceType, "id">
  ) => Promise<void>;
  onDeleteService: (id: string) => Promise<void>;
}

export default function ServicesManagementModal({
  onClose,
  services,
  onAddService,
  onUpdateService,
  onDeleteService,
}: ServicesManagementModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [formDrawerOpened, setFormDrawerOpened] = useState(false);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [editingService, setEditingService] = useState<ServiceType | null>(
    null
  );
  const [selectedService, setSelectedService] = useState<ServiceType | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const opened = useAtomValue(modalAtom);

  const filteredServices = services.filter(
    (service) =>
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = async (values: Omit<ServiceType, "id">) => {
    try {
      setLoading(true);
      await onAddService(values);
      setFormDrawerOpened(false);
      notifications.show({
        title: "Success",
        message: "Service added successfully",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to add service",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (values: Omit<ServiceType, "id">) => {
    if (!editingService) return;

    try {
      setLoading(true);
      await onUpdateService(editingService.id, values);
      setFormDrawerOpened(false);
      setEditingService(null);
      notifications.show({
        title: "Success",
        message: "Service updated successfully",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to update service",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await onDeleteService(id);
      setDeleteModalOpened(false);
      setSelectedService(null);
      notifications.show({
        title: "Success",
        message: "Service deleted successfully",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to delete service",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
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
                      <Badge>{service.category}</Badge>
                    </td>
                    <td>{service.duration} min</td>
                    <td>${service.price.toFixed(2)}</td>
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
          loading={loading}
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
