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
