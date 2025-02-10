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
  ActionIcon,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { TStatus } from "@/@types";
import AppointmentModal from "@/components/AppointmentModal";
import {
  IAppointment,
  ICurrentUser,
  IDataForCreateAppointment,
  IUpdateAppointment,
} from "@/interfaces";
import useTimeConverter from "@/hooks/useTimeConverter";
import { formatCurrency } from "@/utils/formatters";
import { showStatusInPortuguese } from "@/utils";
import { useAtom } from "jotai";
import { currentServiceAtom, modalAtom } from "@/storage/atom";
import Link from "next/link";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { BookingModal } from "../BookingServiceModal";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAppointment, updateAppointment } from "@/servers";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";

interface EmployeeAppointmentsModalProps {
  onClose: () => void;
  appointments: IAppointment[];
}

export default function EmployeeAppointmentsModal({
  onClose,
  appointments,
}: EmployeeAppointmentsModalProps) {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [canEdit, setCanEdit] = useState(false);
  const currentUser = JSON.parse(
    localStorage.getItem("userInfo") as string
  ) as ICurrentUser;

  const { mutate: mutateDeleteAppointment, isPending: isPendingAppointment } =
    useMutation({
      mutationFn: (appointmentId: number) => deleteAppointment(appointmentId),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [`${currentUser.role}-${currentUser.id}-getOneUser`],
        });
        notifications.show({
          title: "Agendamento deletado",
          message: "Agendamento deletado com sucesso!",
          color: "green",
          position: "top-right",
        });
      },
      onError: () => {
        notifications.show({
          title: "Erro ao deletar agendamento",
          message: "Erro ao deletar agendamento",
          color: "red",
          position: "top-right",
        });
      },
    });

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (appointment: IUpdateAppointment) =>
      updateAppointment(appointment),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`${currentUser.role}-${currentUser.id}-getOneUser`],
      });
      notifications.show({
        title: "Atualização de agendamento",
        message: "Agendamento atualizado com sucesso!",
        color: "green",
        position: "top-right",
      });
    },
    onError: () => {
      notifications.show({
        title: "Atualização de agendamento",
        message: "Ocorreu um erro ao atualizar o agendamento.",
        color: "red",
        position: "top-right",
      });
    },
  });
  const [selectedAppointment, setSelectedAppointment] =
    useState<IAppointment | null>(null);
  const [opened, setOpened] = useAtom(modalAtom);
  const { convertMinutes } = useTimeConverter();
  const [openDeleteAppointment, setOpenDeleteAppointment] = useState(false);
  const [currentService, setCurrentService] = useAtom(currentServiceAtom);

  const getStatusColor = (status: TStatus) => {
    const colors = {
      PENDING: "yellow",
      CONFIRMED: "green",
      CANCELED: "red",
      COMPLETED: "blue",
    };
    return colors[status];
  };

  const handleAddToCart = async (item: IDataForCreateAppointment) => {
    editAppointment(item);
  };

  const onConfirmDelete = async () => {
    mutateDeleteAppointment(selectedAppointment?.id as number);
    setOpenDeleteAppointment(false);
  };

  function editAppointment(item: IDataForCreateAppointment) {
    if (currentUser.role !== "CLIENT") {
      notifications.show({
        title: "Acesso negado",
        message:
          "Você não tem permissão para editar este agendamento. Por enquanto apenas clientes podem agendar serviços.",
        color: "yellow",
        position: "top-right",
      });
      return;
    }

    mutate({
      id: selectedAppointment?.id as number,
      employeeId: +item.employeeId,
      date: item.date,
      hour: item.hour,
    });
  }

  const searchName = currentUser.role === "EMPLOYEE" ? "client" : "employee";

  function handleEdit(appointment: IAppointment) {
    if (appointment?.status !== "PENDING") {
      notifications.show({
        title: "Acesso negado",
        message:
          "Você não pode editar este agendamento. Apenas agendamentos pendentes podem ser editados.",
        color: "yellow",
        position: "top-right",
      });
      return;
    }

    setCurrentService(appointment.service);
    setSelectedAppointment(appointment);
    setCanEdit(true);

    console.log("Editando agendamento:", appointment);
    console.log("opened:", opened);
  }

  const handleDelete = async (appointment: IAppointment) => {
    // Implemente a lógica para excluir o agendamento aqui
    setOpenDeleteAppointment(true);
    setSelectedAppointment(appointment);
    setCurrentService(appointment.service);
    console.log("Excluindo agendamento:", appointment.id);
  };

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
    setOpened({ type: "updateAppointmentStatus", status: true });
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
                  {<th>Acções</th>}
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
                    {currentUser.role === "CLIENT" && (
                      <td className="flex gap-3 items-center mt-2">
                        <ActionIcon
                          color="blue"
                          onClick={() => handleEdit(appointment)}
                        >
                          <IconEdit size={16} />
                        </ActionIcon>
                        <ActionIcon
                          color="red"
                          onClick={() => handleDelete(appointment)}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>

                        {currentService && (
                          <BookingModal
                            appointmentIsPending={isPending}
                            setCanEdit={setCanEdit}
                            appointmentIsError={isError}
                            canEdit={canEdit}
                            onAddToCart={handleAddToCart}
                            onBookNow={editAppointment}
                          />
                        )}
                        {currentService && (
                          <DeleteConfirmationModal
                            type="deleteAppointment"
                            isPending={isPendingAppointment}
                            opened={openDeleteAppointment}
                            setOpened={setOpenDeleteAppointment}
                            appointment={appointment}
                            onConfirmDelete={onConfirmDelete}
                          />
                        )}
                      </td>
                    )}
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
          onClose={() => {
            setOpened({ type: "updateAppointmentStatus", status: false });
            setSelectedAppointment(null);
          }}
          appointment={selectedAppointment}
        />
      )}
    </>
  );
}
