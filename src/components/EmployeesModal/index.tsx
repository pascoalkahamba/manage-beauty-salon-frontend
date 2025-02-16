import { useState } from "react";
import { Modal, Table, ActionIcon, Text, Center } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import Link from "next/link";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useAtom } from "jotai";
import { modalAtom } from "@/storage/atom";
import { useQuery } from "@tanstack/react-query";
import { getAllEmployees } from "@/servers";
import { IEmployee } from "@/interfaces";

// Types

// Main component
export default function EmployeesModal() {
  // Mock data - replace with your actual data fetching logic
  const [opened, setOpened] = useAtom(modalAtom);

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
  const [
    deleteModalOpened,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<IEmployee | null>(
    null
  );

  // Handle delete employee
  const handleDeleteClick = (employee: IEmployee) => {
    setEmployeeToDelete(employee);
    openDeleteModal();
  };

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
                  onClick={() => handleDeleteClick(employee)}
                >
                  <IconTrash size={16} />
                </ActionIcon>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Modal>
  );
}
