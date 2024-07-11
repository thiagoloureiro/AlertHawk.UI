import { Action, Thunk, action, thunk } from "easy-peasy";
import { StoreModel } from ".";
import { Status } from "../enums/Enums";
import MonitorHistoryService from "../services/MonitorHistoryService";
import logging from "../utils/logging";
import { getStatusFromError } from "../utils/errorHandler";
import { IHistoryRetentionInDays } from "../interfaces/responses/monitorHistory/IHistoryRetentionInDays";

export interface IMonitorHistoryModel {
  retentionInDays: number;
  setRetentionInDays: Action<IMonitorHistoryModel, number>;
  thunkGetMonitorHistoryRetention: Thunk<
    IMonitorHistoryModel,
    void,
    any,
    StoreModel,
    Promise<Status>
  >;
  thunkSetMonitorHistoryRetention: Thunk<
    IMonitorHistoryModel,
    IHistoryRetentionInDays,
    any,
    StoreModel,
    Promise<Status>
  >;
  thunkDeleteMonitorHistory: Thunk<
    IMonitorHistoryModel,
    void,
    any,
    StoreModel,
    Promise<Status>
  >;
}

const monitorHistory: IMonitorHistoryModel = {
  retentionInDays: 0,
  setRetentionInDays: action((state, payload) => {
    state.retentionInDays = payload;
  }),
  thunkGetMonitorHistoryRetention: thunk(
    async (actions, _, { getStoreActions }) => {
      try {
        getStoreActions().app.setIsLoading(true);
        const response =
          await MonitorHistoryService.getMonitorHistoryRetention();
        const historyDaysRetention = response.historyDaysRetention;
        actions.setRetentionInDays(historyDaysRetention);
        return Status.Success;
      } catch (err: any) {
        logging.error(err);
        return getStatusFromError(err);
      } finally {
        getStoreActions().app.setIsLoading(false);
      }
    }
  ),
  thunkSetMonitorHistoryRetention: thunk(
    async (actions, payload: IHistoryRetentionInDays, { getStoreActions }) => {
      try {
        getStoreActions().app.setIsLoading(true);
        const response = await MonitorHistoryService.setMonitorHistoryRetention(
          payload
        );
        const historyDaysRetention = response.historyDaysRetention;
        actions.setRetentionInDays(historyDaysRetention);
        return Status.Success;
      } catch (err: any) {
        logging.error(err);
        return getStatusFromError(err);
      } finally {
        getStoreActions().app.setIsLoading(false);
      }
    }
  ),
  thunkDeleteMonitorHistory: thunk(
    async (_actions, _payload, { getStoreActions }) => {
      try {
        getStoreActions().app.setIsLoading(true);
        await MonitorHistoryService.deleteMonitorHistory();
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

export default monitorHistory;
