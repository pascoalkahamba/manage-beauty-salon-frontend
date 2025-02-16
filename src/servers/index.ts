import {
  IAcademicLevel,
  IAppointment,
  IAppointmentStatusResponse,
  ICart,
  ICategory,
  ICreateAccount,
  ICreateAccountResponse,
  ICreateAppointment,
  ICreateCart,
  ICreateCategory,
  IEmployee,
  ILogin,
  ILoginResponse,
  IService,
  IServiceToCreate,
  IUpdateAppointment,
  IUpdateAppointmentStatus,
  IUpdateCart,
  IUpdateCategory,
  IUpdateService,
  IUpdateUserProfile,
  IUser,
  IUserResponse,
} from "@/interfaces";
import axiosApp from "@/axios";
import {
  CREATEACCOUNTCLIENTROUTE,
  CREATEACCOUNTEMPLOYEEROUTE,
  CREATEAPPOINTMENTROUTE,
  CREATECARTROUTE,
  CREATECATEGORYROUTE,
  CREATESERVICEROUTE,
  DELETEAPPOINTMENTROUTE,
  DELETECARTROUTE,
  DELETECATEGORYROUTE,
  DELETECLIENTROUTE,
  DELETEEMPLOYEEROUTE,
  DELETESERVICEROUTE,
  GETALLACADEMICLEVELSROUTE,
  GETALLAPPOINTMENTSROUTE,
  GETALLCARTSROUTE,
  GETALLCATEGORIESROUTE,
  GETALLEMPLOYEESROUTE,
  GETALLSERVICESROUTE,
  GETAPPOINTMENTBYIDROUTE,
  GETCARTBYCLIENTIDROUTE,
  GETCARTBYIDROUTE,
  GETCLIENTBYIDROUTE,
  GETEMPLOYEEBYIDROUTE,
  GETSERVICEBYIDROUTE,
  SIGNINCLIENTROUTE,
  SIGNINEMPLOYEEROUTE,
  UPDATEAPPOINTMENTROUTE,
  UPDATECARTROUTE,
  UPDATECATEGORYROUTE,
  UPDATECLIENTROUTE,
  UPDATEEMPLOYEEROUTE,
  UPDATESERVICEROUTE,
  UPDATESTATUSAPPOINTMENTROUTE,
} from "@/routes";
import { TRole } from "@/@types";

export async function createAccount(userInfo: ICreateAccount) {
  const { role } = userInfo;
  console.log("userInfo", userInfo);

  const responses = await axiosApp.post(
    role !== "CLIENT" ? CREATEACCOUNTEMPLOYEEROUTE : CREATEACCOUNTCLIENTROUTE,
    userInfo
  );

  const user = responses.data as unknown as ICreateAccountResponse;
  return user;
}

export async function login(userInfo: ILogin) {
  const { role } = userInfo;

  const response = await axiosApp.post(
    role !== "CLIENT" ? SIGNINEMPLOYEEROUTE : SIGNINCLIENTROUTE,
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

export async function updateUserProfile(userInfo: IUpdateUserProfile) {
  const currentRoute =
    userInfo.role !== "CLIENT" ? UPDATEEMPLOYEEROUTE : UPDATECLIENTROUTE;
  const response = await axiosApp.post(
    `${currentRoute}/${userInfo.id}`,
    userInfo
  );
  const user = response.data;
  return user as unknown as IUserResponse;
}

export async function updateStatusAppointment(
  appointmentInfo: IUpdateAppointmentStatus
) {
  const { id, reason, status } = appointmentInfo;
  const response = await axiosApp.post(
    `${UPDATESTATUSAPPOINTMENTROUTE}/${id}`,
    {
      reason,
      status,
    }
  );
  const appointment = response.data;
  return appointment as unknown as IAppointmentStatusResponse;
}

export async function getUserById(userId: number, role: TRole) {
  const url = role !== "CLIENT" ? GETEMPLOYEEBYIDROUTE : GETCLIENTBYIDROUTE;
  const response = await axiosApp.get(`${url}/${userId}`);
  const user = response.data;
  return user as unknown as IUser;
}

export async function getAllServices() {
  const response = await axiosApp.get(GETALLSERVICESROUTE);
  const services = response.data;
  return services as unknown as IService[];
}

export async function createService(service: IServiceToCreate) {
  const response = await axiosApp.post(CREATESERVICEROUTE, service);
  const serviceCreated = response.data;
  return serviceCreated as unknown as IService;
}

export async function createCategory(category: ICreateCategory) {
  const response = await axiosApp.post(CREATECATEGORYROUTE, category);
  const categoryCreated = response.data;
  return categoryCreated as unknown as ICategory;
}

export async function updateCategory(category: IUpdateCategory) {
  const response = await axiosApp.post(
    `${UPDATECATEGORYROUTE}/${category.id}`,
    category
  );
  const categoryUpdated = response.data;
  return categoryUpdated as unknown as ICategory;
}

export async function deleteCategory(categoryId: number) {
  const response = await axiosApp.delete(
    `${DELETECATEGORYROUTE}/${categoryId}`
  );
  const categoryDeleted = response.data;
  return categoryDeleted as unknown as ICategory;
}

export async function updaateService(service: IUpdateService) {
  const response = await axiosApp.post(
    `${UPDATESERVICEROUTE}/${service.id}`,
    service
  );
  const serviceUpdated = response.data;
  return serviceUpdated as unknown as IService;
}
export async function deleteService(serviceId: number) {
  const response = await axiosApp.delete(`${DELETESERVICEROUTE}/${serviceId}`);
  const serviceDeleted = response.data;
  return serviceDeleted as unknown as IService;
}

export async function getServiceById(serviceId: number) {
  const response = await axiosApp.get(`${GETSERVICEBYIDROUTE}/${serviceId}`);
  const service = response.data;
  return service as unknown as IService;
}

export async function getAllAcademicLevels() {
  const response = await axiosApp.get(GETALLACADEMICLEVELSROUTE);
  const academicLevels = response.data;
  return academicLevels as unknown as IAcademicLevel[];
}

export async function getAllEmployees() {
  const response = await axiosApp.get(GETALLEMPLOYEESROUTE);
  const employees = response.data;
  return employees as unknown as IEmployee[];
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

export async function createCart(cart: ICreateCart) {
  const response = await axiosApp.post(CREATECARTROUTE, cart);
  const newCart = response.data;
  return newCart as unknown as ICart;
}

export async function getAllCarts() {
  const response = await axiosApp.get(GETALLCARTSROUTE);
  const carts = response.data;
  return carts as unknown as ICart;
}

export async function deleteAppointmentFromCart(cartId: number) {
  const response = await axiosApp.delete(`${DELETECARTROUTE}/${cartId}`);
  const cart = response.data;
  return cart as unknown as ICart;
}

export async function getCartById(cartId: number) {
  const response = await axiosApp.get(`${GETCARTBYIDROUTE}/${cartId}`);
  const cart = response.data;
  return cart as unknown as ICart;
}

export async function getCartByClientId(clientId: number) {
  const response = await axiosApp.get(`${GETCARTBYCLIENTIDROUTE}/${clientId}`);
  const cart = response.data;
  return cart as unknown as ICart;
}

export async function updateCart(cart: IUpdateCart) {
  const response = await axiosApp.post(`${UPDATECARTROUTE}/${cart.id}`, cart);
  const cartUpdated = response.data;
  return cartUpdated as unknown as ICart;
}

export async function deleteUserAccount(userId: number, role: TRole) {
  const url = role !== "CLIENT" ? DELETEEMPLOYEEROUTE : DELETECLIENTROUTE;
  const response = await axiosApp.delete(`${url}/${userId}`);
  const user = response.data;
  return user as unknown as IUser;
}
