import { TRole, TStatus } from "@/@types";
import { ICurrentUser, IGetOneUser } from "@/interfaces";

const EMPLOYEE_CODE_REGEX =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

function showNameOfCurrentUser(role: TRole) {
  switch (role) {
    case "MANAGER":
      return "Gerente";
    case "EMPLOYEE":
      return "Funcionário";
    case "CLIENT":
      return "Cliente";
    default:
      return "Usuário";
  }
}

function currentUserCanManagerProfile(
  { id, role }: IGetOneUser,
  currentUser: ICurrentUser
) {
  if (currentUser.role === "MANAGER") return true;
  if (role === currentUser.role && +id === currentUser.id) return true;

  return false;
}

function showStatusInPortuguese(status: TStatus) {
  switch (status) {
    case "PENDING":
      return "Pendente";
    case "CANCELED":
      return "Cancelado";
    case "CONFIRMED":
      return "Confirmado";
    case "COMPLETED":
      return "Concluído";
    default:
      return "Status desconhecido";
  }
}

export {
  EMPLOYEE_CODE_REGEX,
  showNameOfCurrentUser,
  showStatusInPortuguese,
  currentUserCanManagerProfile,
};
