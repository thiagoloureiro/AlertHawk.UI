import { AxiosResponse } from "axios";
import axiosInstance from "../config/axios";
import appendOptionalHeaders from "../utils/axiosHelper";
import { AxiosHeaders } from "../interfaces/axios/IAxiosHeaders";
import { IMonitorGroupListByUser } from "../interfaces/IMonitorGroupListByUser";
import {
  IMonitor,
  IMonitorHttp,
  IMonitorTcp,
  MonitorGroupItem,
} from "../interfaces/IMonitor";
import { IAgent } from "../interfaces/IAgent";
import { Environment } from "../enums/Enums";
import { IMonitorStats } from "../interfaces/IMonitorStats";

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
  get: (url: string, headers?: AxiosHeaders, config?: Object) =>
    axiosInstance.monitoring
      .get(url, { headers, ...config })
      .then(responseBody),
  post: (url: string, body?: Object, headers?: AxiosHeaders, config?: Object) =>
    axiosInstance.monitoring
      .post(url, body, { headers, ...config })
      .then(responseBody),
  put: (url: string, body: Object, headers?: AxiosHeaders) =>
    axiosInstance.monitoring.put(url, body, { headers }).then(responseBody),
  delete: (url: string, headers?: AxiosHeaders) =>
    axiosInstance.monitoring.delete(url, { headers }).then(responseBody),
};

const MonitorService = {
  get: async (id: Environment, headers?: AxiosHeaders): Promise<IMonitor[]> =>
    await requests.get(
      `Monitor/monitorListByMonitorGroupIds/${id}`,
      appendOptionalHeaders(headers)
    ),
  getMonitorGroupListByUser: async (
    environment: number,
    metric?: string,
    headers?: AxiosHeaders
  ): Promise<IMonitorGroupListByUser[]> =>
    await axiosInstance.monitoring(
      `MonitorGroup/monitorDashboardGroupListByUser/${environment}/${
        metric ?? "uptime1Hr"
      }`,
      { headers }
    ).then(responseBody),
  getMonitorGroupListByUserToken: async (
    headers?: AxiosHeaders
  ): Promise<IMonitorGroupListByUser[]> =>
    await requests.get(
      `MonitorGroup/monitorGroupListByUser/`,
      appendOptionalHeaders(headers)
    ),
  getMonitorAgents: async (headers?: AxiosHeaders): Promise<IAgent[]> =>
    await requests.get(
      "Monitor/allMonitorAgents",
      appendOptionalHeaders(headers)
    ),
  getMonitorCount: async (headers?: AxiosHeaders): Promise<number> =>
    await requests.get(
      "Monitor/GetMonitorCount",
      appendOptionalHeaders(headers)
    ),
  getMonitorStatus: async (
    id: Environment,
    headers?: AxiosHeaders
  ): Promise<IMonitorStats> =>
    await requests.get(
      `Monitor/monitorStatusDashboard/${id}`,
      appendOptionalHeaders(headers)
    ),
  getMonitorHttpByMonitorId: async (
    id: number | undefined,
    headers?: AxiosHeaders
  ): Promise<IMonitorHttp> =>
    await requests.get(
      `Monitor/getMonitorHttpByMonitorId/${id}`,
      appendOptionalHeaders(headers)
    ),
  getMonitorTcpByMonitorId: async (
    id: number | undefined,
    headers?: AxiosHeaders
  ): Promise<IMonitorHttp> =>
    await requests.get(
      `Monitor/getMonitorTcpByMonitorId/${id}`,
      appendOptionalHeaders(headers)
    ),
  getMonitorGroupList: async (
    headers?: AxiosHeaders
  ): Promise<IMonitorGroupListByUser[]> =>
    await requests.get(
      `MonitorGroup/monitorGroupList`,
      appendOptionalHeaders(headers)
    ),
  getMonitorNotification: async (
    id: number | undefined,
    headers?: AxiosHeaders
  ): Promise<[]> =>
    await requests.get(
      `MonitorNotification/monitorNotifications/${id}`,
      appendOptionalHeaders(headers)
    ),
  getMonitorJsonBackup: async (headers?: AxiosHeaders): Promise<Blob> =>
    await requests.get(
      "monitor/getMonitorJsonBackup",
      appendOptionalHeaders(headers),
      { responseType: "blob" }
    ),
  uploadMonitorJsonBackup: async (
    formData: FormData,
    headers?: AxiosHeaders
  ): Promise<void> =>
    await requests.post(
      "monitor/uploadMonitorJsonBackup",
      formData,
      appendOptionalHeaders(headers)
    ),
  addMonitorNotification: async (
    monitorNotification: any,
    headers?: AxiosHeaders
  ): Promise<[]> =>
    await requests.post(
      `MonitorNotification/addMonitorNotification`,
      monitorNotification,
      appendOptionalHeaders(headers)
    ),
  removeMonitorNotification: async (
    monitorNotification: any,
    headers?: AxiosHeaders
  ): Promise<[]> =>
    await requests.post(
      `MonitorNotification/removeMonitorNotification`,
      monitorNotification,
      appendOptionalHeaders(headers)
    ),
  pauseMonitor: async (
    id: number,
    paused: boolean,
    headers?: AxiosHeaders
  ): Promise<void> =>
    await requests.put(
      `Monitor/pauseMonitor/${id}/${paused}`,
      appendOptionalHeaders(headers)
    ),
  pauseGroupMonitor: async (
    id: number,
    paused: boolean,
    headers?: AxiosHeaders
  ): Promise<void> =>
    await requests.put(
      `Monitor/pauseMonitorByGroupId/${id}/${paused}`,
      appendOptionalHeaders(headers)
    ),
  createHttpMonitor: async (
    monitor: IMonitorHttp,
    headers?: AxiosHeaders
  ): Promise<void> =>
    await requests.post(
      `Monitor/CreateMonitorHttp`,
      monitor,
      appendOptionalHeaders(headers)
    ),

  createTcpMonitor: async (
    monitor: IMonitorTcp,
    headers?: AxiosHeaders
  ): Promise<void> =>
    await requests.post(
      `Monitor/CreateMonitorTcp`,
      monitor,
      appendOptionalHeaders(headers)
    ),
  addMonitorToGroup: async (
    monitorGroupItem: MonitorGroupItem,
    headers?: AxiosHeaders
  ): Promise<void> =>
    await requests.post(
      `monitorGroup/addMonitorToGroup`,
      monitorGroupItem,
      appendOptionalHeaders(headers)
    ),
  deleteMonitor: async (
    monitorId: number,
    headers?: AxiosHeaders
  ): Promise<void> =>
    await requests.delete(
      `Monitor/deleteMonitor/${monitorId}`,
      appendOptionalHeaders(headers)
    ),
  createMonitorGroup: async (
    monitorGroup: IMonitorGroupListByUser,
    headers?: AxiosHeaders
  ): Promise<void> =>
    await requests.post(
      `monitorGroup/addMonitorGroup`,
      monitorGroup,
      appendOptionalHeaders(headers)
    ),
  editMonitorGroup: async (
    monitorGroup: IMonitorGroupListByUser,
    headers?: AxiosHeaders
  ): Promise<void> =>
    await requests.post(
      `monitorGroup/updateMonitorGroup`,
      monitorGroup,
      appendOptionalHeaders(headers)
    ),
  editHttpMonitor: async (
    monitor: IMonitorHttp,
    headers?: AxiosHeaders
  ): Promise<void> =>
    await requests.post(
      `Monitor/updateMonitorHttp`,
      monitor,
      appendOptionalHeaders(headers)
    ),
  editTcpMonitor: async (
    monitor: IMonitorTcp,
    headers?: AxiosHeaders
  ): Promise<void> =>
    await requests.post(
      `Monitor/updateMonitorTcp`,
      monitor,
      appendOptionalHeaders(headers)
    ),
  deleteGroupMonitor: async (
    monitorId: number,
    headers?: AxiosHeaders
  ): Promise<void> =>
    await requests.delete(
      `monitorGroup/deleteMonitorGroup/${monitorId}`,
      appendOptionalHeaders(headers)
    ),
};

export default MonitorService;
