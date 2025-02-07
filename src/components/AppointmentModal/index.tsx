// types.ts

// AppointmentModal.tsx
import {
  Modal,
  Button,
  Text,
  Group,
  Badge,
  Stack,
  Select,
  TextInput,
} from "@mantine/core";
import { DatePickerInput, TimeInput } from "@mantine/dates";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { TStatus } from "@/@types";
import { AppointmentSchema } from "@/schemas";
import {
  IAppointment,
  ICurrentUser,
  IModalAtom,
  IUpdateAppointmentStatus,
} from "@/interfaces";
import { showStatusInPortuguese } from "@/utils";
import useTimeConverter from "@/hooks/useTimeConverter";
import { useFormatCurrency } from "@/hooks/useFormatCurrency";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStatusAppointment } from "@/servers";

interface AppointmentModalProps {
  opened: IModalAtom;
  onClose: () => void;
  appointment: IAppointment;
}

export default function AppointmentModal({
  opened,
  onClose,
  appointment,
}: AppointmentModalProps) {
  const { convertMinutes } = useTimeConverter();
  const currentUser = JSON.parse(
    localStorage.getItem("userInfo") as string
  ) as ICurrentUser;
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (appointment: IUpdateAppointmentStatus) =>
      updateStatusAppointment(appointment),
    onSuccess: () => {
      onClose();
      notifications.show({
        title: "Sucesso",
        message: "Status do agendamento alterado com sucesso!",
        color: "green",
        position: "top-right",
      });
      queryClient.invalidateQueries({
        queryKey: [`${currentUser.role}-${currentUser.id}-getOneUser`],
      });
      queryClient.invalidateQueries({
        queryKey: [`${currentUser.role}-${currentUser.id}-getAppointments`],
      });
    },

    onError: () => {
      notifications.show({
        title: "Erro",
        message: "Erro ao alterar status do agendamento!",
        color: "red",
        position: "top-right",
      });
    },
  });

  const formatCurrency = useFormatCurrency(appointment.service.price);
  const form = useForm({
    validate: zodResolver(AppointmentSchema),
    initialValues: {
      id: appointment.id,
      clientName: appointment.client.username,
      employeeName: appointment.employee.username,
      date: new Date(appointment.date),
      time: appointment.hour,
      status: appointment.status,
      notes: appointment.service.name || "",
    },
  });

  const handleStatusChange = async (status: TStatus) => {
    const message = `O estato do agendamento foi alterado para ${showStatusInPortuguese(
      status
    )} entre em contato com o funcionário para mais informações, nome do funcionário: ${
      appointment.employee.username
    } contato: ${appointment.employee.cellphone}`;
    mutate({
      id: appointment.id,
      status,
      reason: message,
    });
  };

  const getStatusColor = (status: TStatus) => {
    const colors = {
      PENDING: "yellow",
      CONFIRMED: "green",
      CANCELED: "red",
      COMPLETED: "blue",
    };
    return colors[status];
  };

  return (
    <Modal
      opened={opened.status && opened.type === "updateAppointmentStatus"}
      onClose={onClose}
      title="Detalhes do agendamento"
      size="md"
    >
      <Stack spacing="md">
        <Group position="apart">
          <Text size="sm" weight={500}>
            Estato:
          </Text>
          <Badge color={getStatusColor(form.values.status)}>
            {showStatusInPortuguese(form.values.status)}
          </Badge>
          <Text size="sm" weight={500}>
            duração:{" "}
            <Badge color="indigo">
              {convertMinutes(appointment.service.duration)}
            </Badge>
          </Text>
          <Text size="sm" weight={500}>
            Preço: <Badge color="cyan">{formatCurrency}</Badge>
          </Text>
        </Group>

        <TextInput
          label="Nome do cliente"
          {...form.getInputProps("clientName")}
          readOnly
        />

        <TextInput
          label="Nome do funcionário"
          {...form.getInputProps("employeeName")}
          readOnly
        />

        <Group grow>
          <DatePickerInput
            label="Data"
            {...form.getInputProps("date")}
            readOnly
          />
          <TimeInput label="Hora" {...form.getInputProps("time")} readOnly />
        </Group>

        <TextInput label="Serviço" {...form.getInputProps("notes")} readOnly />

        <Select
          label="Atualizar estato"
          value={form.values.status}
          data={[
            { value: "PENDING", label: "Pendente" },
            { value: "CONFIRMED", label: "Confirmado" },
            { value: "CANCELED", label: "Cancelado" },
            { value: "COMPLETED", label: "Concluído" },
          ]}
          onChange={(value) => handleStatusChange(value as TStatus)}
          disabled={isPending}
        />

        <Group position="right" mt="md">
          <Button variant="subtle" onClick={onClose}>
            Fechar
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
