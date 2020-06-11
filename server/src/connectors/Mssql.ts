/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable id-length */
import { BaseConnector, BaseStreamingHandler } from '../BaseConnector';
import { IBaseField, IBaseRow, IConnectionOptions } from '../interfaces';

// TODO: mayby add own d.ts file
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
const mssql = require('mssql');

class MssqlStreamingHandler extends BaseStreamingHandler {

  private _mssqlQuery: any;

  private _mssqlEventMap: {[eventName: string]: string} = {
    done: 'end',
    error: 'error',
    recordset: 'fields',
    row: 'result'
  };

  public constructor(query: any) {
    super();
    this._mssqlQuery = query;
  }

  public on(event: 'error', callback: (err: Error) => void): this;

  public on(event: 'fields', callback: (fields: Array<IBaseField>) => void): this;

  public on(event: 'result', callback: (row: IBaseRow) => void): this;

  public on(event: 'end', callback: () => void): this;

  public on(event: string, callback: (param: any) => void): this {
    this._mssqlQuery.on(this._mssqlEventMap[event], callback);

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
    return new MssqlStreamingHandler(this._mssql.query(query));
  }

  public close(): void {
    this._mssql.close();
  }

}
