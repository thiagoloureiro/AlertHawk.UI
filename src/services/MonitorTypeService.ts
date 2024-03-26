import { AxiosResponse } from "axios";
import axiosInstance from "../config/axios";
import appendOptionalHeaders from "../utils/axiosHelper";
import { AxiosHeaders } from "../interfaces/axios/IAxiosHeaders";
import { IMonitorType } from "../interfaces/IMonitorType";

const responseBody = (response: AxiosResponse) => response.data;
const requests = {
    get: (url: string, headers?: AxiosHeaders) =>
        axiosInstance.monitoring.get(url, { headers }).then(responseBody),
};
const MonitorTypeService = {
    get: async (headers?: AxiosHeaders): Promise<IMonitorType[]> =>
        await requests.get('MonitorType', appendOptionalHeaders(headers)),
};
export default MonitorTypeService;  