import { FC } from "react";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import appRoutes from "./router/Routes";
import getTheme from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { useStoreState } from "./hooks";
import Login from "./pages/Login/Login";

const App: FC<{}> = () => {
  const { isDarkMode } = useStoreState((state) => state.app);

  const theme = getTheme(isDarkMode ? "dark" : "light");

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthenticatedTemplate>
        <Router>
          <Routes>
            {appRoutes.map((item, index) => (
              <Route key={index} path={item.path} element={item.element}>
                {item.childRoutes
                  ? item.childRoutes.map((jtem: any, jndex: any) => (
                      <Route
                        key={`j${jndex}`}
                        path={jtem.path}
                        element={jtem.element}
                      />
                    ))
                  : null}
              </Route>
            ))}
          </Routes>
        </Router>
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <Router>
          <Login />
        </Router>
      </UnauthenticatedTemplate>
    </ThemeProvider>
  );
};

export default App;
