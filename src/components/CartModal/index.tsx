// types.ts
export interface CartAppointment {
  id: number;
  serviceName: string;
  employeeName: string;
  date: Date;
  time: string;
  price: number;
  duration: number;
}

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
  LoadingOverlay,
} from "@mantine/core";
import { DatePickerInput, TimeInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import { IconTrash, IconEdit, IconCalendarCheck } from "@tabler/icons-react";
import { useAtom } from "jotai";
import { modalAtom } from "@/storage/atom";
import { IAppointment } from "@/interfaces";
import useTimeConverter from "@/hooks/useTimeConverter";
import { formatCurrency } from "@/utils/formatters";

interface CartModalProps {
  appointments: IAppointment[];
  onDeleteAppointment: (id: number) => Promise<void>;
  onUpdateAppointment: (id: number, date: Date, time: string) => Promise<void>;
  onScheduleAppointment: (id: number) => Promise<void>;
  onScheduleAll: () => Promise<void>;
  onClearCart: () => Promise<void>;
}

export default function CartModal({
  appointments,
  onDeleteAppointment,
  onUpdateAppointment,
  onScheduleAppointment,
  onScheduleAll,
  onClearCart,
}: CartModalProps) {
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDate, setEditDate] = useState<Date | null>(null);
  const [editTime, setEditTime] = useState("");

  const [opened, setOpened] = useAtom(modalAtom);

  const { convertMinutes } = useTimeConverter();

  const totalPrice = appointments.reduce(
    (sum, app) => sum + app.service.price,
    0
  );
  const totalDuration = appointments.reduce(
    (sum, app) => sum + app.service.duration,
    0
  );

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      await onDeleteAppointment(id);
      notifications.show({
        title: "Success",
        message: "Appointment removed from cart",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to remove appointment",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: number) => {
    if (!editDate || !editTime) {
      notifications.show({
        title: "Error",
        message: "Please select both date and time",
        color: "red",
      });
      return;
    }

    try {
      setLoading(true);
      await onUpdateAppointment(id, editDate, editTime);
      setEditingId(null);
      setEditDate(null);
      setEditTime("");
      notifications.show({
        title: "Success",
        message: "Appointment updated successfully",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to update appointment",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSchedule = async (id: number) => {
    try {
      setLoading(true);
      await onScheduleAppointment(id);
      notifications.show({
        title: "Success",
        message: "Appointment scheduled successfully",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to schedule appointment",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const onClose = () => setOpened({ type: "openCart", status: false });

  const handleScheduleAll = async () => {
    try {
      setLoading(true);
      await onScheduleAll();
      notifications.show({
        title: "Success",
        message: "All appointments scheduled successfully",
        color: "green",
      });
      onClose();
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to schedule appointments",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClearCart = async () => {
    try {
      setLoading(true);
      await onClearCart();
      notifications.show({
        title: "Success",
        message: "Cart cleared successfully",
        color: "green",
      });
      onClose();
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to clear cart",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      opened={opened.type === "openCart" && opened.status}
      onClose={onClose}
      title="Seus agendamentos no carrinho"
      size="lg"
    >
      <LoadingOverlay visible={loading} />

      <Stack spacing="md">
        {appointments.length === 0 ? (
          <Text color="dimmed" align="center" py="xl">
            Seu carrinho esta vazio.
          </Text>
        ) : (
          <>
            {appointments.map((appointment) => (
              <Card key={appointment.id} withBorder padding="sm">
                <Group position="apart" justify="space-between">
                  <div>
                    <Text weight={500}>{appointment.service.name}</Text>
                    <Text size="sm" color="dimmed">
                      Com {appointment.employee.username}
                    </Text>
                    <Group spacing="xs" mt={4}>
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
                    >
                      Agendar
                    </Button>
                  </Group>
                </Group>

                {editingId === appointment.id && (
                  <Stack spacing="xs" mt="md">
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
                    <Group position="right">
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
                      >
                        Atualizar
                      </Button>
                    </Group>
                  </Stack>
                )}
              </Card>
            ))}

            <Divider my="md" />

            <Group position="apart" className="w-full">
              <div>
                <Text size="sm">
                  Total da duração: {convertMinutes(totalDuration)}
                </Text>
                <Text weight={500}>
                  Total do preço: {formatCurrency(totalPrice)}
                </Text>
              </div>
              <Group className="flex items-center justify-end w-full">
                <Button variant="subtle" color="red" onClick={handleClearCart}>
                  Limpar o Carrinho
                </Button>
                <Button onClick={handleScheduleAll}>Agendar Todos</Button>
              </Group>
            </Group>
          </>
        )}
      </Stack>
    </Modal>
  );
}
