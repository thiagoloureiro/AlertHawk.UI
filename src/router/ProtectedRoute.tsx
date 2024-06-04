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

  const { selectedEnvironment } = useStoreState((state) => state.app);
  const { user } = useStoreState((state) => state.user);
  const { thunkGetUser } = useStoreActions((actions) => actions.user);
  const { setIsMonitorLoading } = useStoreActions((state) => state.app);
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
