// types.ts
"use client";
// EmployeeAppointmentsModal.tsx
import { useState } from "react";
import {
  Modal,
  Button,
  Group,
  Stack,
  Table,
  Text,
  Badge,
  TextInput,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { TStatus } from "@/@types";
import AppointmentModal from "@/components/AppointmentModal";
import { IAppointment, ICurrentUser, IModalAtom } from "@/interfaces";
import useTimeConverter from "@/hooks/useTimeConverter";
import { formatCurrency } from "@/utils/formatters";
import { showStatusInPortuguese } from "@/utils";
import { useAtom } from "jotai";
import { modalAtom } from "@/storage/atom";
import Link from "next/link";

interface EmployeeAppointmentsModalProps {
  opened: IModalAtom;
  onClose: () => void;
  appointments: IAppointment[];
}

export default function EmployeeAppointmentsModal({
  opened,
  onClose,
  appointments,
}: EmployeeAppointmentsModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedAppointment, setSelectedAppointment] =
    useState<IAppointment | null>(null);
  const [modalOpened, SetModalOpened] = useAtom(modalAtom);
  const currentUser = JSON.parse(
    localStorage.getItem("userInfo") as string
  ) as ICurrentUser;

  const { convertMinutes } = useTimeConverter();

  const getStatusColor = (status: TStatus) => {
    const colors = {
      PENDING: "yellow",
      CONFIRMED: "green",
      CANCELED: "red",
      COMPLETED: "blue",
    };
    return colors[status];
  };

  const searchName = currentUser.role === "EMPLOYEE" ? "client" : "employee";

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment?.[searchName]?.username
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      appointment.service?.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesDate = selectedDate
      ? new Date(appointment.date).toDateString() ===
        selectedDate.toDateString()
      : true;

    return matchesSearch && matchesDate;
  });
  const handleViewDetails = (appointment: IAppointment) => {
    setSelectedAppointment(appointment);
    SetModalOpened({ type: "updateAppointmentStatus", status: true });
  };

  const formatDateTime = (date: Date, time: string) => {
    return new Date(date).toLocaleDateString() + " " + time;
  };

  return (
    <>
      <Modal
        opened={opened.type === "listOfAppointments" && opened.status}
        onClose={onClose}
        title="Meus Agendamentos"
        size="xl"
      >
        <Stack>
          <Group>
            <TextInput
              placeholder="Pesquisa por cliente ou serviço"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              style={{ flex: 1 }}
            />
            <DatePickerInput
              placeholder="Filter by date"
              value={selectedDate}
              onChange={setSelectedDate}
              clearable
            />
          </Group>

          {filteredAppointments.length === 0 ? (
            <Text color="dimmed" align="center" py="xl">
              Nenhum agendamento encontrado.
            </Text>
          ) : (
            <Table striped highlightOnHover>
              <thead style={{ textAlign: "center" }}>
                <tr>
                  <th>Data e hora</th>
                  <th>
                    {currentUser.role === "EMPLOYEE"
                      ? "Clientes"
                      : "Funcionários"}
                  </th>
                  <th>Serviço</th>
                  <th>Estato</th>
                  {currentUser.role === "EMPLOYEE" && <th>Acções</th>}
                </tr>
              </thead>
              <tbody style={{ textAlign: "center" }}>
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td>
                      {formatDateTime(appointment.date, appointment.hour)}
                    </td>
                    <td onClick={onClose}>
                      {currentUser.role === "EMPLOYEE" ? (
                        <Link href={`/profile/${appointment.client.id}/CLIENT`}>
                          {appointment.client.username}
                        </Link>
                      ) : (
                        <Link
                          href={`/profile/${appointment.employee.id}/${appointment.employee.role}`}
                        >
                          {appointment.employee.username}
                        </Link>
                      )}
                    </td>
                    <td>
                      <Text size="sm">{appointment.service.name}</Text>
                      <Text size="xs" color="dimmed">
                        {convertMinutes(appointment.service.duration)} •{" "}
                        {formatCurrency(appointment.service.price)}
                      </Text>
                    </td>
                    <td>
                      <Badge color={getStatusColor(appointment.status)}>
                        {showStatusInPortuguese(appointment.status)}
                      </Badge>
                    </td>
                    {currentUser.role === "EMPLOYEE" && (
                      <td>
                        <Button
                          variant="subtle"
                          size="xs"
                          onClick={() => handleViewDetails(appointment)}
                        >
                          Ver detalhes
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Stack>
      </Modal>

      {selectedAppointment && (
        <AppointmentModal
          opened={modalOpened}
          onClose={() => {
            SetModalOpened({ type: "updateAppointmentStatus", status: false });
            setSelectedAppointment(null);
          }}
          appointment={selectedAppointment}
        />
      )}
    </>
  );
}
