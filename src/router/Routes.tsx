import { IRoute } from "../interfaces/IRoute";
import Dashboard from "../pages/Dashboard/Dashboard";
import MonitorAgents from "../pages/MonitorAgents/MonitorAgents";
import Settings from "../pages/Settings/Settings";
import Users from "../pages/Users/Users";
import MonitorAlerts from "../pages/MonitorAlerts/MonitorAlerts";
import ProtectedRoute from "./ProtectedRoute";
import MonitorGroups from "../pages/MonitorGroups/MonitorGroups";
import Notifications from "../pages/Notifications/Notifications";
import Admin from "../pages/Admin/Admin";
import MonitorCharts from "../pages/MonitorCharts/MonitorCharts";
import MonitorChartsList from "../pages/MonitorCharts/MonitorChartsList";
import DeleteAccount from "../pages/DeleteAccount/DeleteAccount";

const appRoutes: IRoute[] = [
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/monitor-agents",
    element: (
      <ProtectedRoute>
        <MonitorAgents />
      </ProtectedRoute>
    ),
  },
  {
    path: "/users",
    element: (
      <ProtectedRoute>
        <Users />
      </ProtectedRoute>
    ),
  },
  {
    path: "/monitor-alert/:id",
    element: (
      <ProtectedRoute>
        <MonitorAlerts />
      </ProtectedRoute>
    ),
  },
  {
    path: "/monitor-alert",
    element: (
      <ProtectedRoute>
        <MonitorAlerts />
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    ),
  },
  {
    path: "/monitorGroups",
    element: (
      <ProtectedRoute>
        <MonitorGroups />
      </ProtectedRoute>
    ),
  },
  {
    path: "/notifications",
    element: (
      <ProtectedRoute>
        <Notifications />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <Admin />
      </ProtectedRoute>
    ),
  },
  {
    path: "/monitor-charts",
    element: (
      <ProtectedRoute>
        <MonitorChartsList />
      </ProtectedRoute>
    ),
  },
  {
    path: "/monitor-charts/:monitorId",
    element: (
      <ProtectedRoute>
        <MonitorCharts />
      </ProtectedRoute>
    ),
  },
  {
    path: "/delete-account",
    element: (
      <ProtectedRoute>
        <DeleteAccount />
      </ProtectedRoute>
    ),
  },
];

export default appRoutes;
