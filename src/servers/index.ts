import {
  IAcademicLevel,
  IAppointment,
  ICategory,
  ICreateAccount,
  ICreateAccountResponse,
  ICreateAppointment,
  ILogin,
  ILoginResponse,
  IService,
  IUpdateAppointment,
} from "@/interfaces";
import axiosApp from "@/axios";
import {
  CREATEACCOUNTCLIENTROUTE,
  CREATEACCOUNTEMPLOYEEROUTE,
  CREATEAPPOINTMENTROUTE,
  DELETEAPPOINTMENTROUTE,
  GETALLACADEMICLEVELSROUTE,
  GETALLAPPOINTMENTSROUTE,
  GETALLCATEGORIESROUTE,
  GETALLSERVICESROUTE,
  GETAPPOINTMENTBYIDROUTE,
  SIGNINCLIENTROUTE,
  SIGNINEMPLOYEEROUTE,
  UPDATEAPPOINTMENTROUTE,
} from "@/routes";

export async function createAccount(userInfo: ICreateAccount) {
  const { role } = userInfo;
  console.log("userInfo", userInfo);

  const responses = await axiosApp.post(
    role === "EMPLOYEE" ? CREATEACCOUNTEMPLOYEEROUTE : CREATEACCOUNTCLIENTROUTE,
    userInfo
  );

  const user = responses.data as unknown as ICreateAccountResponse;
  return user;
}

export async function login(userInfo: ILogin) {
  const { role } = userInfo;

  const response = await axiosApp.post(
    role === "EMPLOYEE" || role === "MANAGER"
      ? SIGNINEMPLOYEEROUTE
      : SIGNINCLIENTROUTE,
    userInfo
  );

  const logged = response.data as unknown as ILoginResponse;
  return logged;
}

export async function getAllCategories() {
  const response = await axiosApp.get(GETALLCATEGORIESROUTE);
  const categories = response.data;
  return categories as unknown as ICategory[];
}

export async function getAllServices() {
  const response = await axiosApp.get(GETALLSERVICESROUTE);
  const services = response.data;
  return services as unknown as IService[];
}

export async function getAllAcademicLevels() {
  const response = await axiosApp.get(GETALLACADEMICLEVELSROUTE);
  const academicLevels = response.data;
  return academicLevels as unknown as IAcademicLevel[];
}

export async function creatAppointment(appointment: ICreateAppointment) {
  const response = await axiosApp.post(CREATEAPPOINTMENTROUTE, appointment);
  const appointmentCreated = response.data;
  return appointmentCreated as unknown as IAppointment;
}

export async function getAllAppointments() {
  const response = await axiosApp.get(GETALLAPPOINTMENTSROUTE);
  const appointments = response.data;
  return appointments as unknown as IAppointment[];
}

export async function getOneAppointment(appointmentId: number) {
  const response = await axiosApp.get(
    `${GETAPPOINTMENTBYIDROUTE}/${appointmentId}`
  );
  const appointment = response.data;

  return appointment as unknown as IAppointment;
}

export async function updateAppointment(appointment: IUpdateAppointment) {
  const response = await axiosApp.post(
    `${UPDATEAPPOINTMENTROUTE}/${appointment.id}`,
    appointment
  );
  const updatedAppointment = response.data;

  return updatedAppointment as unknown as IAppointment;
}

export async function deleteAppointment(appointmentId: number) {
  const response = await axiosApp.delete(
    `${DELETEAPPOINTMENTROUTE}/${appointmentId}`
  );

  const appointment = response.data;
  return appointment as unknown as IAppointment;
}
