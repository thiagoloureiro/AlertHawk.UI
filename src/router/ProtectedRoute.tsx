import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { FC, useEffect, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { loginRequest } from "../config/authConfig";
import logging from "../utils/logging";
import { useStoreActions } from "../hooks";
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

  // const { user } = useStoreState((actions) => actions.user);
  const { thunkGetUser } = useStoreActions((actions) => actions.user);
  // const { thunkGetRoles } = useStoreActions((actions) => actions.roles);
  // const { thunkGetCountries } = useStoreActions((actions) => actions.countries);
  // const { thunkGetProjects } = useStoreActions((actions) => actions.projects);
  // const { thunkGetSupportRoles } = useStoreActions(
  //   (actions) => actions.supportRoles
  // );

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

  // useEffect(() => {
  //   const fetchAppData = async () => {
  //     await thunkGetRoles();
  //     await thunkGetCountries();
  //     await thunkGetProjects();
  //   };
  //   if (user?.token) {
  //     setTimeout(() => {
  //       fetchAppData();
  //     }, 100);
  //   }
  // }, [user?.token]);

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
