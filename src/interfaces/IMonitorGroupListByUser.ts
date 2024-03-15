import { IMonitorStatusDashboard } from "./IMonitorStatusDashboard";

export interface IMonitorGroupListByUserItem {
  id: number;
  monitorTypeId: number;
  name: string;
  heartBeatInterval: number;
  urlToCheck: string | null;
  monitorTcp: string | null;
  retries: number;
  status: boolean;
  daysToExpireCert: number;
  paused: boolean;
  monitorRegion: number;
  monitorEnvironment: number;
  monitorStatusDashboard: IMonitorStatusDashboard;
}

export interface IMonitorGroupListByUser {
  id: number;
  name: string;
  monitors: IMonitorGroupListByUserItem[];
}
