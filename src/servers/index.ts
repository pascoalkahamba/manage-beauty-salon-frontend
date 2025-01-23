import {
  IAcademicLevel,
  ICategory,
  ICreateAccount,
  ICreateAccountResponse,
  ILogin,
  ILoginResponse,
  IService,
} from "@/interfaces";
import axiosApp from "@/axios";
import {
  CREATEACCOUNTCLIENTROUTE,
  CREATEACCOUNTEMPLOYEEROUTE,
  GETALLACADEMICLEVELSROUTE,
  GETALLCATEGORIESROUTE,
  GETALLSERVICESROUTE,
  SIGNINCLIENTROUTE,
  SIGNINEMPLOYEEROUTE,
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
  console.log("userInfo route", userInfo);

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
