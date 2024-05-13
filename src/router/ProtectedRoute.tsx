import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { FC, useEffect, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { loginRequest } from "../config/authConfig";
import logging from "../utils/logging";
import { useStoreActions, useStoreState } from "../hooks";
import { resetStore } from "../store";
import Layout from "../components/Layout/Layout";
import { ClipLoader } from "react-spinners";

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
  const {
    thunkGetMonitorGroupListByUser,
    thunkGetMonitorAgents,
    thunkGetMonitorStats,
  } = useStoreActions((actions) => actions.monitor);

  useEffect(() => {
    if (isAuthenticated && !sessionStorage.getItem("jwtToken")) {
      setIsLoading(true);

      const request = {
        scopes: loginRequest.scopes,
        account: instance.getAllAccounts()[0],
      };

      instance
        .acquireTokenSilent(request)
        .then((result) => {
          var accessToken = result.accessToken;
          sessionStorage.setItem("jwtToken", accessToken);
          const userEmail = result.account.username;
          setEmail(userEmail);
        })
        .catch((e) => {
          logging.error(e);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if (!isAuthenticated) {
      sessionStorage.clear();
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
        // Run all thunks in parallel
        setIsLoading(true);
        await Promise.all([
          thunkGetMonitorStats(selectedEnvironment),
          thunkGetMonitorGroupListByUser(selectedEnvironment),
          thunkGetMonitorAgents(),
          setIsLoading(false)
        ]);
      } catch (error) {
        console.error("Error fetching app data", error);
        // Handle errors, possibly update state to show an error message or similar
      }
    };
  

    if (user !== null) {
      setTimeout(() => {
        fetchAppData();
      }, 100);
    }
  }, [user, selectedEnvironment]);

  // useEffect(() => {
  //   const fetchSupportRolesData = async () => {
  //     await thunkGetSupportRoles();
  //   };

  //   if (user?.userRole?.userType?.name?.toLowerCase() === "abb") {
  //     setTimeout(() => {
  //       fetchSupportRolesData();
  //     }, 100);
  //   }
  // }, [user?.userRole?.userType?.name]);

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
