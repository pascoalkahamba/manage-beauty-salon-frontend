"use client";

import { useForm } from "@mantine/form";
import { useRouter } from "next/navigation";
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Divider,
  Anchor,
  Stack,
  Checkbox,
} from "@mantine/core";
import Link from "next/link";
import { zodResolver } from "mantine-form-zod-resolver";
import { loginSchema } from "@/schemas";
import { TDataLoginProps } from "@/@types";
import { notifications } from "@mantine/notifications";
import CustomButton from "@/components/CustomButton";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/servers";
import { ILogin } from "@/interfaces";

export default function SignIn(props: PaperProps) {
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: (values: ILogin) => login(values),
    onSuccess: (result) => {
      notifications.show({
        title: "Login realizado com sucesso",
        message: "Bem vindo ao sistema",
        color: "green",
        position: "top-right",
      });
      localStorage.setItem("userInfo", JSON.stringify(result?.user));
      localStorage.setItem("token", JSON.stringify(result?.token));
      router.push("/dashboard");
      form.reset();
    },
    onError: () => {
      notifications.show({
        title: "Erro ao fazer login",
        message: "Verifique os dados informados",
        color: "red",
        position: "top-right",
      });
    },
  });
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      terms: false,
    },
    validate: zodResolver(loginSchema),
  });

  const handleSubmit = (values: TDataLoginProps) => {
    const admin =
      values.email === "judithjustina999@gmail.com" ||
      values.email === "pascoalkahamba25@gmail.com";

    mutate({
      email: values.email,
      password: values.password,
      role: admin ? "MANAGER" : values.terms ? "EMPLOYEE" : "CLIENT",
    });
  };

  return (
    <Paper
      radius="md"
      p="xl"
      withBorder
      {...props}
      className=" w-[35%] flex flex-col justify-center"
    >
      <Text size="lg" fw={500} className="text-center font-bold">
        Fazer Login
      </Text>

      <Divider
        label="Salão de beleza Nankova em Benguela"
        labelPosition="center"
        my="lg"
      />

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            required
            label="Email"
            type="email"
            placeholder="pascoalkahamba25@gmail.com"
            value={form.values.email}
            onChange={(event) =>
              form.setFieldValue("email", event.currentTarget.value)
            }
            error={form.errors.email}
            radius="md"
          />

          <PasswordInput
            required
            label="Senha"
            placeholder="Sua senha"
            value={form.values.password}
            onChange={(event) =>
              form.setFieldValue("password", event.currentTarget.value)
            }
            error={form.errors.password}
            radius="md"
          />
          <Link
            href="/forgotPassword"
            className=" mt-[-10px] text-blue-500 hover:underline"
          >
            <span className="text-xs talic">Esqueceu a senha</span>
          </Link>
        </Stack>

        <Checkbox
          className="mt-5"
          label="Você é um funcionário"
          checked={form.values.terms}
          onChange={(event) =>
            form.setFieldValue("terms", event.currentTarget.checked)
          }
        />

        <Group justify="space-between" mt="xl">
          <Link href="/signUp">
            <Anchor component="button" type="button" c="dimmed" size="xs">
              Não tenho uma conta? Cadastrar
            </Anchor>
          </Link>
          <CustomButton
            target="Entrar"
            targetPedding="Entrando"
            size="sm"
            radius="lg"
            type="submit"
            isPending={isPending}
          />
        </Group>
      </form>
    </Paper>
  );
}
