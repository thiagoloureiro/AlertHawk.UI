import { IHistoryData } from "./IHistoryData";

export interface IMonitorStatusDashboard {
  monitorId: number;
  uptime1Hr?: number;
  uptime24Hrs?: number;
  uptime7Days?: number;
  uptime30Days?: number;
  uptime3Months?: number;
  uptime6Months?: number;
  certExpDays: number;
  responseTime: number;
  historyData: IHistoryData[];
}
