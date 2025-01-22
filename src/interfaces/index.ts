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
  username: string;
  password: string;
  role: TRole;
}

export interface ILoginResponse {
  user: {
    id: number;
    username: string;
    email: string;
    role: TRole;
    cellphone: string;
    academicLevelId?: number;
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

export interface IService {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  category: ICategory;
}
