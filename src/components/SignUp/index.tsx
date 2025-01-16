"use client";
import { useForm } from "@mantine/form";
import { useRouter } from "next/navigation";
import { notifications } from "@mantine/notifications";
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Divider,
  Checkbox,
  Anchor,
  Stack,
  Select,
} from "@mantine/core";
import { zodResolver } from "mantine-form-zod-resolver";
import Link from "next/link";
import { createAccountEmployeeSchema } from "@/schemas";
import CustomButton from "@/components/CustomButton";
import { DataCreateAccountEmployeePropsT } from "@/@types";

export default function SignUp(props: PaperProps) {
  const router = useRouter();

  const allServices = [
    {
      value: "1",
      label: "haircut",
    },
    {
      value: "2",
      label: "haircut",
    },
    {
      value: "3",
      label: "haircut",
    },
  ];

  const form = useForm({
    initialValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      cellphone: "",
      professionId: 0,
      serviceId: 0,
      academicLevel: "",
    },
    validate: zodResolver(createAccountEmployeeSchema),
  });

  async function handleSubmit(values: DataCreateAccountEmployeePropsT) {
    const {
      username,
      email,
      password,
      academicLevel,
      confirmPassword,
      cellphone,
      professionId,
      serviceId,
    } = values;

    if (password.trim() !== confirmPassword.trim()) {
      notifications.show({
        title: "Criação de conta",
        message: "As senhas devem ser iguais.",
        position: "top-right",
        color: "red",
      });
      return;
    }
    console.log("values", values);
  }

  return (
    <Paper radius="md" p="xl" withBorder {...props} className=" w-[35%]">
      <Text size="lg" fw={500} className="text-center font-bold">
        Criar Conta
      </Text>

      <Divider
        label="Salão de beleza Nankova em Benguela"
        labelPosition="center"
        my="lg"
      />

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            label="Nome"
            required
            placeholder="Seu nome"
            value={form.values.username}
            onChange={(event) =>
              form.setFieldValue("username", event.currentTarget.value)
            }
            radius="md"
            error={form.errors.username}
          />

          <TextInput
            required
            label="Email"
            placeholder="pascoalkahamba25@gmail.com"
            value={form.values.email}
            onChange={(event) =>
              form.setFieldValue("email", event.currentTarget.value)
            }
            radius="md"
            error={form.errors.email}
          />
          <div className="w-full flex items-center gap-2">
            <PasswordInput
              required
              label="Senha"
              placeholder="Sua senha"
              className="w-[50%]"
              value={form.values.password}
              onChange={(event) =>
                form.setFieldValue("password", event.currentTarget.value)
              }
              radius="md"
              error={form.errors.password}
            />

            <PasswordInput
              required
              label="Confirma a senha"
              placeholder="Sua senha"
              className="w-[50%]"
              value={form.values.confirmPassword}
              onChange={(event) =>
                form.setFieldValue("confirmPassword", event.currentTarget.value)
              }
              radius="md"
              error={form.errors.confirmPassword}
            />
          </div>
          <TextInput
            required
            type="number"
            label="Número de telefone"
            placeholder="Seu numero de telefone"
            value={form.values.cellphone}
            onChange={(event) =>
              form.setFieldValue("cellphone", event.currentTarget.value)
            }
            radius="md"
            error={form.errors.cellphone}
          />

          <Select
            required
            label="Selecione serviço desejado"
            placeholder="Escolha um profissão"
            value={`${form.values.serviceId}`}
            className="self-start w-full"
            onChange={(value) => form.setFieldValue("serviceId", Number(value))}
            data={allServices}
            withAsterisk
            clearable
            error={form.errors.serviceId}
            searchable
          />
          <Select
            required
            label="Selecione a profissão desejada"
            placeholder="Escolha um profissão"
            value={`${form.values.professionId}`}
            className="self-start w-full"
            onChange={(value) =>
              form.setFieldValue("professionId", Number(value))
            }
            data={allServices}
            withAsterisk
            clearable
            error={form.errors.professionId}
            searchable
          />

          <Group justify="space-between" mt="xl">
            <Link href="/signin">
              <Anchor component="button" type="button" c="dimmed" size="xs">
                Já tenho uma conta? Entrar
              </Anchor>
            </Link>
            <CustomButton
              size="sm"
              radius="xl"
              type="submit"
              target="Cadastrar"
              targetPedding="Cadastrando"
              isPending={false}
            />
          </Group>
        </Stack>
      </form>
    </Paper>
  );
}
