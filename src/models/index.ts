import app, { IAppModel } from "./app";
import user, { IUserModel } from "./user";
import monitor, { IMonitorModel } from "./monitor";
import monitorHistory, { IMonitorHistoryModel } from "./monitorHistory";

export interface StoreModel {
  app: IAppModel;
  user: IUserModel;
  monitor: IMonitorModel;
  monitorHistory: IMonitorHistoryModel;
}

const model: StoreModel = {
  app,
  user,
  monitor,
  monitorHistory,
};

export default model;
