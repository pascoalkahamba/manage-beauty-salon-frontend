import {
  AppointmentSchema,
  bookingSchema,
  createAccountSchema,
  serviceSchema,
  loginSchema,
  profileSchema,
} from "@/schemas";
import { z as zod } from "zod";

export type TDataCreateAccountProps = zod.infer<typeof createAccountSchema>;

export type TDataLoginProps = zod.infer<typeof loginSchema>;
export type BookingFormValues = zod.infer<typeof bookingSchema>;
export type AppointmentType = zod.infer<typeof AppointmentSchema>;
export type IUpdateUserProfile = zod.infer<typeof profileSchema>;
export type ICreateService = zod.infer<typeof serviceSchema>;

export type TRole = "EMPLOYEE" | "CLIENT" | "MANAGER";
export type TDeleteModal =
  | "deleteAppointment"
  | "deleteService"
  | "deleteUserAccount"
  | "deleteCategory";
export type TStatus = "PENDING" | "CONFIRMED" | "CANCELED" | "COMPLETED";
export type TOpenModal =
  | "listOfAppointments"
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
