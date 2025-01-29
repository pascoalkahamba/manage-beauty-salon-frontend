// schema.ts

// BookingModal.tsx
import { useForm, zodResolver } from "@mantine/form";
import {
  Modal,
  Grid,
  Image,
  Text,
  Title,
  Stack,
  Group,
  Avatar,
  Button,
  Select,
  Paper,
  Divider,
  NumberFormatter,
} from "@mantine/core";
import { DatePickerInput, TimeInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import { IconClock, IconCurrency, IconCategory } from "@tabler/icons-react";
import { BookingFormValues } from "@/@types";
import { bookingSchema } from "@/schemas";
import { useAtom } from "jotai";
import { modalAtom } from "@/storage/atom";
import { ICart, ICreateAppointment, IService } from "@/interfaces";

export interface Employee {
  id: string;
  name: string;
  avatar: string;
  specialties: string[];
  availability: string[];
}

export interface ICart {
  serviceId: string;
  employeeId: string;
  date: Date;
  hour: string;
}

interface BookingModalProps {
  service: IService;
  appointmentIsPending: boolean;
  appointmentIsError: boolean;
  onAddToCart: (item: ICart) => void;
  onBookNow: (item: ICreateAppointment) => void;
}

export function BookingModal({
  service,
  onAddToCart,
  onBookNow,
}: BookingModalProps) {
  const form = useForm<BookingFormValues>({
    initialValues: {
      employeeId: 0,
      date: new Date(),
      hour: "",
    },
    validate: zodResolver(bookingSchema),
  });

  const [modal, setModal] = useAtom(modalAtom);

  function onClose() {
    setModal({
      type: "appointmentServie",
      status: false,
    });
  }

  // Helper function to check if hour slot is available
  const isTimeSlotAvailable = (
    employeeId: number,
    date: Date,
    hour: string
  ) => {
    const employee = service.employees.find((emp) => emp.id === employeeId);
    return !employee?.availability?.includes(hour) || false;
  };

  // Helper function to format cart item
  const createCartItem = (values: BookingFormValues): ICart => {
    return {
      clientId: 3,
      appointment: {
        serviceId: values.serviceId,
        employeeId: values.employeeId,
        date: values.date,
        hour: values.hour,
      },
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

    if (!isTimeSlotAvailable(+values.employeeId, values.date, values.hour)) {
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

    if (!isTimeSlotAvailable(+values.employeeId, values.date, values.hour)) {
      notifications.show({
        title: "Horário Indisponível",
        message:
          "Este horário não está disponível para o profissional selecionado",
        color: "red",
      });
      return;
    }

    const cartItem = createCartItem(values);
    onBookNow(values);
    form.reset();
    onClose();
  };

  return (
    <Modal
      opened={modal.status}
      onClose={onClose}
      size="xl"
      title={<Title order={2}>{service.name}</Title>}
      overlayProps={{
        color: "#1a1a1e4f",
        opacity: 0.3,
        blur: 2,
      }}
    >
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Image
            src={
              !service.picture.url
                ? "/images/haircutWoman.jpg"
                : service.picture.url
            }
            alt={service.picture.name}
            radius="md"
            h={300}
            fit="cover"
          />

          <Stack mt="md" gap="xs">
            <Group>
              <IconCategory size={20} />
              <Text>{service.category.name}</Text>
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
                    value: `${emp.id}`,
                    label: emp.username,
                  }))}
                  error={form.errors.employeeId}
                  {...form.getInputProps("employeeId")}
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
                  error={form.errors.hour}
                  {...form.getInputProps("hour")}
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
