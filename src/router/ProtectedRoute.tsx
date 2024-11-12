import { useMsal } from "@azure/msal-react";
import { FC, useEffect, useState } from "react";
import { loginRequest } from "../config/authConfig";
import logging from "../utils/logging";
import { useStoreActions, useStoreState } from "../hooks";
import { resetStore } from "../store";
import Layout from "../components/Layout/Layout";
import { ClipLoader } from "react-spinners";
import { isTokenExpired } from "../utils/tokenHelper";
import { ELoginType } from "../enums/Enums";
import Login from "../pages/Login/Login";
import useCustomIsAuthenticated from "../hooks/useCustomIsAuthenticated";

interface ProtectedRouteProps {
  children: React.ReactNode;
  isAdmin?: boolean;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(
    localStorage.getItem("username")
  );

  const isAuthenticated: boolean | undefined = useCustomIsAuthenticated();
  // const navigate: NavigateFunction = useNavigate();
  const { instance } = useMsal();

  const { selectedEnvironment, refreshRate } = useStoreState(
    (state) => state.app
  );
  const { thunkGetUser, thunkGetUserByUsername } = useStoreActions(
    (actions) => actions.user
  );
  const { setIsMonitorLoading, setRefreshRate } = useStoreActions(
    (action) => action.app
  );
  const {
    thunkGetMonitorGroupListByUser,
    thunkGetMonitorAgents,
    thunkGetMonitorStats,
  } = useStoreActions((actions) => actions.monitor);

  const acquireTokenSilent = async () => {
    setIsLoading(true);

    const request = {
      scopes: loginRequest.scopes,
      account: instance.getAllAccounts()[0],
    };

    try {
      const result = await instance.acquireTokenSilent(request);
      localStorage.setItem("jwtToken", result.accessToken);
      window.dispatchEvent(new Event("storage"));
      setEmail(result.account.username);
    } catch (e) {
      logging.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const accessToken = localStorage.getItem("jwtToken");
      const loginType = localStorage.getItem("loginType");

      if (accessToken && isTokenExpired(accessToken)) {
        switch (loginType) {
          case ELoginType.Azure:
            await acquireTokenSilent();
            break;
          case ELoginType.App:
            // TBD - Handle token refresh
            break;
          default:
            break;
        }
      }
    }, 60 * 1000);

    return () => clearInterval(intervalId);
  }, [instance]);

  useEffect(() => {
    const acquireToken = async () => {
      await acquireTokenSilent();
    };

    if (isAuthenticated !== undefined) {
      const accessToken = localStorage.getItem("jwtToken");
      const loginType = localStorage.getItem("loginType");

      if (isAuthenticated && (!accessToken || isTokenExpired(accessToken))) {
        switch (loginType) {
          case ELoginType.Azure:
            acquireToken();
            break;
          case ELoginType.App:
            break;
          default:
            break;
        }
      } else if (!isAuthenticated) {
        localStorage.clear();
        setTimeout(() => {
          window.location.href = "/";
          resetStore();
        }, 10);
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchUserData = async (email: string) => {
      await thunkGetUser(email);
    };

    if (email) {
      fetchUserData(email);
    }
  }, [email]);

  useEffect(() => {
    const fetchUserData = async () => {
      await thunkGetUserByUsername(username!);
    };

    if (username) {
      setTimeout(() => {
        fetchUserData();
      }, 100);
    }
  }, [username]);

  useEffect(() => {
    const handleStorageChange = () => {
      setUsername(localStorage.getItem("username"));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const fetchAppData = async () => {
      try {
        setIsMonitorLoading(true);
        await Promise.all([
          thunkGetMonitorStats(selectedEnvironment),
          thunkGetMonitorGroupListByUser(selectedEnvironment),
          thunkGetMonitorAgents(),
        ]);
      } catch (error) {
        logging.error(error);
      } finally {
        setIsMonitorLoading(false);
      }
    };

    if (isAuthenticated) {
      setTimeout(() => {
        fetchAppData();
      }, 100);
    }
  }, [isAuthenticated, selectedEnvironment]);

  useEffect(() => {
    const fetchAppData = async () => {
      try {
        await Promise.all([
          thunkGetMonitorStats(selectedEnvironment),
          thunkGetMonitorGroupListByUser(selectedEnvironment),
          thunkGetMonitorAgents(),
        ]);
      } catch (error) {
        logging.error(error);
      }
    };

    let refreshIntervalId: ReturnType<typeof setInterval> | null = null;

    if (refreshRate) {
      refreshIntervalId = setInterval(() => {
        fetchAppData();
      }, (refreshRate as number) * 1000);
    }

    const resetRefreshRate = () => {
      setRefreshRate("");
      if (refreshIntervalId) {
        clearInterval(refreshIntervalId);
      }
    };

    const handleUserInteraction = (event: MouseEvent | KeyboardEvent) => {
      // Check if the event is a keyboard event and if the key is "F5"
      if (event instanceof KeyboardEvent && event.key === "F5") {
        resetRefreshRate();
      }
    };

    window.addEventListener("beforeunload", resetRefreshRate); // Handle F5 and page refresh
    document.addEventListener("keydown", handleUserInteraction);

    return () => {
      if (refreshIntervalId) {
        clearInterval(refreshIntervalId);
      }
      window.removeEventListener("beforeunload", resetRefreshRate);
      // document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
    };
  }, [refreshRate, selectedEnvironment]);

  if (isLoading) {
    return <ClipLoader color="primary.dark" size={50} />;
  }

  if (isAuthenticated === undefined) {
    return null;
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return <Layout>{children}</Layout>;
};
export default ProtectedRoute;
