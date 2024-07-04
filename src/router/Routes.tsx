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
];

export default appRoutes;
