import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { StoreProvider } from "easy-peasy";
import store from "./store.ts";
import "./index.css";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./config/authConfig";
import { PublicClientApplication } from "@azure/msal-browser";
import { SnackbarProvider } from "notistack";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n.ts";

const msalInstance = new PublicClientApplication(msalConfig);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StoreProvider store={store}>
      <MsalProvider instance={msalInstance}>
        <I18nextProvider i18n={i18n}>
          <SnackbarProvider
            preventDuplicate
            autoHideDuration={4000}
            maxSnack={5}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
          >
            <App />
          </SnackbarProvider>
        </I18nextProvider>
      </MsalProvider>
    </StoreProvider>
  </React.StrictMode>
);
