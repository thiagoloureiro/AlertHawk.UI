import { HttpStatusCode } from "axios";
import { MonitorHttpMethod } from "../enums/Enums";
import { IMonitorStatusDashboard } from "./IMonitorStatusDashboard";

export interface IMonitorResponse {
  id: number;
  name: string;
  monitors: IMonitor[];
}

export interface IMonitor {
  id: number;
  monitorTypeId: number;
  name: string;
  heartBeatInterval: number;
  retries: number;
  status: boolean;
  daysToExpireCert: number;
  paused: boolean;
  monitorRegion: number;
  monitorEnvironment: number;
  monitorStatusDashboard: IMonitorStatusDashboard;
}

export interface IMonitorHttp extends IMonitor {
  id: number;
  monitorTypeId: number;
  name: string;
  heartBeatInterval: number;
  retries: number;
  status: boolean;
  daysToExpireCert: number;
  paused: boolean;
  monitorRegion: number;
  monitorEnvironment: number;
  monitorStatusDashboard: IMonitorStatusDashboard;
  monitorId: number;
  checkCertExpiry: boolean;
  ignoreTlsSsl: boolean;
  maxRedirects: number;
  urlToCheck: string;
  responseStatusCode: HttpStatusCode;
  timeout: number;
  lastStatus: boolean;
  responseTime: number;
  httpVersion?: string;
  monitorHttpMethod: MonitorHttpMethod;
  body?: string;
  headersJson?: string;
  headers?: Array<[string, string]>;
}
export interface IMonitorTcp  {
  id: number;
  monitorTypeId: number;
  name: string;
  heartBeatInterval: number;
  retries: number;
  status: boolean;
  paused: boolean;
  monitorRegion: number;
  monitorEnvironment: number;
  timeout: number;
  port: number;
  ip: string;
}

export interface MonitorGroupItem {
  monitorId: number;
  monitorgroupId: number;
}