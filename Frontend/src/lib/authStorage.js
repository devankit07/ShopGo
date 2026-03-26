const ACCESS_TOKEN_KEY = "accesstoken";
const REFRESH_TOKEN_KEY = "refreshtoken";
const USER_KEY = "user";

const safeParse = (raw) => {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const getAccessToken = () =>
  sessionStorage.getItem(ACCESS_TOKEN_KEY) || "";

export const setAccessToken = (token) => {
  if (token) sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export const setRefreshToken = (token) => {
  if (token) sessionStorage.setItem(REFRESH_TOKEN_KEY, token);
};

export const getStoredUser = () =>
  safeParse(sessionStorage.getItem(USER_KEY));

export const setStoredUser = (user) => {
  if (!user) return;
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearAuthStorage = () => {
  sessionStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);

  // cleanup legacy keys to avoid stale cross-tab role/state overrides
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};
