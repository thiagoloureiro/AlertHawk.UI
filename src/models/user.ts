import { Action, Thunk, action, thunk } from "easy-peasy";
import { IUser } from "../interfaces/IUser";
import UserService from "../services/UserService";
import logging from "../utils/logging";
import { Status } from "../enums/Enums";
import { StoreModel } from ".";
import { getStatusFromError } from "../utils/errorHandler";

export interface IUserModel {
  user: IUser | null;
  setUser: Action<IUserModel, IUser>;
  setResetUser: Action<IUserModel>;
  thunkGetUser: Thunk<IUserModel, string, any, StoreModel, Promise<Status>>;
}

const defaultUserState: IUser = {
  id: null,
  email: null,
  username: null,
  isAdmin: false,
  token: undefined,
};

const user: IUserModel = {
  user: defaultUserState,
  setResetUser: action((state) => {
    state.user = defaultUserState;
  }),
  setUser: action((state, payload) => {
    state.user = payload;
  }),
  thunkGetUser: thunk(async (actions, payload: string, { getStoreActions }) => {
    try {
      getStoreActions().app.setIsLoading(true);
      const response = await UserService.get(payload);
      actions.setUser(response);
      return Status.Success;
    } catch (err: any) {
      logging.error(err);
      actions.setUser(defaultUserState);
      return getStatusFromError(err);
    } finally {
      getStoreActions().app.setIsLoading(false);
    }
  }),
};

export default user;
