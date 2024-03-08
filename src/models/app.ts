import { Action, action } from "easy-peasy";
import momentTZ from "moment-timezone";

export interface IAppModel {
  isLoading: boolean;
  setIsLoading: Action<IAppModel, boolean>;
  isDarkMode: boolean;
  setIsDarkMode: Action<IAppModel, boolean>;
  setResetApp: Action<IAppModel>;
  isSidebarOpen: boolean;
  setIsSidebarOpen: Action<IAppModel, boolean>;
  selectedDisplayTimezone: string;
  setSelectedDisplayTimezone: Action<IAppModel, string>;
  isSearchEngineIndexingAllowed: boolean;
  setIsSearchEngineIndexingAllowed: Action<IAppModel, boolean>;
}

const defaultAppState = {
  isLoading: false,
  isDarkMode: false,
  isSidebarOpen: false,
  isSearchEngineIndexingAllowed: false,
  selectedDisplayTimezone: momentTZ.tz.guess(),
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
  selectedDisplayTimezone: defaultAppState.selectedDisplayTimezone,
  setSelectedDisplayTimezone: action((state, payload) => {
    state.selectedDisplayTimezone = payload;
  }),
  isSearchEngineIndexingAllowed: defaultAppState.isSearchEngineIndexingAllowed,
  setIsSearchEngineIndexingAllowed: action((state, payload) => {
    state.isSearchEngineIndexingAllowed = payload;
  }),
};

export default app;
