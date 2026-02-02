// CartModal.tsx
import { useState } from "react";
import {
  Modal,
  Button,
  Group,
  Stack,
  Text,
  Card,
  ActionIcon,
  Divider,
  Badge,
} from "@mantine/core";
import { DatePickerInput, TimeInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import { IconTrash, IconEdit, IconCalendarCheck } from "@tabler/icons-react";
import { useAtom } from "jotai";
import { modalAtom } from "@/storage/atom";
import { IAppointment } from "@/interfaces";
import useTimeConverter from "@/hooks/useTimeConverter";
import { formatCurrency } from "@/utils/formatters";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteAppointmentFromCart,
  updateAppointment,
  creatAppointment,
} from "@/servers";

interface CartModalProps {
  appointments: IAppointment[];
}

export default function CartModal({ appointments }: CartModalProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDate, setEditDate] = useState<Date | null>(null);
  const [editTime, setEditTime] = useState("");

  const [opened, setOpened] = useAtom(modalAtom);
  const queryClient = useQueryClient();

  const { convertMinutes } = useTimeConverter();

  const totalPrice = appointments.reduce(
    (sum, app) => sum + app.service.price,
    0,
  );
  const totalDuration = appointments.reduce(
    (sum, app) => sum + app.service.duration,
    0,
  );

  // Delete from cart mutation
  const { mutate: mutateDeleteFromCart } = useMutation({
    mutationFn: (id: number) => deleteAppointmentFromCart(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      notifications.show({
        title: "Sucesso",
        message: "Agendamento removido do carrinho com sucesso",
        color: "green",
      });
    },
    onError: () => {
      notifications.show({
        title: "Erro",
        message: "Falha ao remover agendamento",
        color: "red",
      });
    },
  });

  // Update appointment mutation
  const { mutate: mutateUpdateAppointment, isPending: isPendingUpdate } =
    useMutation({
      mutationFn: ({
        id,
        date,
        time,
      }: {
        id: number;
        date: Date;
        time: string;
      }) =>
        updateAppointment({
          id,
          date,
          hour: time,
          employeeId: appointments.find((a) => a.id === id)?.employeeId || 0,
        }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
        queryClient.invalidateQueries({ queryKey: ["appointments"] });
        setEditingId(null);
        setEditDate(null);
        setEditTime("");
        notifications.show({
          title: "Success",
          message: "Appointment updated successfully",
          color: "green",
        });
      },
      onError: () => {
        notifications.show({
          title: "Error",
          message: "Failed to update appointment",
          color: "red",
        });
      },
    });

  // Schedule appointment mutation
  const { mutate: mutateScheduleAppointment, isPending: isPendingSchedule } =
    useMutation({
      mutationFn: (id: number) => {
        const appointment = appointments.find((app) => app.id === id);
        if (appointment) {
          return creatAppointment({
            serviceId: appointment.service.id,
            employeeId: appointment.employee.id,
            date: appointment.date,
            hour: appointment.hour,
            status: "PENDING",
            clientId: appointment.clientId,
          });
        }
        return Promise.reject(new Error("Appointment not found"));
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
        queryClient.invalidateQueries({ queryKey: ["appointments"] });
        notifications.show({
          title: "Success",
          message: "Appointment scheduled successfully",
          color: "green",
        });
      },
      onError: () => {
        notifications.show({
          title: "Error",
          message: "Failed to schedule appointment",
          color: "red",
        });
      },
    });

  // Schedule all appointments mutation
  const { mutate: mutateScheduleAll, isPending: isPendingScheduleAll } =
    useMutation({
      mutationFn: async () => {
        const results = [];
        for (const appointment of appointments) {
          const result = await creatAppointment({
            serviceId: appointment.service.id,
            employeeId: appointment.employee.id,
            date: appointment.date,
            hour: appointment.hour,
            status: "PENDING",
            clientId: appointment.clientId,
          });
          results.push(result);
        }
        return results;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
        queryClient.invalidateQueries({ queryKey: ["appointments"] });
        notifications.show({
          title: "Success",
          message: "All appointments scheduled successfully",
          color: "green",
        });
        onClose();
      },
      onError: () => {
        notifications.show({
          title: "Error",
          message: "Failed to schedule appointments",
          color: "red",
        });
      },
    });

  // Clear cart mutation
  const { mutate: mutateClearCart, isPending: isPendingClearCart } =
    useMutation({
      mutationFn: async () => {
        for (const appointment of appointments) {
          await deleteAppointmentFromCart(appointment.id);
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
        notifications.show({
          title: "Success",
          message: "Cart cleared successfully",
          color: "green",
        });
        onClose();
      },
      onError: () => {
        notifications.show({
          title: "Error",
          message: "Failed to clear cart",
          color: "red",
        });
      },
    });

  const handleDelete = (id: number) => {
    mutateDeleteFromCart(id);
  };

  const handleUpdate = (id: number) => {
    if (!editDate || !editTime) {
      notifications.show({
        title: "Error",
        message: "Please select both date and time",
        color: "red",
      });
      return;
    }
    mutateUpdateAppointment({ id, date: editDate, time: editTime });
  };

  const handleSchedule = (id: number) => {
    mutateScheduleAppointment(id);
  };

  const onClose = () => setOpened({ type: "openCart", status: false });

  const handleScheduleAll = () => {
    mutateScheduleAll();
  };

  const handleClearCart = () => {
    mutateClearCart();
  };

  return (
    <Modal
      opened={opened.type === "openCart" && opened.status}
      onClose={onClose}
      title="Seus agendamentos no carrinho"
      size="lg"
    >
      <Stack gap="md">
        {appointments.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">
            Seu carrinho esta vazio.
          </Text>
        ) : (
          <>
            {appointments.map((appointment) => (
              <Card key={appointment.id} withBorder padding="sm">
                <Group justify="space-between">
                  <div>
                    <Text fw={500}>{appointment.service.name}</Text>
                    <Text size="sm" c="dimmed">
                      Com {appointment.employee.username}
                    </Text>
                    <Group gap="xs" mt={4}>
                      <Badge size="sm">
                        {convertMinutes(appointment.service.duration)}
                      </Badge>
                      <Badge size="sm" color="green">
                        {formatCurrency(appointment.service.price)}
                      </Badge>
                      <Badge size="sm" color="yellow">
                        {new Date(appointment.date).toDateString()}
                      </Badge>
                      <Badge size="sm" color="blue">
                        {appointment.hour}
                      </Badge>
                    </Group>
                  </div>

                  <Group>
                    <ActionIcon
                      color="blue"
                      onClick={() => setEditingId(appointment.id)}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon
                      color="red"
                      onClick={() => handleDelete(appointment.id)}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                    <Button
                      size="xs"
                      leftSection={<IconCalendarCheck size={16} />}
                      onClick={() => handleSchedule(appointment.id)}
                      loading={isPendingSchedule}
                    >
                      Agendar
                    </Button>
                  </Group>
                </Group>

                {editingId === appointment.id && (
                  <Stack gap="xs" mt="md">
                    <Group grow>
                      <DatePickerInput
                        label="Nova Data"
                        value={editDate}
                        onChange={setEditDate}
                        minDate={new Date()}
                      />
                      <TimeInput
                        label="Nova Hora"
                        value={editTime}
                        onChange={(e) => setEditTime(e.currentTarget.value)}
                      />
                    </Group>
                    <Group justify="right">
                      <Button
                        variant="subtle"
                        size="xs"
                        onClick={() => setEditingId(null)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        size="xs"
                        onClick={() => handleUpdate(appointment.id)}
                        loading={isPendingUpdate}
                      >
                        Atualizar
                      </Button>
                    </Group>
                  </Stack>
                )}
              </Card>
            ))}

            <Divider my="md" />

            <Group justify="apart" className="w-full">
              <div>
                <Text size="sm">
                  Total da duração: {convertMinutes(totalDuration)}
                </Text>
                <Text fw={500}>
                  Total do preço: {formatCurrency(totalPrice)}
                </Text>
              </div>
              <Group className="flex items-center justify-end w-full">
                <Button
                  variant="subtle"
                  color="red"
                  onClick={handleClearCart}
                  loading={isPendingClearCart}
                >
                  Limpar o Carrinho
                </Button>
                <Button
                  onClick={handleScheduleAll}
                  loading={isPendingScheduleAll}
                >
                  Agendar Todos
                </Button>
              </Group>
            </Group>
          </>
        )}
      </Stack>
    </Modal>
  );
}
