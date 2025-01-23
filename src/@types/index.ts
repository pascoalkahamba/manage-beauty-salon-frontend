import { createAccountSchema, loginSchema } from "@/schemas";
import { z as zod } from "zod";

export type TDataCreateAccountProps = zod.infer<typeof createAccountSchema>;

export type TDataLoginProps = zod.infer<typeof loginSchema>;
export type TRole = "EMPLOYEE" | "CLIENT" | "MANAGER";

export type TTypeButton = "button" | "submit" | "reset" | undefined;
