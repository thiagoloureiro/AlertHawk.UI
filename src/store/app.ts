interface IAppState {
  isDarkMode: boolean;
  selectedDisplayTimezone: string;
  dateTimeFormat: string;
  // ... other existing properties
}

const appStore = {
  state: {
    isDarkMode: localStorage.getItem("isDarkMode") === "true",
    selectedDisplayTimezone: localStorage.getItem("selectedDisplayTimezone") || "",
    dateTimeFormat: localStorage.getItem("dateTimeFormat") || "YYYY-MM-DD HH:mm",
    // ... other existing state
  },
  actions: {
    setIsDarkMode: (state: IAppState, isDarkMode: boolean) => {
      localStorage.setItem("isDarkMode", String(isDarkMode));
      return { ...state, isDarkMode };
    },
    setSelectedDisplayTimezone: (state: IAppState, timezone: string) => {
      localStorage.setItem("selectedDisplayTimezone", timezone);
      return { ...state, selectedDisplayTimezone: timezone };
    },
    setDateTimeFormat: (state: IAppState, format: string) => {
      localStorage.setItem("dateTimeFormat", format);
      return { ...state, dateTimeFormat: format };
    },
    // ... other existing actions
  },
}; 