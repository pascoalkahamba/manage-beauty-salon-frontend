import { TRole } from "@/@types";

export interface ICreateAccount {
  username: string;
  password: string;
  email: string;
  cellphone: string;
  role: TRole;
  servicesIds?: number[];
  validationCode?: string;
  academicLevelId?: number;
  categoriesIds?: number[];
}

export interface ICreateAccountResponse {
  username: string;
  email: string;
  role: TRole;
}

export interface ICart {
  clientId: number;
  appointment: IAppointment;
}

export interface ILogin {
  email: string;
  password: string;
  role: TRole;
}

export interface ILoginResponse {
  user: {
    id: number;
    username: string;
    email: string;
    role: TRole;
  };
  token: string;
}

export interface IAcademicLevel {
  id: number;
  name: string;
  description: string;
}

export interface IEmployee {
  id: number;
  username: string;
  email: string;
  cellphone: string;
  role: TRole;
  academicLevelId: number;
  academicLevel: IAcademicLevel;
  services: IService[];
}

export interface IClient {
  id: number;
  username: string;
  email: string;
  cellphone: string;
  role: TRole;
}

export interface ICategory {
  id: number;
  name: string;
  description: string;
  services: IService[];
}

export interface IPicture {
  url: string;
  name: string;
}

export interface ICreateCart {
  clientId: number;
  appointmentId: number;
}
export interface IUpdateCart extends ICreateCart {
  id: number;
}

export interface ICreateAppointment {
  serviceId: number;
  employeeId: number;
  date: string;
  status: string;
  clientId: number;
  hour: string;
}
export interface IAppointment {
  id: number;
  date: string;
  status: string;
  serviceId: number;
  employeeId: number;
  clientId: number;
  service: IService;
  employee: IEmployee;
  client: IClient;
}

export interface IUpdateAppointment extends ICreateAppointment {
  id: number;
}

export interface ICurrentUser {
  id: number;
  username: string;
  email: string;
  cellphone: string;
  role: TRole;
  academicLevelId: number;
}

export interface IService {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  image: IPicture;
  categoryId: number;
  category: ICategory;
}
