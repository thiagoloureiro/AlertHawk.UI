import app, { IAppModel } from "./app";
import user, { IUserModel } from "./user";

export interface StoreModel {
  app: IAppModel;
  user: IUserModel;
}

const model: StoreModel = {
  app,
  user,
};

export default model;
