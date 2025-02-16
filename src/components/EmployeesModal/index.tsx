import { useState } from "react";
import { Modal, Table, ActionIcon, Text, Center } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import Link from "next/link";
import { notifications } from "@mantine/notifications";
import { useAtom } from "jotai";
import { modalAtom } from "@/storage/atom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteUserAccount, getAllEmployees } from "@/servers";
import { IEmployee } from "@/interfaces";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import { TRole } from "@/@types";

// Types

// Main component
export default function EmployeesModal() {
  // Mock data - replace with your actual data fetching logic
  const [opened, setOpened] = useAtom(modalAtom);
  const queryClient = useQueryClient();

  const { mutate: mutateDeleteAccount, isPending: isPendingDeleteAccount } =
    useMutation({
      mutationFn: ({ id, role }: { id: number; role: TRole }) =>
        deleteUserAccount(id, role),

      onSuccess: () => {
        notifications.show({
          title: "Eliminação conta do funcionário",
          message: "Conta eliminada com sucesso!",
          color: "green",
          position: "top-right",
        });
        queryClient.invalidateQueries({
          queryKey: ["employees"],
        });
      },
      onError: () => {
        notifications.show({
          title: "Eliminação conta do funcionário",
          message: "Erro ao eliminar conta!",
          color: "red",
          position: "top-right",
        });
      },
    });

  const {
    data: employees,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["employees"],
    queryFn: getAllEmployees,
  });
  const onClose = () => {
    setOpened({ status: false, type: "listOfEmployees" });
  };
  // Delete confirmation modal
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<IEmployee | null>(
    null
  );

  // Handle delete employee
  const onDeleteEmployee = async () => {
    mutateDeleteAccount({
      id: employeeToDelete?.id as number,
      role: employeeToDelete?.role as TRole,
    });
    setDeleteModalOpened(false);
  };
  function handleEmployeeClick(employee: IEmployee) {
    console.log("employee", employee);
    setDeleteModalOpened(true);
    setEmployeeToDelete(employee);
  }

  if (isPending) {
    return (
      <Modal
        opened={opened.status && opened.type === "listOfEmployees"}
        onClose={() => setOpened({ status: false, type: "none" })}
        title="Todas Funcionários"
        size="lg"
      >
        <Center>
          <Text>Carregando...</Text>
        </Center>
      </Modal>
    );
  }

  if (isError) {
    return (
      <Modal
        opened={opened.status && opened.type === "listOfEmployees"}
        onClose={() => setOpened({ status: false, type: "none" })}
        title="Todas Funcionários"
        size="lg"
      >
        <Center>
          <Text>Erro ao carregar os funcionários</Text>
        </Center>
      </Modal>
    );
  }

  return (
    <Modal
      opened={opened.status && opened.type === "listOfEmployees"}
      onClose={onClose}
      title="Todas Funcionários"
      size="lg"
    >
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Nome do funcionário</Table.Th>
            <Table.Th>Nivel Académico</Table.Th>
            <Table.Th>Ações</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {employees.map((employee) => (
            <Table.Tr key={employee.id}>
              <Table.Td
                onClick={() =>
                  setOpened({ status: false, type: "listOfEmployees" })
                }
              >
                <Link
                  href={`/profile/${employee.id}/${employee.role}`}
                  className="text-blue-600 hover:underline"
                >
                  {employee.username}
                </Link>
              </Table.Td>
              <Table.Td>{employee.academicLevel.name}</Table.Td>
              <Table.Td>
                <ActionIcon
                  variant="subtle"
                  color="red"
                  onClick={() => handleEmployeeClick(employee)}
                >
                  <IconTrash size={16} />
                </ActionIcon>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <DeleteConfirmationModal
        description="Você tem certeza que deseja excluir este funcionário?"
        title="Excluir Funcionário"
        opened={deleteModalOpened}
        setOpened={setDeleteModalOpened}
        type="deleteCategory"
        onConfirmDelete={onDeleteEmployee}
        isPending={isPendingDeleteAccount}
      />
    </Modal>
  );
}
