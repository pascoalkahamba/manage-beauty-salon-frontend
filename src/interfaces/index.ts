import { TRole, TStatus } from "@/@types";

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
  appointment: IAppointment[];
  id: number;
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
  availability?: string;
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

export interface IUser {
  id: number;
  username: string;
  email: string;
  cellphone: string;
  categories?: ICategory[];
  role: TRole;
  profile: IProfile;
  cart?: ICart;
  appointments: IAppointment[];
  services?: IService[];
  academicLevel?: IAcademicLevel;
}

export interface IProfile {
  bio: string;
  photo: IPicture;
  clientId: number;
  employeeId: number;
}

export interface IDataForCreateAppointment {
  employeeId: string;
  date: Date;
  hour: string;
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
  date: Date;
  status: TStatus;
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
  picture: IPicture;
  categoryId: number;
  employees: IEmployee[];
  category: ICategory;
}
