import { Status } from "../enums/Enums";

export function getStatusFromError(err: any): Status {
  switch (err.response?.status) {
    case 400:
      return Status.BadRequest;
    case 401:
      return Status.Unauthorized;
    case 403:
      return Status.Forbidden;
    default:
      return Status.Failed;
  }
}
