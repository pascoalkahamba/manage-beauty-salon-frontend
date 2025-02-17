import { TStatus } from "@/@types";
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

// Schema for Category with services

const serviceSchema = zod.object({
  name: zod.string().min(1, "Nome é obrigatório"),
  description: zod.string().min(1, "Descrição é obrigatória"),
  price: zod.number().min(1, "Preço deve ser maior que 0"),
  duration: zod.number().min(1, "Duração deve ser maior que 0"),
  categoryId: zod.string().min(1, "Selecione uma categoria"),
  photoUrl: zod.string().optional(),
});
const categoriaSchema = zod.object({
  name: zod
    .string()
    .min(6, "Nome da categoria deve ter pelo menos 6 caracteres"),
  description: zod
    .string()
    .min(10, "Descrição deve ter pelo menos 10 caracteres"),
  services: zod
    .array(
      serviceSchema.omit({ categoryId: true, photoUrl: true }).extend({
        photo: zod.string().optional(),
      })
    )
    .min(4, "Deve ter pelo menos 4 serviços"),
});

const updateCategorySchema = categoriaSchema.omit({ services: true });

const profileSchema = zod.object({
  username: zod
    .string()
    .min(6, "Nome do usuário deve ter pelo menos 6 caracteres."),
  email: zod.string().email("Email inválido."),
  bio: zod
    .string()
    .min(12, "Descrição deve ter no minimo 12 caracteres.")
    .optional(),
  password: zod.string().min(6, "Senha deve ter pelo menos 6 caracteres."),
  cellphone: zod
    .string()
    .regex(/^\d{9}$/, "Numero do telefone deve ter 9 digitos."),
  servicesIds: zod
    .number()
    .array()
    .min(1, "Selecione pelo menos um serviço.")
    .optional()
    .nullable(),
  categoriesIds: zod
    .number()
    .array()
    .min(1, "Selecione pelo menos uma categoria.")
    .optional(),
  academicLevelId: zod
    .string()
    .min(1, "Selecione um nivel academico.")
    .optional(),
  photoUrl: zod.string().optional(), // File upload is optional
});

const academicLevelSchema = zod.object({
  name: zod.string().min(6, "Nome deve ter pelo menos 6 caracteres"),
  description: zod
    .string()
    .min(10, "Descrição deve ter pelo menos 10 caracteres"),
});
const codeValidationToEmployeeSchema = zod.object({
  name: zod
    .string()
    .regex(
      EMPLOYEE_CODE_REGEX,
      "codigo inválido, deve conter 8 digitos um numero e uma letra e um caracter especial (@$!%*#?&)."
    ),
  description: zod
    .string()
    .min(10, "Descrição deve ter pelo menos 10 caracteres"),
});

const AppointmentSchema = zod.object({
  id: zod.string(),
  clientName: zod.string().min(1, "Client name is required"),
  employeeName: zod.string().min(1, "Employee name is required"),
  date: zod.date(),
  time: zod.string(),
  status: zod.string() as zod.ZodType<TStatus>,
  notes: zod.string().optional(),
});

const bookingSchema = zod.object({
  employeeId: zod.string().min(1, "Funcionário é obrigatório"),
  date: zod
    .date({
      required_error: "Data é obrigatória",
      invalid_type_error: "Data inválida",
    })
    .refine((date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date >= today;
    }, "Data deve ser hoje ou futura"),
  hour: zod
    .string()
    .min(1, "Horário é obrigatório")
    .refine((hour) => {
      const [hours, minutes] = hour.split(":").map(Number);
      return hours >= 8 && hours <= 20;
    }, "Horário deve estar entre 8:00 e 20:00"),
});

export {
  createAccountSchema,
  loginSchema,
  bookingSchema,
  academicLevelSchema,
  codeValidationToEmployeeSchema,
  AppointmentSchema,
  serviceSchema,
  updateCategorySchema,
  categoriaSchema,
  profileSchema,
};
