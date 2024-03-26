export enum Status {
  Failed,
  Success,
  BadRequest,
  Unauthorized,
  Forbidden,
}

export enum Environment {
  Development = 1,
  Staging = 2,
  QA = 3,
  Testing = 4,
  PreProd = 5,
  Production = 6,
}

export enum Region {
  Europe = 1,
  Oceania = 2,
  NorthAmerica = 3,
  SouthAmerica = 4,
  Africa = 5,
  Asia = 6,
  Custom = 7,
}

export enum MonitorHttpMethod {
  Get = 1,
  Post = 2,
  Put = 3,
}