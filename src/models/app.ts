import { Action, action } from "easy-peasy";

export interface IAppModel {
  isLoading: boolean;
  setIsLoading: Action<IAppModel, boolean>;
  isDarkMode: boolean;
  setIsDarkMode: Action<IAppModel, boolean>;
  setResetApp: Action<IAppModel>;
  isSidebarOpen: boolean;
  setIsSidebarOpen: Action<IAppModel, boolean>;
}

const defaultAppState = {
  isLoading: false,
  isDarkMode: false,
  isSidebarOpen: false,
};

const app: IAppModel = {
  isLoading: defaultAppState.isLoading,
  setIsLoading: action((state, payload) => {
    state.isLoading = payload;
  }),
  isDarkMode: defaultAppState.isDarkMode,
  setIsDarkMode: action((state, payload) => {
    state.isDarkMode = payload;
  }),
  setResetApp: action((state) => {
    state.isLoading = defaultAppState.isLoading;
  }),
  isSidebarOpen: defaultAppState.isSidebarOpen,
  setIsSidebarOpen: action((state, payload) => {
    state.isSidebarOpen = payload;
  }),
};

export default app;
