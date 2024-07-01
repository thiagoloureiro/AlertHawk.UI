import { useEffect, useState } from "react";
import { useIsAuthenticated as useMsalIsAuthenticated } from "@azure/msal-react";
import { isTokenExpired } from "../utils/tokenHelper";
import { ELoginType } from "../enums/Enums";

const useCustomIsAuthenticated = (): boolean | undefined => {
  const isMsalAuthenticated = useMsalIsAuthenticated();
  const [isAuthenticatedNonAD, setIsAuthenticatedNonAD] = useState<
    boolean | undefined
  >(undefined); // Initial state as undefined

  // Check for custom JWT token
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

  if (isAuthenticatedNonAD === undefined) {
    return undefined;
  }

  const isUserAuthenticated = isMsalAuthenticated || isAuthenticatedNonAD;

  return isUserAuthenticated;
};

export default useCustomIsAuthenticated;
