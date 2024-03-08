import { IRoute } from "../interfaces/IRoute";
import Dashboard from "../pages/Dashboard/Dashboard";
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
