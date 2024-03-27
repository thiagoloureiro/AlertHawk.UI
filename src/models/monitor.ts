import { Action, Thunk, action, thunk } from "easy-peasy";
import logging from "../utils/logging";
import { StoreModel } from ".";
import { getStatusFromError } from "../utils/errorHandler";
import { IMonitorGroupListByUser } from "../interfaces/IMonitorGroupListByUser";
import MonitorService from "../services/MonitorService";
import { IAgent } from "../interfaces/IAgent";
import { Environment, Status } from "../enums/Enums";
import { IMonitorStats } from "../interfaces/IMonitorStats";

export interface IMonitorModel {
  monitorGroupListByUser: IMonitorGroupListByUser[];
  setMonitorGroupListByUser: Action<IMonitorModel, IMonitorGroupListByUser[]>;
  monitorGroupList: IMonitorGroupListByUser[];
  addMonitorPainel: boolean;
  setAddMonitorPainel: Action<IMonitorModel, boolean>;
  setMonitorGroupList: Action<IMonitorModel, IMonitorGroupListByUser[]>;
  setResetMonitor: Action<IMonitorModel>;
  thunkGetMonitorGroupListByUser: Thunk<
    IMonitorModel,
    Environment,
    any,
    StoreModel,
    Promise<Status>
  >;
  agents: IAgent[];
  setAgents: Action<IMonitorModel, IAgent[]>;
  thunkGetMonitorAgents: Thunk<IMonitorModel, void, any, StoreModel>;
  stats: IMonitorStats;
  setStats: Action<IMonitorModel, IMonitorStats>;
  thunkGetMonitorStats: Thunk<IMonitorModel, Environment, any, StoreModel>;
}

const monitor: IMonitorModel = {
  monitorGroupListByUser: [],
  setResetMonitor: action((state) => {
    state.monitorGroupListByUser = [];
    state.agents = [];
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
        const monitorGroupList = await MonitorService.getMonitorGroupList();
        actions.setMonitorGroupList(monitorGroupList);
        return Status.Success;
      } catch (err: any) {
        logging.error(err);
        actions.setMonitorGroupListByUser([]);
        actions.setMonitorGroupList([]);
        return getStatusFromError(err);
      } finally {
        getStoreActions().app.setIsLoading(false);
      }
    }
  ),
  agents: [],
  setAgents: action((state, payload) => {
    state.agents = payload;
  }),
  thunkGetMonitorAgents: thunk(async (actions, _, { getStoreActions }) => {
    try {
      getStoreActions().app.setIsLoading(true);
      const agents = await MonitorService.getMonitorAgents();
      actions.setAgents(agents);
      return Status.Success;
    } catch (err: any) {
      logging.error(err);
      actions.setAgents([]);
      return getStatusFromError(err);
    } finally {
      getStoreActions().app.setIsLoading(false);
    }
  }),
  monitorGroupList: [],
  setMonitorGroupList: action((state, payload) => {
    state.monitorGroupList = payload;
  }),
  addMonitorPainel: false,
  setAddMonitorPainel: action((state, payload) => {
    state.addMonitorPainel = payload;
  }),
  stats: {
    monitorUp: 0,
    monitorDown: 0,
    monitorPaused: 0,
  },
  setStats: action((state, payload) => {
    state.stats = payload;
  }),
  thunkGetMonitorStats: thunk(
    async (actions, id: Environment, { getStoreActions }) => {
      try {
        getStoreActions().app.setIsLoading(true);
        const response = await MonitorService.getMonitorStatus(id);
        actions.setStats(response);
        return Status.Success;
      } catch (err: any) {
        logging.error(err);
        return getStatusFromError(err);
      } finally {
        getStoreActions().app.setIsLoading(false);
      }
    }
  ),
};

export default monitor;
