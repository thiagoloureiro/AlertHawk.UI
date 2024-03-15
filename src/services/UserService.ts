import { AxiosResponse } from "axios";
import axiosInstance from "../config/axios";
import { IUser } from "../interfaces/IUser";
import appendOptionalHeaders from "../utils/axiosHelper";
import { AxiosHeaders } from "../interfaces/axios/IAxiosHeaders";

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
  get: (url: string, headers?: AxiosHeaders) =>
    axiosInstance.auth.get(url, { headers }).then(responseBody),
  getAll: (url: string, headers?: AxiosHeaders) =>
    axiosInstance.auth.get(url, { headers }).then(responseBody),
  post: (url: string, body?: Object, headers?: AxiosHeaders, config?: Object) =>
    axiosInstance.auth
      .post(url, body, { headers, ...config })
      .then(responseBody),
  put: (url: string, body: Object, headers?: AxiosHeaders) =>
    axiosInstance.auth.put(url, body, { headers }).then(responseBody),

};

const UserService = {
  get: async (email: string, headers?: AxiosHeaders): Promise<IUser> =>
    await requests.get(`user/${email}`, appendOptionalHeaders(headers)),
  getAll: async (headers?: AxiosHeaders): Promise<IUser[]> =>
    await requests.get('user/getAll', appendOptionalHeaders(headers)),
};

export default UserService;
