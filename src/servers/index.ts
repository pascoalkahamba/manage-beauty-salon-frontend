import {
  ICreateAccount,
  ICreateAccountResponse,
  ILogin,
  ILoginResponse,
} from "@/interfaces";
import axiosApp from "@/axios";
import {
  CREATEACCOUNTCLIENTROUTE,
  CREATEACCOUNTEMPLOYEEROUTE,
  SIGNINCLIENTROUTE,
  SIGNINEMPLOYEEROUTE,
} from "@/routes";

export async function createAccount(userInfo: ICreateAccount) {
  const { role } = userInfo;

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
    role === "EMPLOYEE" ? SIGNINEMPLOYEEROUTE : SIGNINCLIENTROUTE,
    userInfo
  );

  const logged = response.data as unknown as ILoginResponse;
  return logged;
}
