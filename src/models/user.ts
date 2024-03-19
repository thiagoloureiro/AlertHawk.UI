import { Action, Thunk, action, thunk } from "easy-peasy";
import { IUser } from "../interfaces/IUser";
import UserService from "../services/UserService";
import logging from "../utils/logging";
import { Status } from "../enums/Enums";
import { StoreModel } from ".";
import { getStatusFromError } from "../utils/errorHandler";
import { IUserMonitorGroup } from "../interfaces/IUserMonitorGroup";

export interface IUserModel {
  user: IUser | null;
  users: IUser[];
  setUser: Action<IUserModel, IUser>;
  setUsers: Action<IUserModel, IUser[]>;
  setResetUser: Action<IUserModel>;
  thunkGetUser: Thunk<IUserModel, string, any, StoreModel, Promise<Status>>;
  thunkGetAllUsers: Thunk<IUserModel, void, any, StoreModel, Promise<Status>>;
}

const defaultUserState: IUser = {
  id: null,
  email: null,
  username: null,
  isAdmin: false,
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
  users: [],
  thunkGetAllUsers: thunk(async (actions, _, { getStoreActions }) => {
    try {
      getStoreActions().app.setIsLoading(true);
      const users = await UserService.getAll();
      users.sort((a, b) => (a.username ?? '').localeCompare(b.username ?? ''));
      actions.setUsers(users);
      return Status.Success;
    } catch (err: any) {
      logging.error(err);
      actions.setUsers([]);
      return getStatusFromError(err);
    } finally {
      getStoreActions().app.setIsLoading(false);
    }
  }),
  setUsers: action((state, payload) => {
    state.users = payload;
  })
};

export default user;
