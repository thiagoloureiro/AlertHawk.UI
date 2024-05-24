import { AxiosResponse } from "axios";
import axiosInstance from "../config/axios";
import appendOptionalHeaders from "../utils/axiosHelper";
import { AxiosHeaders } from "../interfaces/axios/IAxiosHeaders";

const responseBody = (response: AxiosResponse) => response.data;
const requests = {
  get: (url: string, headers?: AxiosHeaders) =>
    axiosInstance.monitoring.get(url, { headers }).then(responseBody),
};
const MonitorHistoryService = {
  getMonitorHistoryCount: async (headers?: AxiosHeaders): Promise<number> =>
    await requests.get(
      "MonitorHistory/GetMonitorHistoryCount",
      appendOptionalHeaders(headers)
    ),
};

export default MonitorHistoryService;
