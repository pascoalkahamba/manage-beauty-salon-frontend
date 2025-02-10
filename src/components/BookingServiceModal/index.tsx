// schema.ts
"use client";
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
  Button,
  Select,
  Paper,
  Divider,
} from "@mantine/core";
import { DatePickerInput, TimeInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import { IconClock, IconCurrency, IconCategory } from "@tabler/icons-react";
import { BookingFormValues } from "@/@types";
import { bookingSchema } from "@/schemas";
import { useAtom, useAtomValue } from "jotai";
import { currentServiceAtom, modalAtom } from "@/storage/atom";
import { IDataForCreateAppointment, IService } from "@/interfaces";
import { Dispatch, SetStateAction } from "react";
import { useFormatCurrency } from "@/hooks/useFormatCurrency";
import useTimeConverter from "@/hooks/useTimeConverter";

interface BookingModalProps {
  appointmentIsPending: boolean;
  appointmentIsError: boolean;
  setCanEdit?: Dispatch<SetStateAction<boolean>>;
  canEdit?: boolean;
  onAddToCart: (item: IDataForCreateAppointment) => void;
  onBookNow: (item: IDataForCreateAppointment) => void;
}

export function BookingModal({
  onAddToCart,
  canEdit,
  setCanEdit,
  onBookNow,
}: BookingModalProps) {
  const form = useForm<BookingFormValues>({
    initialValues: {
      employeeId: "0",
      date: new Date(),
      hour: "",
    },
    validate: zodResolver(bookingSchema),
  });

  const [modalOpened, setModalOpened] = useAtom(modalAtom);
  const service = useAtomValue(currentServiceAtom) as IService;

  const formatCurrency = useFormatCurrency(service.price);
  const { convertMinutes } = useTimeConverter();
  function onClose() {
    setModalOpened({
      type: "appointmentService",
      status: false,
    });
    if (setCanEdit) {
      setCanEdit(false);
    }
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

    onAddToCart(values);

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

    onBookNow(values);
    form.reset();
    onClose();
  };

  return (
    <Modal
      opened={
        (modalOpened.status && modalOpened.type === "appointmentService") ||
        canEdit!
      }
      onClose={onClose}
      size="xl"
      title={<Title order={2}>{service.name}</Title>}
      overlayProps={{
        color: "#1a1a1e4f",
        opacity: 0.7,
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
              <Text>{convertMinutes(service.duration)}</Text>
            </Group>

            <Group>
              <IconCurrency size={20} />
              <Text fw={500}>{formatCurrency}</Text>
            </Group>
          </Stack>

          <Text mt="md">{service.description}</Text>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper p="md" radius="md" withBorder>
            <form onSubmit={form.onSubmit(handleAddToCart)}>
              <Stack gap="md">
                <Title order={3}>
                  {canEdit ? "Atualizar Agendamento" : "Agendar Serviço"}
                </Title>

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
                    className="p-1"
                    color="red"
                    onClick={onClose}
                  >
                    Cancelar
                  </Button>

                  <Button onClick={() => form.onSubmit(handleBookNow)()}>
                    {canEdit ? "Atualizar" : "Agendar Agora"}
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
