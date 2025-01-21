import { TRole } from "@/@types";

export interface ICreateAccount {
  username: string;
  password: string;
  email: string;
  cellphone: string;
  role: TRole;
  servicesIds?: number[];
  academicLevel?: string;
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
    academicLevel?: string;
  };
  token: string;
}
