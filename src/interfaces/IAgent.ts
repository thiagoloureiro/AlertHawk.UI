export interface IAgent {
  id: number;
  hostname: string;
  timeStamp: string;
  isMaster: boolean;
  listTasks: number;
  monitorRegion: number;
  version: string;
}
