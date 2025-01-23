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
import { useMutation, useQuery } from "@tanstack/react-query";
import { ICreateAccount } from "@/interfaces";
import {
  createAccount,
  getAllAcademicLevels,
  getAllCategories,
  getAllServices,
} from "@/servers";
import { useMemo } from "react";

export default function SignUp(props: PaperProps) {
  // Inside your SignUp component

  const { data: serviceData, isError: serviceIsError } = useQuery({
    queryKey: ["getAllServices"],
    queryFn: getAllServices,
  });

  const {
    data: categoryData,

    isError: categoryIsError,
  } = useQuery({
    queryKey: ["getAllCategories"],
    queryFn: getAllCategories,
  });

  const { data: academicLevelData, isError: academicLevelIsError } = useQuery({
    queryKey: ["getAllAcademicLevels"],
    queryFn: getAllAcademicLevels,
  });

  const form = useForm({
    initialValues: {
      email: "",
      terms: false,
      username: "",
      password: "",
      confirmPassword: "",
      categoriesIds: null,
      servicesIds: null,
      cellphone: "",
      validationCode: null,
      academicLevelId: null,
    },
    validate: zodResolver(createAccountSchema),
  });

  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: (data: ICreateAccount) => createAccount(data),
    onSuccess: () => {
      notifications.show({
        title: "Criação de conta",
        message: "Sua conta foi criada com sucesso.",
        position: "top-right",
        color: "blue",
      });
      router.push("/signIn");
      form.reset();
    },
    onError: () => {
      notifications.show({
        title: "Criação de conta",
        message: "Erro ao criar conta.",
        position: "top-right",
        color: "red",
      });
    },
  });

  const allServices = useMemo(() => {
    return (
      serviceData?.map((service) => ({
        value: `${service.id}`,
        label: service.name,
      })) || []
    );
  }, [serviceData]);

  const allCategories = useMemo(() => {
    return (
      categoryData?.map((category) => ({
        value: `${category.id}`,
        label: category.name,
      })) || []
    );
  }, [categoryData]);
  const allAcademicLevels = useMemo(() => {
    return (
      academicLevelData?.map((academicLevel) => ({
        value: `${academicLevel.id}`,
        label: academicLevel.name,
      })) || []
    );
  }, [academicLevelData]);

  if (serviceIsError || categoryIsError || academicLevelIsError) {
    return (
      <p className="p-3 font-bold text-center">
        Algo deu errado tente novamente:
      </p>
    );
  }

  async function handleSubmit(values: TDataCreateAccountProps) {
    const {
      username,
      email,
      password,
      academicLevelId,
      validationCode,
      cellphone,
      servicesIds,
      categoriesIds,
    } = values;

    mutate({
      username,
      email,
      password,
      academicLevelId: Number(academicLevelId),
      validationCode,
      role: values.terms ? "EMPLOYEE" : "CLIENT",
      cellphone,
      servicesIds,
      categoriesIds,
    });
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
        <Stack className="flex flex-col gap-3 w-full">
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
          {form.values.terms && (
            <TextInput
              label="Seu codigo de acesso"
              required
              placeholder="Seu codigo de acesso"
              value={form.values.validationCode}
              onChange={(event) =>
                form.setFieldValue("validationCode", event.currentTarget.value)
              }
              radius="md"
              error={form.errors.validationCode}
            />
          )}
          {!form.values.terms && (
            <MultiSelect
              label="Escolhe suas categorias"
              data={allCategories?.map((category) => ({
                value: category.value.toString(),
                label: category.label,
              }))}
              placeholder="Escohe suas categorias"
              value={form.values.categoriesIds?.map((id) => id.toString())}
              nothingFoundMessage="Nenhuma categoria encontrada"
              onChange={(value) =>
                form.setFieldValue("categoriesIds", value.map(Number))
              }
              clearable
              required
              searchable
            />
          )}
          {form.values.terms && (
            <MultiSelect
              label="Escolhe seus serviços"
              data={allServices?.map((service) => ({
                value: service.value.toString(),
                label: service.label,
              }))}
              placeholder="Escolhe seus serviços"
              value={form.values.servicesIds?.map((id) => id.toString())}
              onChange={(value) =>
                form.setFieldValue("servicesIds", value.map(Number))
              }
              nothingFoundMessage="Nenhum serviço encontrado"
              clearable
              searchable
              required
            />
          )}
          {form.values.terms && (
            <Select
              label="Escolhe seu nível acadêmico"
              placeholder="Escolhe seu nível acadêmico"
              data={allAcademicLevels}
              value={form.values.academicLevelId}
              nothingFoundMessage="Nenhum nível acadêmico encontrado"
              onChange={(value) =>
                form.setFieldValue("academicLevelId", `${value}`)
              }
            />
          )}
          <Group justify="space-between">
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
            <Anchor
              component="button"
              type="button"
              c="dimmed"
              size="xs"
              className={`${form.values.terms ? "mb-5" : ""}`}
            >
              Já tenho uma conta? Entrar
            </Anchor>
          </Link>
        </Stack>
      </form>
    </Paper>
  );
}
