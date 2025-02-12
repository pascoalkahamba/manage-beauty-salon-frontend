import { TOpenModal, TRole, TStatus } from "@/@types";

export interface ICreateAccount {
  username: string;
  password: string;
  email: string;
  cellphone: string;
  role: TRole;
  servicesIds?: number[];
  validationCode?: string;
  academicLevelId?: string;
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

export interface IUpdateUserProfile {
  username: string;
  email: string;
  id: number;
  cellphone: string;
  categoriesIds?: number[];
  role: TRole;
  academicLevelId?: string;
  servicesIds?: number[];
  photo: Blob;
  bio: string;
  password: string;
}

export interface IGetOneUser {
  id: number;
  role: TRole;
}

export interface IModalAtom {
  type: TOpenModal;
  status: boolean;
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
export interface IUserResponse {
  email: string;
  username: string;
  role: TRole;
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
  date: Date;
  hour: string;
  status: TStatus;
  serviceId: number;
  employeeId: number;
  clientId: number;
  service: IService;
  employee: IEmployee;
  client: IClient;
}

export interface IServiceToCreate {
  name: string;
  description: string;
  price: number;
  duration: number;
  categoryId: number;
  photo: Blob;
}

export interface IUpdateService extends IServiceToCreate {
  id: number;
}
export interface IAppointmentStatusResponse {
  id: number;
  clientId: number;
  employeeId: number;
  serviceId: number;
  date: Date;
  reason: string;
  hour: string;
  status: TStatus;
  cartId: number | null;
}
export interface IUpdateAppointmentStatus {
  id: number;
  status: TStatus;
  reason: string;
}

export interface IUpdateAppointment {
  id: number;
  date: Date;
  hour: string;
  employeeId: number;
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
  categoryId: string;
  employees: IEmployee[];
  category: ICategory;
}
