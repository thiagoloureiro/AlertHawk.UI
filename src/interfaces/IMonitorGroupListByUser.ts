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
  avgUptime1Hr?: number;
  avgUptime24Hrs?: number;
  avgUptime7Days?: number;
  avgUptime30Days?: number;
  avgUptime3Months?: number;
  avgUptime6Months?: number;
}
