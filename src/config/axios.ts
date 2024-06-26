import axios from "axios";
import axiosRetry from "axios-retry";
import { resetStore } from "../store";
import logging from "../utils/logging";

const authApiBaseUrl = import.meta.env.VITE_APP_AUTH_API_URL;
const monitoringApiBaseUrl = import.meta.env.VITE_APP_MONITORING_API_URL;
const notificationApiBaseUrl = import.meta.env.VITE_APP_NOTIFICATION_API_URL;

const createAxiosInstance = (baseUrl: string) => {
  const instance = axios.create({
    baseURL: baseUrl,
  });

  axiosRetry(instance, {
    retries: 3,
    retryDelay: (retryCount) => {
      logging.info(`retry attempt: ${retryCount}`);
      return retryCount * 1000;
    },
    retryCondition: (error) => {
      if (
        error.response?.status === 400 ||
        error.response?.status === 401 ||
        error.response?.status === 403 ||
        error.response?.status === 404 ||
        error.response?.status === 500
      ) {
        // Do not retry on 400, 401, 403, 404 or 500
        return false;
      }

      return true;
    },
  });

  function surfaceLogout() {
    localStorage.clear();
    setTimeout(() => {
      window.location.replace("/");
      resetStore();
    }, 10);
  }

  instance.interceptors.request.use(async (requestConfig) => {
    const token = localStorage.getItem("jwtToken");

    if (token != null) {
      requestConfig.headers["Authorization"] = `Bearer ${token}`;
    } else {
      surfaceLogout();
    }

    return requestConfig;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (
        (error.response && error.response.status === 401) ||
        error.response?.status === 403 ||
        // error.response?.status === 500 ||
        error.code == "ERR_NETWORK"
      ) {
        surfaceLogout();
      }

      throw error;
    }
  );
  return instance;
};

const axiosInstance = {
  auth: createAxiosInstance(authApiBaseUrl),
  monitoring: createAxiosInstance(monitoringApiBaseUrl),
  notification: createAxiosInstance(notificationApiBaseUrl),
};

export default axiosInstance;
