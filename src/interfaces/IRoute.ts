export interface IRoute {
  path: string;
  element: JSX.Element;
  childRoutes?: IRoute[];
}
