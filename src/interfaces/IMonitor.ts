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
