import app, { IAppModel } from "./app";
import user, { IUserModel } from "./user";
import monitor, { IMonitorModel } from "./monitor";

export interface StoreModel {
  app: IAppModel;
  user: IUserModel;
  monitor: IMonitorModel;
}

const model: StoreModel = {
  app,
  user,
  monitor,
};

export default model;
