import { createStore, persist } from "easy-peasy";
import model, { StoreModel } from "./models";

const store = createStore<StoreModel>(
  persist(model, { storage: "localStorage" }),
  {
    name: "REACT_VITE_TEMPLATE",
    devTools: import.meta.env.VITE_APP_DEV_TOOLS === "enabled" ? true : false,
    version: 1.0,
  }
);

export const resetStore = () => {
  store.getActions().app.setResetApp();
  store.getActions().monitor.setResetMonitor();
};

export default store;
