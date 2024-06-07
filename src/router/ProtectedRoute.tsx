import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { FC, useEffect, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { loginRequest } from "../config/authConfig";
import logging from "../utils/logging";
import { useStoreActions, useStoreState } from "../hooks";
import { resetStore } from "../store";
import Layout from "../components/Layout/Layout";
import { ClipLoader } from "react-spinners";
import { isTokenExpired } from "../utils/tokenHelper";

interface ProtectedRouteProps {
  children: React.ReactNode;
  isAdmin?: boolean;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");

  const isAuthenticated: boolean = useIsAuthenticated();
  const navigate: NavigateFunction = useNavigate();
  const { instance } = useMsal();

  const { selectedEnvironment, refreshRate } = useStoreState(
    (state) => state.app
  );
  const { user } = useStoreState((state) => state.user);
  const { thunkGetUser } = useStoreActions((actions) => actions.user);
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

      if (accessToken && isTokenExpired(accessToken)) {
        await acquireTokenSilent();
      }
    }, 60 * 1000);

    return () => clearInterval(intervalId);
  }, [instance]);

  useEffect(() => {
    const acquireToken = async () => {
      await acquireTokenSilent();
    };

    const accessToken = localStorage.getItem("jwtToken");

    if (isAuthenticated && (!accessToken || isTokenExpired(accessToken))) {
      acquireToken();
    } else if (!isAuthenticated) {
      localStorage.clear();
      setTimeout(() => {
        window.location.href = "/";
        resetStore();
      }, 10);
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      await thunkGetUser(email);
    };

    if (email) {
      setTimeout(() => {
        fetchUserData();
      }, 100);
    }
  }, [email]);

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

    if (user !== null) {
      setTimeout(() => {
        fetchAppData();
      }, 100);
    }
  }, [user, selectedEnvironment]);

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

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      {(isLoading && <ClipLoader color="primary.dark" size={50} />) || (
        <Layout>{children}</Layout>
      )}
    </>
  );
};
export default ProtectedRoute;
