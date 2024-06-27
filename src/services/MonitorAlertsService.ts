import { AxiosResponse } from "axios";
import axiosInstance from "../config/axios";
import appendOptionalHeaders from "../utils/axiosHelper";
import { AxiosHeaders } from "../interfaces/axios/IAxiosHeaders";
import { IMonitorAlerts } from "../interfaces/IMonitorAlerts";

const responseBody = (response: AxiosResponse) => response.data;
const requests = {
  get: (url: string, headers?: AxiosHeaders) =>
    axiosInstance.monitoring.get(url, { headers }).then(responseBody),
  getBlob: (url: string, headers?: AxiosHeaders) =>
    axiosInstance.monitoring.get(url, { headers, responseType: "blob" }),
};
const MonitorAlertService = {
  get: async (
    monitorId: number,
    days: number = 7,
    headers?: AxiosHeaders
  ): Promise<IMonitorAlerts[]> =>
    await requests.get(
      `MonitorAlert/monitorAlerts/${monitorId}/${days}`,
      appendOptionalHeaders(headers)
    ),
  getReport: async (
    monitorId: number,
    days: number = 30,

    headers?: AxiosHeaders
  ) =>
    await requests.getBlob(
      `MonitorAlert/monitorAlertsReport/${monitorId}/${days}/0`,
      appendOptionalHeaders(headers)
    ),
};

export default MonitorAlertService;
