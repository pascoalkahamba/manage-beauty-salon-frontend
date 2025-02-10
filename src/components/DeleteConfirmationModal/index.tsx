// DeleteConfirmationModal.tsx
import { TDeleteModal } from "@/@types";
import { IAppointment } from "@/interfaces";
import { Modal, Button, Group, Text, Stack } from "@mantine/core";
import { Dispatch, SetStateAction } from "react";

interface DeleteConfirmationModalProps {
  setOpened: Dispatch<SetStateAction<boolean>>;
  opened: boolean;
  isPending: boolean;
  type: TDeleteModal;
  appointment: IAppointment;
  onConfirmDelete: () => Promise<void>;
}

export default function DeleteConfirmationModal({
  opened,
  setOpened,
  isPending,
  appointment,
  onConfirmDelete,
}: DeleteConfirmationModalProps) {
  const onClose = () => {
    setOpened(false);
  };

  const handleConfirm = async () => {
    await onConfirmDelete();
  };
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Eliminar Agendamento"
      centered
      size="sm"
    >
      <Stack spacing="md">
        <Text>Você tem certeza que desejas eliminar este agendamento?</Text>

        <Stack spacing="xs">
          <Text size="sm" weight={500}>
            {appointment.service.name}
          </Text>
          <Text size="sm" color="dimmed">
            {formatDate(appointment.date)} ás {appointment.hour}
          </Text>
        </Stack>

        <Text size="sm" color="red">
          Atenção: Esta ação não pode ser desfeita.
        </Text>

        <Group position="right" mt="md">
          <Button variant="subtle" onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button color="red" onClick={handleConfirm} loading={isPending}>
            Eliminar
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
