import { FC, ReactElement, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import appRoutes from "./router/Routes";
import getTheme from "./theme";
import { CssBaseline, ThemeProvider, useMediaQuery } from "@mui/material";
import { useStoreActions, useStoreState } from "./hooks";
import Login from "./pages/Login/Login";
import {
  AuthenticatedTemplateProps,
  UnauthenticatedTemplateProps,
} from "@azure/msal-react";
import Register from "./pages/Register/Register";
import NotFound from "./pages/NotFound/NotFound";
import useCustomIsAuthenticated from "./hooks/useCustomIsAuthenticated";
import ResetPassword from "./pages/ResetPassword/ResetPassword";

function AuthenticatedTemplate({
  children,
}: AuthenticatedTemplateProps): ReactElement | null {
  const isAuthenticated: boolean | undefined = useCustomIsAuthenticated();

  if (isAuthenticated === undefined) {
    return null;
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return null;
}

function UnauthenticatedTemplate({
  children,
}: UnauthenticatedTemplateProps): ReactElement | null {
  const isAuthenticated: boolean | undefined = useCustomIsAuthenticated();

  if (isAuthenticated === undefined) {
    return null;
  }

  if (!isAuthenticated) {
    return <>{children}</>;
  }
  return null;
}

const App: FC<{}> = () => {
  const { isDarkMode } = useStoreState((state) => state.app);
  const { setIsSmallScreen, setIsMediumScreen } = useStoreActions(
    (action) => action.app
  );

  const theme = getTheme(isDarkMode ? "dark" : "light");

  const isSmallScreenMediaQuery = useMediaQuery(theme.breakpoints.down("md"));
  const isMediumScreenMediaQuery = useMediaQuery(theme.breakpoints.down("lg"));

  useEffect(() => {
    setIsSmallScreen(isSmallScreenMediaQuery);
  }, [isSmallScreenMediaQuery, setIsSmallScreen]);

  useEffect(() => {
    setIsMediumScreen(isMediumScreenMediaQuery);
  }, [isMediumScreenMediaQuery, setIsMediumScreen]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthenticatedTemplate>
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
        </AuthenticatedTemplate>
        <UnauthenticatedTemplate>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </UnauthenticatedTemplate>
      </Router>{" "}
    </ThemeProvider>
  );
};

export default App;
