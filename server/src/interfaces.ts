import { BaseConnector } from './BaseConnector';

export interface IAuthData extends IConnectionOptions {
  connector: string;
}

export interface IConnectors {
  [name: string]: new(connectionOptions: IConnectionOptions) => BaseConnector;
}

export interface IConnectorData {
  name: string;
  connector: new(connectionOptions: IConnectionOptions) => BaseConnector;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IBaseField {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IBaseRow {}
export interface IConnectionOptions {
  host: string;
  user: string;
  password: string;
  database?: string;
  port?: number;
}

// TODO: add import / update / delete querys
// TODO: change to array of query parts / object etc.
export interface ITemplateQuerys {
  getDatabases: string;
  getTablesByDatabase: string;
  getFieldsByTable: string;
  limitQuery: string;
}
