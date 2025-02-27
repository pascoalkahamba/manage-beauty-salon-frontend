// employee routes
const SIGNINEMPLOYEEROUTE = "/employee/login";
const CREATEACCOUNTEMPLOYEEROUTE = "/employee/create";
const GETALLEMPLOYEESROUTE = "/employee/getAllEmployees";
const GETEMPLOYEEBYIDROUTE = "/employee/getOneEmployee";
const UPDATEEMPLOYEEROUTE = "/employee/updateInfoProfile";
const DELETEEMPLOYEEROUTE = "/employee/deleteEmployee";

// clients routes
const CREATEACCOUNTCLIENTROUTE = "/client/create";
const SIGNINCLIENTROUTE = "/client/login";
const GETALLCLIENTSROUTE = "/client/getAllClients";
const GETCLIENTBYIDROUTE = "/client/getOneClient";
const UPDATECLIENTROUTE = "/client/updateInfoProfile";
const DELETECLIENTROUTE = "/client/deleteClient";

// category routes
const GETALLCATEGORIESROUTE = "/category/getAllCategories";
const GETCATEGORYBYIDROUTE = "/category/getOneCategory";
const CREATECATEGORYROUTE = "/category/create";
const UPDATECATEGORYROUTE = "/category/update";
const DELETECATEGORYROUTE = "/category/delete";

// services routes
const GETALLSERVICESROUTE = "/service/getAllServices";
const GETSERVICEBYIDROUTE = "/service/getOneService";
const CREATESERVICEROUTE = "/service/create";
const UPDATESERVICEROUTE = "/service/update";
const DELETESERVICEROUTE = "/service/delete";

// appointment routes
const CREATEAPPOINTMENTROUTE = "/appointment/create";
const GETALLAPPOINTMENTSROUTE = "/appointment/getAllAppointments";
const GETAPPOINTMENTBYIDROUTE = "/appointment/getOneAppointment";
const UPDATEAPPOINTMENTROUTE = "/appointment/update";
const DELETEAPPOINTMENTROUTE = "/appointment/delete";
const UPDATESTATUSAPPOINTMENTROUTE = "/appointment/updateStatus";

// cart routes
const CREATECARTROUTE = "/cart/create";
const GETALLCARTSROUTE = "/cart/getAllCarts";
const GETCARTBYIDROUTE = "/cart/getOneCart";
const UPDATECARTROUTE = "/cart/update";
const DELETECARTROUTE = "/cart/delete";
const GETCARTBYCLIENTIDROUTE = "/cart/getCartByClientId";

// academic level routes
const GETALLACADEMICLEVELSROUTE = "/academicLevel/getAllAcademicLevels";
const CREATEACADEMICLEVEL = "/academicLevel/create";
const UPDATEACADEMICLEVELROUTE = "/academicLevel/updateAcademicLevel";
const DELETEACADEMICLEVELROUTE = "/academicLevel/deleteAcademicLevel";

// code to create employee
const CREATECODETOEMPLOYEEROUTE = "/codeValidationToEmployee/create";
const UPDATECODETOEMPLOYEEROUTE = "/codeValidationToEmployee/update";
const DELETECODETOEMPLOYEEROUTE = "/codeValidationToEmployee/delete";
const GETALLCODESTOEMPLOYEEROUTE =
  "/codeValidationToEmployee/getAllCodeValidationToEmployees";

export {
  CREATEACCOUNTEMPLOYEEROUTE,
  CREATEACCOUNTCLIENTROUTE,
  SIGNINEMPLOYEEROUTE,
  CREATECODETOEMPLOYEEROUTE,
  UPDATECODETOEMPLOYEEROUTE,
  DELETECODETOEMPLOYEEROUTE,
  GETALLCODESTOEMPLOYEEROUTE,
  SIGNINCLIENTROUTE,
  CREATEACADEMICLEVEL,
  UPDATEACADEMICLEVELROUTE,
  DELETEACADEMICLEVELROUTE,
  GETALLEMPLOYEESROUTE,
  GETEMPLOYEEBYIDROUTE,
  GETALLCLIENTSROUTE,
  GETCLIENTBYIDROUTE,
  CREATEAPPOINTMENTROUTE,
  GETALLAPPOINTMENTSROUTE,
  GETAPPOINTMENTBYIDROUTE,
  GETALLCARTSROUTE,
  GETCARTBYCLIENTIDROUTE,
  GETSERVICEBYIDROUTE,
  GETCATEGORYBYIDROUTE,
  DELETECATEGORYROUTE,
  CREATECATEGORYROUTE,
  UPDATECATEGORYROUTE,
  DELETESERVICEROUTE,
  DELETECLIENTROUTE,
  DELETEEMPLOYEEROUTE,
  CREATESERVICEROUTE,
  UPDATESERVICEROUTE,
  CREATECARTROUTE,
  UPDATECARTROUTE,
  GETCARTBYIDROUTE,
  UPDATESTATUSAPPOINTMENTROUTE,
  DELETECARTROUTE,
  UPDATEAPPOINTMENTROUTE,
  UPDATECLIENTROUTE,
  UPDATEEMPLOYEEROUTE,
  DELETEAPPOINTMENTROUTE,
  GETALLACADEMICLEVELSROUTE,
  GETALLCATEGORIESROUTE,
  GETALLSERVICESROUTE,
};
