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
  delete: (url: string, headers?: AxiosHeaders) =>
    axiosInstance.notification.delete(url, { headers }).then(responseBody),
};

const NotificationService = {
  getAll: async (headers?: AxiosHeaders): Promise<INotification[]> =>
    await requests.get(`Notification/SelectNotificationItemList`, appendOptionalHeaders(headers)),
  getNotificationTypes: async (headers?: AxiosHeaders): Promise<INotificationType[]> =>
    await requests.get(`NotificationType/GetNotificationType`, appendOptionalHeaders(headers)),
  create: async (
    notification: INotification,
    headers?: AxiosHeaders
  ): Promise<void> =>
    await requests.post(
      `Notification/createNotificationItem`,
      notification,
      appendOptionalHeaders(headers)
    ),
  edit: async (
    notification: INotification,
    headers?: AxiosHeaders
  ): Promise<void> =>
    await requests.put(
      `Notification/UpdateNotificationItem`,
      notification,
      appendOptionalHeaders(headers)
    ),
  delete: async (notificationId: number, headers?: AxiosHeaders): Promise<void> =>
    await requests.delete(
      `Notification/DeleteNotificationItem?id=${notificationId}`,
      appendOptionalHeaders(headers)
    ),
    sendManualNotification: async (
      notification: INotification,
      headers?: AxiosHeaders
    ): Promise<void> =>
      await requests.post(
        `Notification/SendManualNotification`,
        notification,
        appendOptionalHeaders(headers)
      ),
};

export default NotificationService;
