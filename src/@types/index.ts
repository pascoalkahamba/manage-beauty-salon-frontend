import { createAccountEmployeeSchema } from "@/schemas";
import { z as zod } from "zod";

export type DataCreateAccountEmployeePropsT = zod.infer<
  typeof createAccountEmployeeSchema
>;
