import { AxiosHeaders } from "../interfaces/axios/IAxiosHeaders";

let config: AxiosHeaders = { "Content-Type": "application/json" };

const appendOptionalHeaders = (headers?: AxiosHeaders) => {
  const defaultHeaders: AxiosHeaders = config;
  return headers ? { ...defaultHeaders, ...headers } : defaultHeaders;
};

export default appendOptionalHeaders;
