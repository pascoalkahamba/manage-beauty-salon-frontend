// schema.ts

// BookingModal.tsx
import { useState } from "react";
import { useForm, zodResolver } from "@mantine/form";
import {
  Modal,
  Grid,
  Image,
  Text,
  Title,
  Badge,
  Stack,
  Group,
  Avatar,
  Button,
  Select,
  Box,
  Paper,
  Divider,
  NumberFormatter,
} from "@mantine/core";
import { DatePickerInput, TimeInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import { IconClock, IconCurrency, IconCategory } from "@tabler/icons-react";
import { BookingFormValues } from "@/@types";
import { bookingSchema } from "@/schemas";

export interface Employee {
  id: string;
  name: string;
  avatar: string;
  specialties: string[];
  availability: string[];
}

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
  image: string;
  employees: Employee[];
}

export interface CartItem {
  serviceId: string;
  employeeId: string;
  date: Date;
  time: string;
}

interface BookingModalProps {
  opened: boolean;
  onClose: () => void;
  service: Service;
  onAddToCart: (item: CartItem) => void;
  onBookNow: (item: CartItem) => void;
}

export function BookingModal({
  opened,
  onClose,
  service,
  onAddToCart,
  onBookNow,
}: BookingModalProps) {
  const form = useForm<BookingFormValues>({
    initialValues: {
      serviceId: service.id,
      employeeId: "",
      date: null,
      time: "",
    },
    validate: zodResolver(bookingSchema),
  });

  // Helper function to check if time slot is available
  const isTimeSlotAvailable = (
    employeeId: string,
    date: Date,
    time: string
  ) => {
    const employee = service.employees.find((emp) => emp.id === employeeId);
    return employee?.availability.includes(time) || false;
  };

  // Helper function to format cart item
  const createCartItem = (values: BookingFormValues): CartItem => {
    return {
      serviceId: values.serviceId,
      employeeId: values.employeeId,
      date: values.date,
      time: values.time,
    };
  };

  const handleAddToCart = (values: BookingFormValues) => {
    const { hasErrors } = form.validate();

    if (hasErrors) {
      notifications.show({
        title: "Erro de Validação",
        message: "Por favor, verifique todos os campos",
        color: "red",
      });
      return;
    }

    if (!isTimeSlotAvailable(values.employeeId, values.date, values.time)) {
      notifications.show({
        title: "Horário Indisponível",
        message:
          "Este horário não está disponível para o profissional selecionado",
        color: "red",
      });
      return;
    }

    const cartItem = createCartItem(values);
    onAddToCart(cartItem);

    notifications.show({
      title: "Sucesso",
      message: "Serviço adicionado ao carrinho",
      color: "green",
    });
    onClose();
  };

  const handleBookNow = (values: BookingFormValues) => {
    const { hasErrors } = form.validate();

    if (hasErrors) {
      notifications.show({
        title: "Erro de Validação",
        message: "Por favor, verifique todos os campos",
        color: "red",
      });
      return;
    }

    if (!isTimeSlotAvailable(values.employeeId, values.date, values.time)) {
      notifications.show({
        title: "Horário Indisponível",
        message:
          "Este horário não está disponível para o profissional selecionado",
        color: "red",
      });
      return;
    }

    const cartItem = createCartItem(values);
    onBookNow(cartItem);
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="xl"
      title={<Title order={2}>{service.name}</Title>}
    >
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Image
            src={service.images[0].url}
            alt={service.images[0].alt}
            radius="md"
            h={300}
            fit="cover"
          />

          <Stack mt="md" gap="xs">
            <Group>
              <IconCategory size={20} />
              <Text>{service.category}</Text>
            </Group>

            <Group>
              <IconClock size={20} />
              <Text>{service.duration} minutos</Text>
            </Group>

            <Group>
              <IconCurrency size={20} />
              <Text fw={500}>
                <NumberFormatter
                  value={service.price}
                  prefix="R$ "
                  decimalScale={2}
                  fixedDecimalScale
                />
              </Text>
            </Group>
          </Stack>

          <Text mt="md">{service.description}</Text>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper p="md" radius="md" withBorder>
            <form onSubmit={form.onSubmit(handleAddToCart)}>
              <Stack gap="md">
                <Title order={3}>Agendar Serviço</Title>

                <Select
                  label="Profissional"
                  placeholder="Selecione um profissional"
                  data={service.employees.map((emp) => ({
                    value: emp.id,
                    label: emp.name,
                    image: emp.avatar,
                  }))}
                  error={form.errors.employeeId}
                  {...form.getInputProps("employeeId")}
                  itemComponent={({ image, label }) => (
                    <Group>
                      <Avatar src={image} radius="xl" size="sm" />
                      <div>
                        <Text size="sm">{label}</Text>
                        <Text size="xs" c="dimmed">
                          {service.employees
                            .find((emp) => emp.name === label)
                            ?.specialties.join(", ")}
                        </Text>
                      </div>
                    </Group>
                  )}
                />

                <DatePickerInput
                  label="Data"
                  placeholder="Selecione a data"
                  error={form.errors.date}
                  minDate={new Date()}
                  locale="pt-BR"
                  {...form.getInputProps("date")}
                />

                <TimeInput
                  label="Horário"
                  placeholder="Selecione o horário"
                  error={form.errors.time}
                  {...form.getInputProps("time")}
                />

                <Divider my="sm" />

                <Group grow>
                  <Button
                    variant="light"
                    onClick={() => form.onSubmit(handleAddToCart)()}
                  >
                    Adicionar ao Carrinho
                  </Button>

                  <Button onClick={() => form.onSubmit(handleBookNow)()}>
                    Agendar Agora
                  </Button>
                </Group>
              </Stack>
            </form>
          </Paper>
        </Grid.Col>
      </Grid>
    </Modal>
  );
}
