// types.ts
export interface CartAppointment {
  id: string;
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

interface CartModalProps {
  opened: boolean;
  onClose: () => void;
  appointments: CartAppointment[];
  onDeleteAppointment: (id: string) => Promise<void>;
  onUpdateAppointment: (id: string, date: Date, time: string) => Promise<void>;
  onScheduleAppointment: (id: string) => Promise<void>;
  onScheduleAll: () => Promise<void>;
  onClearCart: () => Promise<void>;
}

export default function CartModal({
  opened,
  onClose,
  appointments,
  onDeleteAppointment,
  onUpdateAppointment,
  onScheduleAppointment,
  onScheduleAll,
  onClearCart,
}: CartModalProps) {
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDate, setEditDate] = useState<Date | null>(null);
  const [editTime, setEditTime] = useState("");

  const totalPrice = appointments.reduce((sum, app) => sum + app.price, 0);
  const totalDuration = appointments.reduce(
    (sum, app) => sum + app.duration,
    0
  );

  const handleDelete = async (id: string) => {
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

  const handleUpdate = async (id: string) => {
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

  const handleSchedule = async (id: string) => {
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
      opened={opened}
      onClose={onClose}
      title="Your Appointment Cart"
      size="lg"
    >
      <LoadingOverlay visible={loading} />

      <Stack spacing="md">
        {appointments.length === 0 ? (
          <Text color="dimmed" align="center" py="xl">
            Your cart is empty
          </Text>
        ) : (
          <>
            {appointments.map((appointment) => (
              <Card key={appointment.id} withBorder padding="sm">
                <Group position="apart">
                  <div>
                    <Text weight={500}>{appointment.serviceName}</Text>
                    <Text size="sm" color="dimmed">
                      with {appointment.employeeName}
                    </Text>
                    <Group spacing="xs" mt={4}>
                      <Badge size="sm">{appointment.duration} min</Badge>
                      <Badge size="sm" color="green">
                        ${appointment.price}
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
                      leftIcon={<IconCalendarCheck size={16} />}
                      onClick={() => handleSchedule(appointment.id)}
                    >
                      Schedule
                    </Button>
                  </Group>
                </Group>

                {editingId === appointment.id && (
                  <Stack spacing="xs" mt="md">
                    <Group grow>
                      <DatePickerInput
                        label="New Date"
                        value={editDate}
                        onChange={setEditDate}
                        minDate={new Date()}
                      />
                      <TimeInput
                        label="New Time"
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
                        Cancel
                      </Button>
                      <Button
                        size="xs"
                        onClick={() => handleUpdate(appointment.id)}
                      >
                        Update
                      </Button>
                    </Group>
                  </Stack>
                )}
              </Card>
            ))}

            <Divider my="md" />

            <Group position="apart">
              <div>
                <Text size="sm">Total Duration: {totalDuration} minutes</Text>
                <Text weight={500}>Total Price: ${totalPrice}</Text>
              </div>
              <Group>
                <Button variant="subtle" color="red" onClick={handleClearCart}>
                  Clear Cart
                </Button>
                <Button onClick={handleScheduleAll}>Schedule All</Button>
              </Group>
            </Group>
          </>
        )}
      </Stack>
    </Modal>
  );
}

// Usage Example
const ExampleUsage = () => {
  const [modalOpened, setModalOpened] = useState(false);

  const sampleAppointments: CartAppointment[] = [
    {
      id: "1",
      serviceName: "Hair Coloring",
      employeeName: "John Smith",
      date: new Date(),
      time: "14:30",
      price: 150,
      duration: 120,
    },
    {
      id: "2",
      serviceName: "Haircut",
      employeeName: "Jane Doe",
      date: new Date(),
      time: "16:30",
      price: 80,
      duration: 60,
    },
  ];

  const handleDeleteAppointment = async (id: string) => {
    // Implement API call
    console.log(`Deleting appointment ${id}`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const handleUpdateAppointment = async (
    id: string,
    date: Date,
    time: string
  ) => {
    // Implement API call
    console.log(`Updating appointment ${id} to ${date} ${time}`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const handleScheduleAppointment = async (id: string) => {
    // Implement API call
    console.log(`Scheduling appointment ${id}`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const handleScheduleAll = async () => {
    // Implement API call
    console.log("Scheduling all appointments");
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const handleClearCart = async () => {
    // Implement API call
    console.log("Clearing cart");
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  return (
    <>
      <Button onClick={() => setModalOpened(true)}>Open Cart</Button>

      <CartModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        appointments={sampleAppointments}
        onDeleteAppointment={handleDeleteAppointment}
        onUpdateAppointment={handleUpdateAppointment}
        onScheduleAppointment={handleScheduleAppointment}
        onScheduleAll={handleScheduleAll}
        onClearCart={handleClearCart}
      />
    </>
  );
};
