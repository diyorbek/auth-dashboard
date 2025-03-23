import ky from "ky";
import { useNavigate } from "react-router";

import { useMemo } from "react";
import { API_BASE } from "./constants";
import {
  LoginRequestBody,
  LoginResponse,
  RefreshTokenResponse,
  RegisterRequestBody,
  RegisterResponse,
} from "./types";

export async function requestRefreshToken() {
  const data = await ky
    .post(`${API_BASE}/refresh`, { credentials: "include" })
    .json<RefreshTokenResponse>();

  return data;
}

async function requestRegister(body: RegisterRequestBody) {
  const data = ky
    .post(`${API_BASE}/register`, {
      json: body,
      credentials: "include",
    })
    .json<RegisterResponse>();

  return data;
}

async function requestLogin(body: LoginRequestBody) {
  const data = ky
    .post(`${API_BASE}/login`, {
      json: body,
      credentials: "include",
    })
    .json<LoginResponse>();
  return data;
}

async function requestLogout() {
  const data = await ky
    .post(`${API_BASE}/logout`, { credentials: "include" })
    .json();

  return data;
}

export function useAuthRequests() {
  return useMemo(() => ({ requestLogin, requestRegister }), []);
}

export function useLogout() {
  const navigate = useNavigate();
  // const setAccessToken = useSetAccessToken();

  return async () => {
    await requestLogout();
    // setAccessToken(undefined);
    navigate(`/login?backUrl=${window.location.pathname}`, { replace: true });
  };
}

// export function useRefreshToken() {
//   // const setAccessToken = useSetAccessToken();
//   const logout = useLogout();

//   return async () => {
//     try {
//       const { accessToken } = await requestRefreshToken();

//       setAccessToken(accessToken);

//       return accessToken;
//     } catch (error) {
//       const isAuthError =
//         error instanceof HTTPError && error?.response?.status === 401;

//       if (isAuthError) await logout();

//       throw error;
//     }
//   };
// }
