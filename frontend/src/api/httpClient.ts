import ky, { HTTPError } from "ky";
import { API_BASE } from "./constants";
import { tokenStore } from "./tokenStore";

// Singleton instance of ky with base URL
export const privateHttpClient = ky.create({
  prefixUrl: API_BASE,
  timeout: false,
  retry: {
    limit: 2,
    // Add "401" and "post" to defaults, so that refetchToken can be called in `beforeRetry` hook
    statusCodes: [401, 408, 413, 429, 500, 502, 503, 504],
    methods: ["get", "post", "put", "head", "delete", "options", "trace"],
  },
  hooks: {
    beforeRequest: [
      async (request) => {
        if (!request.headers.get("Authorization")) {
          request.headers.set(
            "Authorization",
            `Bearer ${await tokenStore.getToken()}`
          );
        }
      },
    ],

    beforeRetry: [
      async ({ error, request }) => {
        const isAuthError =
          error instanceof HTTPError && error?.response?.status === 401;

        if (isAuthError) {
          const newAccessToken = await tokenStore.getToken(true);
          request.headers.set("Authorization", `Bearer ${newAccessToken}`);
        }
      },
    ],
  },
});

// Facade pattern
// const httpCLient = {
//   get: (...)=>privateHttpClient.get(...)
//   post: (...)=>privateHttpClient.post(...)
// }
