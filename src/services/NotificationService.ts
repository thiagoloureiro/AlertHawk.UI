import { AxiosResponse } from "axios";
import axiosInstance from "../config/axios";
import appendOptionalHeaders from "../utils/axiosHelper";
import { AxiosHeaders } from "../interfaces/axios/IAxiosHeaders";

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
  get: (url: string, headers?: AxiosHeaders) =>
    axiosInstance.notification.get(url, { headers }).then(responseBody),
  getAll: (url: string, headers?: AxiosHeaders) =>
    axiosInstance.notification.get(url, { headers }).then(responseBody),
  post: (url: string, body?: Object, headers?: AxiosHeaders, config?: Object) =>
    axiosInstance.notification
      .post(url, body, { headers, ...config })
      .then(responseBody),
  put: (url: string, body: Object, headers?: AxiosHeaders) =>
    axiosInstance.notification.put(url, body, { headers }).then(responseBody),

};

const NotificationService = {
  getAll: async (headers?: AxiosHeaders): Promise<INotification[]> =>
    await requests.get(`Notification/SelectNotificationItemList`, appendOptionalHeaders(headers)),
  getNotificationTypes: async (headers?: AxiosHeaders): Promise<INotificationType[]> =>
    await requests.get(`NotificationType/GetNotificationType`, appendOptionalHeaders(headers)),
};

export default NotificationService;
