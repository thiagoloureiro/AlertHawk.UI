import { JSX } from "react";

export interface IRoute {
  path: string;
  element: JSX.Element;
  childRoutes?: IRoute[];
}
