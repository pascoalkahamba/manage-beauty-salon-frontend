// employee routes
const SIGNINEMPLOYEEROUTE = "/employee/login";
const CREATEACCOUNTEMPLOYEEROUTE = "/employee/create";

// clients routes
const CREATEACCOUNTCLIENTROUTE = "/client/create";
const SIGNINCLIENTROUTE = "/client/login";

// category routes
const GETALLCATEGORIESROUTE = "/category/getAllCategories";

// services routes
const GETALLSERVICESROUTE = "/service/getAllServices";

// appointment routes
const CREATEAPPOINTMENTROUTE = "/appointment/create";
const GETALLAPPOINTMENTSROUTE = "/appointment/getAllAppointments";
const GETAPPOINTMENTBYIDROUTE = "/appointment/getOneAppointment";
const UPDATEAPPOINTMENTROUTE = "/appointment/update";
const DELETEAPPOINTMENTROUTE = "/appointment/delete";

// cart routes
const CREATECARTROUTE = "/cart/create";
const GETALLCARTSROUTE = "/cart/getAllCarts";
const GETCARTBYIDROUTE = "/cart/getOneCart";
const UPDATECARTROUTE = "/cart/update";
const DELETECARTROUTE = "/cart/delete";
const GETCARTBYCLIENTIDROUTE = "/cart/getOneCartByClientId";

// academic level routes
const GETALLACADEMICLEVELSROUTE = "/academicLevel/getAllAcademicLevels";

export {
  CREATEACCOUNTEMPLOYEEROUTE,
  CREATEACCOUNTCLIENTROUTE,
  SIGNINEMPLOYEEROUTE,
  SIGNINCLIENTROUTE,
  CREATEAPPOINTMENTROUTE,
  GETALLAPPOINTMENTSROUTE,
  GETAPPOINTMENTBYIDROUTE,
  GETALLCARTSROUTE,
  GETCARTBYCLIENTIDROUTE,
  CREATECARTROUTE,
  UPDATECARTROUTE,
  GETCARTBYIDROUTE,
  DELETECARTROUTE,
  UPDATEAPPOINTMENTROUTE,
  DELETEAPPOINTMENTROUTE,
  GETALLACADEMICLEVELSROUTE,
  GETALLCATEGORIESROUTE,
  GETALLSERVICESROUTE,
};
