import { Configuration, PopupRequest } from "@azure/msal-browser";

export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_APP_CLIENT_ID || "",
    authority: `${import.meta.env.VITE_APP_AUTHORITY}`,
    redirectUri: import.meta.env.VITE_APP_REDIRECT_URI + "/",
  },
  cache: {
    cacheLocation: "localStorage",
  },
};

export const logOutRequest = {
  auth: {
    clientId: import.meta.env.VITE_APP_CLIENT_ID,
    authority: import.meta.env.VITE_APP_INSTANCE,
    redirectUri: import.meta.env.VITE_APP_REDIRECT_URI,
    postLogoutRedirectUri: import.meta.env.VITE_APP_REDIRECT_URI,
    navigateToLoginRequestUrl: true,
  },
};

export const loginRequest: PopupRequest = {
  scopes: [`api://${import.meta.env.VITE_APP_CLIENT_ID}/access_as_user`],
};
