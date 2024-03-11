import { createTheme } from "@mui/material/styles";
import "@fontsource-variable/roboto-mono";

const getTheme = (mode: "light" | "dark") =>
  createTheme({
    palette: {
      mode,
      ...(mode === "light"
        ? {
            primary: {
              "50": "#e0f7fa",
              "100": "#b2ebf2",
              "200": "#80deea",
              "300": "#4dd0e1",
              "400": "#26c6da",
              "500": "#00bcd4",
              "600": "#00acc1",
              "700": "#0097a7",
              "800": "#00838f",
              "900": "#006064",
            },
            secondary: {
              light: "#757575",
              main: "#f5f5f5",
              dark: "#e3e3e3",
              contrastText: "#000",
            },
            danger: {
              "50": "#ffebee",
              "100": "#ffcdd2",
              "200": "#ef9a9a",
              "300": "#e57373",
              "400": "#ef5350",
              "500": "#f44336",
              "600": "#e53935",
              "700": "#d32f2f",
              "800": "#c62828",
              "900": "#b71c1c",
            },
            success: {
              "50": "#e8f5e9",
              "100": "#c8e6c9",
              "200": "#a5d6a7",
              "300": "#81c784",
              "400": "#66bb6a",
              "500": "#4caf50",
              "600": "#43a047",
              "700": "#388e3c",
              "800": "#2e7d32",
              "900": "#1b5e20",
            },
            warning: {
              "50": "#fff3e0",
              "100": "#ffe0b2",
              "200": "#ffcc80",
              "300": "#ffb74d",
              "400": "#ffa726",
              "500": "#ff9800",
              "600": "#fb8c00",
              "700": "#f57c00",
              "800": "#ef6c00",
              "900": "#e65100",
            },
          }
        : {
            primary: {
              "50": "#e0f7fa",
              "100": "#b2ebf2",
              "200": "#80deea",
              "300": "#4dd0e1",
              "400": "#26c6da",
              "500": "#00bcd4",
              "600": "#00acc1",
              "700": "#0097a7",
              "800": "#00838f",
              "900": "#006064",
            },
            secondary: {
              light: "#bdbdbd",
              main: "#4f4f4f",
              dark: "#424242",
              contrastText: "#fff",
            },
            success: {
              "50": "#f1f8e9",
              "100": "#dcedc8",
              "200": "#c5e1a5",
              "300": "#aed581",
              "400": "#9ccc65",
              "500": "#8bc34a",
              "600": "#7cb342",
              "700": "#689f38",
              "800": "#558b2f",
              "900": "#33691e",
            },
            warning: {
              "50": "#fff8e1",
              "100": "#ffecb3",
              "200": "#ffe082",
              "300": "#ffd54f",
              "400": "#ffca28",
              "500": "#ffc107",
              "600": "#ffb300",
              "700": "#ffa000",
              "800": "#ff8f00",
              "900": "#ff6f00",
            },
            danger: {
              "50": "#fdf2f8",
              "100": "#fce7f3",
              "200": "#fbcfe8",
              "300": "#f9a8d4",
              "400": "#f472b6",
              "500": "#ec4899",
              "600": "#db2777",
              "700": "#be185d",
              "800": "#9d174d",
              "900": "#831843",
            },
          }),
    },
    typography: {
      fontFamily: ['"Roboto Mono Variable"', "sans-serif"].join(","),
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: "56px",
            },
            "& .MuiOutlinedInput-input": {
              paddingLeft: "20px",
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: "30px",
          },
          input: {
            paddingLeft: "8px",
          },
        },
      },
      MuiButton: {
        defaultProps: {
          disableFocusRipple: true,
          disableElevation: true,
        },
        styleOverrides: {
          text: {
            fontFamily: ['"Roboto Mono Variable"', "sans-serif"].join(","),
            fontStyle: "normal",
            fontWeight: 400,
            fontSize: "14px",
            lineHeight: "18px",
            textTransform: "none",
            borderRadius: "56px",
          },
          contained: {
            fontFamily: ['"Roboto Mono Variable"', "sans-serif"].join(","),
            fontStyle: "normal",
            fontWeight: 500,
            fontSize: "14px",
            lineHeight: "18px",
            textTransform: "none",
            boxShadow: "none",
            borderRadius: "56px",
            padding: "12px 24px",
            height: "42px",
            "&.Mui-disabled": {
              color: "#868686",
            },
            "&.Mui-focusVisible": {
              background: "rgb(178, 0, 10)",
            },
          },
          outlined: {
            color: "#000000",
            fontFamily: ['"Roboto Mono Variable"', "sans-serif"].join(","),
            fontStyle: "normal",
            fontWeight: 500,
            fontSize: "14px",
            lineHeight: "18px",
            textTransform: "none",
            boxShadow: "none",

            borderRadius: "56px",
            height: "32px",
            padding: "0px 24px",
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          colorDefault: {
            backgroundColor: mode === "dark" ? "#00bcd4" : "#001e3c",
            color: "#ffffff",
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          root: {
            "&:not(.menu-select) .MuiMenuItem-root": {
              fontFamily: ['"Roboto Mono Variable"', "sans-serif"].join(","),
              fontSize: "16px",
              lineHeight: "20px",
              paddingTop: "12px",
              paddingBottom: "12px",
            },
          },
        },
      },
      MuiSvgIcon: {
        styleOverrides: {
          root: {
            color: mode === "dark" ? "#ffffff" : "#001e3c",
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            color: mode === "dark" ? "#ffffff" : "#001e3c",
            "&.Mui-selected": {
              backgroundColor: "rgba(0, 188, 212, 0.08)",
            },
          },
        },
      },
      MuiAutocomplete: {
        styleOverrides: {
          root: {
            "& .MuiAutocomplete-input": {
              borderRadius: "30px",
            },
          },
          inputRoot: {
            paddingLeft: "18px",
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            borderRadius: "30px",
          },
          select: {
            paddingLeft: "20px",
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: mode === "light" ? "#fafafa" : null,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: "none",
            borderRadius: "12px",
          },
        },
      },
    },
  });

export default getTheme;
