import { useEffect, useState } from "react";
import {
  useMsal,
  useIsAuthenticated as useMsalIsAuthenticated,
} from "@azure/msal-react";
import { isTokenExpired } from "../utils/tokenHelper";
import { ELoginType } from "../enums/Enums";
import { InteractionStatus } from "@azure/msal-browser";

const useCustomIsAuthenticated = (): boolean | undefined => {
  const { inProgress } = useMsal();
  const isMsalAuthenticated = useMsalIsAuthenticated();
  const [isAuthenticatedNonAD, setIsAuthenticatedNonAD] = useState<
    boolean | undefined
  >(undefined);

  useEffect(() => {
    const checkCustomToken = () => {
      const loginType = localStorage.getItem("loginType");
      const token = localStorage.getItem("jwtToken");
      const isValid =
        !!token && !isTokenExpired(token) && loginType === ELoginType.App;
      setIsAuthenticatedNonAD(isValid);
    };

    checkCustomToken();

    const handleStorageChange = () => {
      checkCustomToken();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  if (
    isAuthenticatedNonAD === undefined ||
    inProgress !== InteractionStatus.None
  ) {
    return undefined;
  }

  const isUserAuthenticated = isMsalAuthenticated || isAuthenticatedNonAD;

  return isUserAuthenticated;
};

export default useCustomIsAuthenticated;
