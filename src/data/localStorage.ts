const REGISTERED_USERS = "registered_users";
const ACTIVE_USER = "active_user";

export interface UserModel {
  strName: string;
  strEmail: string;
  strPassword: string;
}

function addNewUser(objUser: UserModel) {
  const strUsers = localStorage.getItem(REGISTERED_USERS) || "[]";
  const arrUsers = JSON.parse(strUsers) as UserModel[];
  arrUsers.push(objUser);
  localStorage.setItem(REGISTERED_USERS, JSON.stringify(arrUsers));
}

function isUserRegistered(strEmail: string): boolean {
  const strUsers = localStorage.getItem(REGISTERED_USERS) || null;

  if (strUsers == null) return false;

  const arrUsers = JSON.parse(strUsers) as UserModel[];
  const objFoundUser = arrUsers.find((objUser) => objUser.strEmail == strEmail);

  return objFoundUser != null;
}

function getUser(strEmail: string, strPassword: string) {
  const strUsers = localStorage.getItem(REGISTERED_USERS) || null;

  if (strUsers == null) return null;

  const arrUsers = JSON.parse(strUsers) as UserModel[];

  const strFoundUser = arrUsers.find(
    (objUser) =>
      objUser.strEmail == strEmail && objUser.strPassword == strPassword
  );

  return strFoundUser;
}

function updateActiveUser(objUser: UserModel) {
  localStorage.setItem(ACTIVE_USER, JSON.stringify(objUser));
}

function getActiveUser() {
  const objActiveUser = localStorage.getItem(ACTIVE_USER) || null;

  if (objActiveUser == null) {
    return null;
  }

  return JSON.parse(objActiveUser);
}

function clearActiveUser() {
  localStorage.removeItem(ACTIVE_USER);
}

export {
  addNewUser,
  isUserRegistered,
  getUser,
  updateActiveUser,
  getActiveUser,
  clearActiveUser,
};
