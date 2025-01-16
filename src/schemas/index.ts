import { z as zod } from "zod";

const createAccountEmployeeSchema = zod
  .object({
    username: zod.string().min(1, "Nome é obrigatório"),
    email: zod.string().email("Email inválido"),
    password: zod.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
    confirmPassword: zod.string().min(6, "Confirme sua senha"),
    cellphone: zod.string().min(9, "Número de telefone inválido"),
    serviceId: zod.number({ message: "Selecione um serviço" }),
    academicLevel: zod.string().min(1, "Selecione um nível de escolaridade"),
    professionId: zod.number({ message: "Selecione uma profissão" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não conferem",
    path: ["confirmPassword"],
  });

export { createAccountEmployeeSchema };
