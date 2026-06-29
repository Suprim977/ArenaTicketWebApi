import Cookies from "js-cookie";

const TOKEN_KEY = "token";

export const setTokenCookie = (token: string): void => {
  Cookies.set(TOKEN_KEY, token, { expires: 7, sameSite: "lax" });
};

export const getTokenCookie = (): string | undefined => {
  return Cookies.get(TOKEN_KEY);
};

export const deleteTokenCookie = (): void => {
  Cookies.remove(TOKEN_KEY);
};
