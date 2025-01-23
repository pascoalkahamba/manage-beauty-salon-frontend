import { EMPLOYEE_CODE_REGEX } from "@/utils";
import { z as zod } from "zod";

const createAccountSchema = zod
  .object({
    username: zod.string().min(1, "Nome é obrigatório"),
    email: zod.string().email("Email inválido"),
    password: zod.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
    confirmPassword: zod.string().min(6, "Confirme sua senha"),
    cellphone: zod
      .string()
      .min(9, "Número de telefone inválido")
      .max(9, "Número de telefone inválido"),
    validationCode: zod
      .string()
      .regex(
        EMPLOYEE_CODE_REGEX,
        "codigo inválido, deve conter 8 digitos um numero e uma letra e um caracter especial (@$!%*#?&)."
      )
      .optional()
      .nullable(),
    servicesIds: zod
      .number({ message: "Selecione um serviço" })
      .array()
      .optional()
      .nullable(),
    categoriesIds: zod
      .number({ message: "Selecione uma categoria" })
      .array()
      .optional()
      .nullable(),
    terms: zod.boolean(),
    academicLevelId: zod
      .string()
      .min(1, "Selecione um nível de escolaridade")
      .optional()
      .nullable(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não conferem",
    path: ["confirmPassword"],
  });

const loginSchema = zod.object({
  email: zod.string().email("Email inválido"),
  terms: zod.boolean(),
  password: zod.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export { createAccountSchema, loginSchema };
