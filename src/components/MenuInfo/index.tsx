import { modalAtom } from "@/storage/atom";
import { Menu, Button } from "@mantine/core";
import {
  IconCategory,
  IconCodeAsterisk,
  IconDeviceGamepad3,
  IconUsers,
} from "@tabler/icons-react";
import { useSetAtom } from "jotai";

export default function MenuInfo() {
  const setModalOpened = useSetAtom(modalAtom);

  return (
    <Menu width={200} shadow="md">
      <Menu.Target>
        <Button>Mais</Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          leftSection={<IconUsers size={14} />}
          onClick={() =>
            setModalOpened({ type: "listOfEmployees", status: true })
          }
        >
          Funcionários
        </Menu.Item>
        <Menu.Item
          leftSection={<IconCategory size={14} />}
          onClick={() =>
            setModalOpened({ type: "openListOfCategories", status: true })
          }
        >
          Categorias
        </Menu.Item>
        <Menu.Item leftSection={<IconDeviceGamepad3 size={14} />}>
          Nivel académico
        </Menu.Item>
        <Menu.Item leftSection={<IconCodeAsterisk size={14} />}>
          Código para novo funcionário
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
