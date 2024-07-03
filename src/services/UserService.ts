import axios, { AxiosResponse } from "axios";
import axiosInstance from "../config/axios";
import { IUser } from "../interfaces/IUser";
import appendOptionalHeaders from "../utils/axiosHelper";
import { AxiosHeaders } from "../interfaces/axios/IAxiosHeaders";
import { IUserMonitorGroup } from "../interfaces/IUserMonitorGroup";
import { IUserRegister } from "../interfaces/requests/user/IUserRegister";
import { IUserLogin } from "../interfaces/requests/user/IUserLogin";
import { IToken } from "../interfaces/responses/user/IToken";

const authApiBaseUrl = import.meta.env.VITE_APP_AUTH_API_URL;
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
  customPost: (
    url: string,
    body?: Object,
    headers?: AxiosHeaders,
    config?: Object
  ) => axios.post(url, body, { headers, ...config }).then(responseBody),
  put: (url: string, body: Object, headers?: AxiosHeaders) =>
    axiosInstance.auth.put(url, body, { headers }).then(responseBody),
  delete: (url: string, headers?: AxiosHeaders) =>
    axiosInstance.auth.delete(url, { headers }).then(responseBody),
};

const UserService = {
  register: async (request: IUserRegister): Promise<void> =>
    await requests.customPost(`${authApiBaseUrl}/user/create`, request),
  login: async (request: IUserLogin): Promise<IToken> =>
    await requests.customPost(`${authApiBaseUrl}/auth/login`, request),
  get: async (email: string, headers?: AxiosHeaders): Promise<IUser> =>
    await requests.get(`user/${email}`, appendOptionalHeaders(headers)),
  getByUsername: async (
    username: string,
    headers?: AxiosHeaders
  ): Promise<IUser> =>
    await requests.get(`user/${username}`, appendOptionalHeaders(headers)),
  getAll: async (headers?: AxiosHeaders): Promise<IUser[]> =>
    await requests.get("user/getAll", appendOptionalHeaders(headers)),
  getUserMonitorGroups: async (
    id: string,
    headers?: AxiosHeaders
  ): Promise<IUserMonitorGroup[]> =>
    await requests.get(
      `usersMonitorGroup/GetAllByUserId/${id}`,
      appendOptionalHeaders(headers)
    ),
  updateMonitorGroup: async (
    request: IUserMonitorGroup[],
    headers?: AxiosHeaders
  ): Promise<IUserMonitorGroup> =>
    await requests.post(
      "usersMonitorGroup/create",
      request,
      appendOptionalHeaders(headers)
    ),
  getUserCount: async (headers?: AxiosHeaders): Promise<number> =>
    await requests.get("User/GetUserCount", appendOptionalHeaders(headers)),
  deleteUser: async (id: string, headers?: AxiosHeaders): Promise<void> =>
    await requests.delete(`User/delete/${id}`, appendOptionalHeaders(headers)),
};

export default UserService;
