import { Action, Thunk, action, thunk } from "easy-peasy";
import logging from "../utils/logging";
import { Environment, Status } from "../enums/Enums";
import { StoreModel } from ".";
import { getStatusFromError } from "../utils/errorHandler";
import { IMonitorGroupListByUser } from "../interfaces/IMonitorGroupListByUser";
import MonitorService from "../services/MonitorService";

export interface IMonitorModel {
  monitorGroupListByUser: IMonitorGroupListByUser[];
  setMonitorGroupListByUser: Action<IMonitorModel, IMonitorGroupListByUser[]>;
  setResetMonitor: Action<IMonitorModel>;
  thunkGetMonitorGroupListByUser: Thunk<
    IMonitorModel,
    Environment,
    any,
    StoreModel,
    Promise<Status>
  >;
}

const monitor: IMonitorModel = {
  monitorGroupListByUser: [],
  setResetMonitor: action((state) => {
    state.monitorGroupListByUser = [];
  }),
  setMonitorGroupListByUser: action((state, payload) => {
    state.monitorGroupListByUser = payload;
  }),

  thunkGetMonitorGroupListByUser: thunk(
    async (actions, id: Environment, { getStoreActions }) => {
      try {
        getStoreActions().app.setIsLoading(true);
        const response = await MonitorService.getMonitorGroupListByUser(id);
        actions.setMonitorGroupListByUser(response);
        return Status.Success;
      } catch (err: any) {
        logging.error(err);
        actions.setMonitorGroupListByUser([]);
        return getStatusFromError(err);
      } finally {
        getStoreActions().app.setIsLoading(false);
      }
    }
  ),
};

export default monitor;
