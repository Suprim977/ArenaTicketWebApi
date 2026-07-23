import Cookies from "js-cookie";

const TOKEN_KEY = "token";
const ROLE_KEY = "user_role";

export const setTokenCookie = (token: string): void => {
  Cookies.set(TOKEN_KEY, token, { expires: 7, sameSite: "lax" });
};

export const setRoleCookie = (role: string): void => {
  Cookies.set(ROLE_KEY, role, { expires: 7, sameSite: "lax" });
};

export const setAuthCookies = (token: string, role?: string): void => {
  setTokenCookie(token);
  if (role) {
    setRoleCookie(role);
  }
};

export const getTokenCookie = (): string | undefined => {
  return Cookies.get(TOKEN_KEY);
};

export const getRoleCookie = (): string | undefined => {
  return Cookies.get(ROLE_KEY);
};

export const deleteTokenCookie = (): void => {
  Cookies.remove(TOKEN_KEY);
};

export const deleteRoleCookie = (): void => {
  Cookies.remove(ROLE_KEY);
};

export const deleteAuthCookies = (): void => {
  deleteTokenCookie();
  deleteRoleCookie();
};
