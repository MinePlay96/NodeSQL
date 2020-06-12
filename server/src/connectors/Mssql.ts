/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable id-length */

import { BaseConnector, BaseStreamingHandler } from '../BaseConnector';
import {
  IBaseField, IBaseRow, IConnectionOptions, ITemplateQuerys
} from '../interfaces';

// TODO: mayby add own d.ts file
// eslint-disable-next-line max-len
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
const mssql = require('mssql');

class MssqlStreamingHandler extends BaseStreamingHandler {

  private _mssql: any;

  private _mssqlEventMap: {[eventName: string]: string} = {
    end: 'done',
    error: 'error',
    fields: 'recordset',
    result: 'row'
  };

  public constructor(query: any) {
    super();
    this._mssql = query;
  }

  public on(event: 'error', callback: (err: Error) => void): this;

  public on(event: 'fields', callback: (fields: Array<IBaseField>) => void): this;

  public on(event: 'result', callback: (row: IBaseRow) => void): this;

  public on(event: 'end', callback: () => void): this;

  public on(event: string, callback: Function): this {
    if (event === 'fields') {
      // TODO: define respose body for all propertys
      this._mssql.on(this._mssqlEventMap[event], (data: {[fieldName: string]: object}) => {
        callback(Object.values(data));
      });
    } else {
      this._mssql.on(this._mssqlEventMap[event], callback);
    }

    return this;
  }

}

export default class MssqlConnector extends BaseConnector {
  private _mssql: any;

  public constructor(connectionOptions: IConnectionOptions) {
    super(connectionOptions);

    const { host, ...rest } = connectionOptions;


    this._mssql = new mssql.ConnectionPool({
      server: host,
      ...rest
    });
  }

  public async connect(): Promise<this> {
    return new Promise((resolve, reject) => {
      this._mssql.connect((err: Error | null) => {
        if (err) {
          reject(err);

          return;
        }
        resolve();
      });
    });
  }

  public query(query: string): MssqlStreamingHandler {
    const request = this._mssql.request();

    request.stream = true;
    request.query(query);

    return new MssqlStreamingHandler(request);
  }

  public close(): void {
    this._mssql.close();
  }

  public getTemplateQuerys(): ITemplateQuerys {
    return {
      getDatabases: 'SELECT * FROM sys.databases',
      // TODO: add back compability to sql < 2005
      getFieldsByTable: 'SELECT * FROM {{database}}.INFORMATION_SCHEMA.TABLES',
      // TODO: check if this works
      getTablesByDatabase: 'SELECT * FROM {{database}}.INFORMATION_SCHEMA.COLUMN WHERE TABLE_NAME = \'{{table}}\'',
      // TODO: find a way
      limitQuery: 'SELECT TOP {{amount}} {{queryNoSelect}}'
    };
  }
}
