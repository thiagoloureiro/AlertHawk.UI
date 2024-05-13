export interface IMonitorAlerts {
    id: number;
    monitorId: number;
    monitorName: string;
    timeStamp: Date
    status: boolean;
    message: string;
    screenShotUrl: string;
    environment: number;
  }
  