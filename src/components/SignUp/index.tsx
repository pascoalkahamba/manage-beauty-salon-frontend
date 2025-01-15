// First, create styles file: theme.ts
"use client";
import {
  TextInput,
  PasswordInput,
  Select,
  Button,
  Paper,
  Title,
  Container,
  Grid,
  Stack,
  Image,
  Text,
  Box,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";

const registrationSchema = z
  .object({
    name: z.string().min(1, "Nome é obrigatório"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
    confirmPassword: z.string().min(6, "Confirme sua senha"),
    phone: z.string().min(9, "Número de telefone inválido"),
    service: z.string().min(1, "Selecione um serviço"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não conferem",
    path: ["confirmPassword"],
  });

type RegistrationForm = z.infer<typeof registrationSchema>;

export default function SignUp() {
  const form = useForm<RegistrationForm>({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      service: "",
    },
    validate: zodResolver(registrationSchema),
  });

  const handleSubmit = (values: RegistrationForm) => {
    console.log(values);
    // Handle form submission
  };

  return (
    <Container size="lg" py="xl">
      <Paper shadow="md" p="xl" radius="md">
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Box>
              <Image
                src="/images/beauty-salon-createAccount.jpg"
                alt="Salão de beleza"
                radius="md"
                h={400}
                fit="cover"
              />
              <Text ta="center" size="lg" fw={500} mt="md">
                Salão de beleza Nankova em Benguela
              </Text>
            </Box>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Stack gap="md">
                <Title order={2}>Criar Conta</Title>

                <TextInput
                  required
                  label="Nome"
                  placeholder="Seu nome"
                  {...form.getInputProps("name")}
                />

                <TextInput
                  required
                  label="Email"
                  placeholder="seu@email.com"
                  {...form.getInputProps("email")}
                />

                <PasswordInput
                  required
                  label="Senha"
                  placeholder="Sua senha"
                  {...form.getInputProps("password")}
                />

                <PasswordInput
                  required
                  label="Confirma a senha"
                  placeholder="Confirme sua senha"
                  {...form.getInputProps("confirmPassword")}
                />

                <TextInput
                  required
                  label="Número de telefone"
                  placeholder="Seu número de telefone"
                  {...form.getInputProps("phone")}
                />

                <Select
                  required
                  label="Selecione serviço desejado"
                  placeholder="Escolha um curso"
                  data={[
                    { value: "corte", label: "Corte de Cabelo" },
                    { value: "coloracao", label: "Coloração" },
                    { value: "manicure", label: "Manicure" },
                    { value: "pedicure", label: "Pedicure" },
                  ]}
                  {...form.getInputProps("service")}
                />

                <Button type="submit" fullWidth mt="xl">
                  Cadastrar
                </Button>

                <Box ta="center">
                  <Text size="sm" mb="xs">
                    Já tenho uma conta? <Button variant="subtle">Entrar</Button>
                  </Text>
                </Box>
              </Stack>
            </form>
          </Grid.Col>
        </Grid>
      </Paper>
    </Container>
  );
}
