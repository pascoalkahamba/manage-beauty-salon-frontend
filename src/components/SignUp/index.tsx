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
  Divider,
  Checkbox,
  Anchor,
  Stack,
  Select,
} from "@mantine/core";
import { zodResolver } from "mantine-form-zod-resolver";
import Link from "next/link";
import { createAccountSchema } from "@/schemas";
import CustomButton from "@/components/CustomButton";
import { TDataCreateAccountProps } from "@/@types";
import { MultiSelect } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { ICreateAccount } from "@/interfaces";
import { createAccount } from "@/servers";

export default function SignUp(props: PaperProps) {
  const { mutate, isPending, isError } = useMutation({
    onMutate: (data: ICreateAccount) => createAccount(data),
    onSuccess: () => {
      notifications.show({
        title: "Criação de conta",
        message: "Sua conta foi criada com sucesso.",
        position: "top-right",
      });
    },
    onError: () => {
      notifications.show({
        title: "Criação de conta",
        message: "Erro ao criar conta.",
        position: "top-right",
      });
    },
  });

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
      terms: false,
      username: "",
      password: "",
      confirmPassword: "",
      cellphone: "",
      professionId: 0,
      serviceId: 0,
      academicLevel: "",
    },
    validate: zodResolver(createAccountSchema),
  });

  async function handleSubmit(values: TDataCreateAccountProps) {
    const {
      username,
      email,
      password,
      academicLevel,
      confirmPassword,
      cellphone,
      servicesIds,
      categoriesIds,
    } = values;

    mutate({
      username,
      email,
      password,
      academicLevel,
      role: values.terms ? "EMPLOYEE" : "CLIENT",
      cellphone,
      servicesIds,
      categoriesIds,
    });
    // if (password.trim() !== confirmPassword.trim()) {
    //   notifications.show({
    //     title: "Criação de conta",
    //     message: "As senhas devem ser iguais.",
    //     position: "top-right",
    //     color: "red",
    //   });
    //   return;
    // }
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
          {!form.values.terms && (
            <MultiSelect
              label="Escolhe suas categorias"
              placeholder="Escohe suas categorias"
              data={allServices}
            />
          )}
          {form.values.terms && (
            <MultiSelect
              label="Escolhe seus serviços"
              placeholder="Escolhe seus serviços"
              data={allServices}
            />
          )}
          <Group justify="space-between" mt="xs">
            <Checkbox
              label="Você é um funcionário"
              checked={form.values.terms}
              onChange={(event) =>
                form.setFieldValue("terms", event.currentTarget.checked)
              }
            />

            <CustomButton
              size="sm"
              radius="xl"
              type="submit"
              target="Cadastrar"
              targetPedding="Cadastrando"
              isPending={isPending}
            />
          </Group>
          <Link href="/signIn">
            <Anchor component="button" type="button" c="dimmed" size="xs">
              Já tenho uma conta? Entrar
            </Anchor>
          </Link>
        </Stack>
      </form>
    </Paper>
  );
}
