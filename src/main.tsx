import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { StoreProvider } from "easy-peasy";
import store from "./store.ts";
import "./index.css";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./config/authConfig";
import { PublicClientApplication } from "@azure/msal-browser";

const msalInstance = new PublicClientApplication(msalConfig);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StoreProvider store={store}>
      <MsalProvider instance={msalInstance}>
        <App />
      </MsalProvider>
    </StoreProvider>
  </React.StrictMode>
);
