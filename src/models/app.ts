import { Action, action } from "easy-peasy";
import momentTZ from "moment-timezone";
import { Environment } from "../enums/Enums";

export interface IAppModel {
  isLoading: boolean;
  setIsLoading: Action<IAppModel, boolean>;
  isMonitorLoading: boolean;
  setIsMonitorLoading: Action<IAppModel, boolean>;
  isDarkMode: boolean;
  setIsDarkMode: Action<IAppModel, boolean>;
  setResetApp: Action<IAppModel>;
  isSidebarOpen: boolean;
  setIsSidebarOpen: Action<IAppModel, boolean>;
  selectedDisplayTimezone: string;
  setSelectedDisplayTimezone: Action<IAppModel, string>;
  isSmallScreen: boolean;
  setIsSmallScreen: Action<IAppModel, boolean>;
  isMediumScreen: boolean;
  setIsMediumScreen: Action<IAppModel, boolean>;
  selectedEnvironment: Environment;
  setSelectedEnvironment: Action<IAppModel, Environment>;
  refreshRate: string | number;
  setRefreshRate: Action<IAppModel, string | number>;
}

const defaultAppState = {
  isLoading: false,
  isMonitorLoading: false,
  isDarkMode: false,
  isSidebarOpen: false,
  isSmallScreen: false,
  isMediumScreen: false,
  selectedDisplayTimezone: momentTZ.tz.guess(),
  selectedEnvironment: Environment.Production,
  refreshRate: "",
};

const app: IAppModel = {
  isLoading: defaultAppState.isLoading,
  setIsLoading: action((state, payload) => {
    state.isLoading = payload;
  }),
  isMonitorLoading: defaultAppState.isLoading,
  setIsMonitorLoading: action((state, payload) => {
    state.isMonitorLoading = payload;
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
  selectedDisplayTimezone: defaultAppState.selectedDisplayTimezone,
  setSelectedDisplayTimezone: action((state, payload) => {
    state.selectedDisplayTimezone = payload;
  }),
  isSmallScreen: defaultAppState.isSidebarOpen,
  setIsSmallScreen: action((state, payload) => {
    state.isSmallScreen = payload;
  }),
  isMediumScreen: defaultAppState.isSidebarOpen,
  setIsMediumScreen: action((state, payload) => {
    state.isMediumScreen = payload;
  }),
  selectedEnvironment: defaultAppState.selectedEnvironment,
  setSelectedEnvironment: action((state, payload) => {
    state.selectedEnvironment = payload;
  }),
  refreshRate: defaultAppState.refreshRate,
  setRefreshRate: action((state, payload) => {
    state.refreshRate = payload;
  }),
};

export default app;
