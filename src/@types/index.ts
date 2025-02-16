import {
  AppointmentSchema,
  bookingSchema,
  createAccountSchema,
  serviceSchema,
  loginSchema,
  profileSchema,
  categoriaSchema,
  updateCategorySchema,
} from "@/schemas";
import { z as zod } from "zod";

export type TDataCreateAccountProps = zod.infer<typeof createAccountSchema>;

export type TDataLoginProps = zod.infer<typeof loginSchema>;
export type BookingFormValues = zod.infer<typeof bookingSchema>;
export type AppointmentType = zod.infer<typeof AppointmentSchema>;
export type TUpdateUserProfile = zod.infer<typeof profileSchema>;
export type TCreateService = zod.infer<typeof serviceSchema>;
export type TCategoriaFormValues = zod.infer<typeof categoriaSchema>;

export type TRole = "EMPLOYEE" | "CLIENT" | "MANAGER";
export type TCustomModal =
  | "editCategory"
  | "addAcademicLevel"
  | "editAcademicLevel"
  | "addCodeValidation"
  | "editCodeValidation";
export type TCategoryEditFormValues = zod.infer<typeof updateCategorySchema>;

export type TDeleteModal =
  | "deleteAppointment"
  | "deleteService"
  | "deleteUserAccount"
  | "deleteCategory";
export type TStatus = "PENDING" | "CONFIRMED" | "CANCELED" | "COMPLETED";
export type TOpenModal =
  | "listOfAppointments"
  | "listOfEmployees"
  | "updateAppointmentStatus"
  | "updateAppointment"
  | "editProfileInfo"
  | "appointmentService"
  | "openModalServices"
  | "none"
  | "deleteAppointment"
  | "deleteAccount"
  | "openListOfCategories"
  | "addNewCategory"
  | "openCart";

export type TTypeButton = "button" | "submit" | "reset" | undefined;
