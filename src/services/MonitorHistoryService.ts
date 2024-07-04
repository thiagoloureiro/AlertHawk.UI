import { AxiosResponse } from "axios";
import axiosInstance from "../config/axios";
import appendOptionalHeaders from "../utils/axiosHelper";
import { AxiosHeaders } from "../interfaces/axios/IAxiosHeaders";
import { IHistoryRetentionInDays } from "../interfaces/responses/monitorHistory/IHistoryRetentionInDays";

const responseBody = (response: AxiosResponse) => response.data;
const requests = {
  get: (url: string, headers?: AxiosHeaders) =>
    axiosInstance.monitoring.get(url, { headers }).then(responseBody),
  post: (url: string, body?: Object, headers?: AxiosHeaders, config?: Object) =>
    axiosInstance.monitoring
      .post(url, body, { headers, ...config })
      .then(responseBody),
  delete: (url: string, headers?: AxiosHeaders) =>
    axiosInstance.monitoring.delete(url, { headers }).then(responseBody),
};
const MonitorHistoryService = {
  getMonitorHistoryCount: async (headers?: AxiosHeaders): Promise<number> =>
    await requests.get(
      "MonitorHistory/GetMonitorHistoryCount",
      appendOptionalHeaders(headers)
    ),
  getMonitorHistoryRetention: async (
    headers?: AxiosHeaders
  ): Promise<IHistoryRetentionInDays> =>
    await requests.get(
      "MonitorHistory/GetMonitorHistoryRetention",
      appendOptionalHeaders(headers)
    ),
  setMonitorHistoryRetention: async (
    request: IHistoryRetentionInDays,
    headers?: AxiosHeaders
  ): Promise<IHistoryRetentionInDays> =>
    await requests.post(
      "MonitorHistory/SetMonitorHistoryRetention",
      request,
      appendOptionalHeaders(headers)
    ),
  deleteMonitorHistory: async (headers?: AxiosHeaders): Promise<void> =>
    await requests.delete(`MonitorHistory`, appendOptionalHeaders(headers)),
};

export default MonitorHistoryService;
