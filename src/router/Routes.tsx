import { IRoute } from "../interfaces/IRoute";
import Dashboard from "../pages/Dashboard/Dashboard";
import MonitorAgents from "../pages/MonitorAgents/MonitorAgents";
import NotFound from "../pages/NotFound/NotFound";
import Settings from "../pages/Settings/Settings";
import ProtectedRoute from "./ProtectedRoute";

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
    path: "/settings",
    element: (
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default appRoutes;
