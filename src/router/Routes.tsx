import { IRoute } from "../interfaces/IRoute";
import Dashboard from "../pages/Dashboard/Dashboard";
import MonitorAgents from "../pages/MonitorAgents/MonitorAgents";
import NotFound from "../pages/NotFound/NotFound";
import Settings from "../pages/Settings/Settings";
import Users from "../pages/Users/Users";
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
    path: "/users",
    element: (
      <ProtectedRoute>
        <Users />
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
