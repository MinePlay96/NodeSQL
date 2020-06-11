/* eslint-disable id-length */
import { BaseConnector, BaseStreamingHandler } from '../BaseConnector';
import { IBaseField, IBaseRow, IConnectionOptions } from '../interfaces';

import mysql from 'mysql2';

class MysqlStreamingHandler extends BaseStreamingHandler {

  private _mysqlQuery: mysql.Query;

  public constructor(query: mysql.Query) {
    super();
    this._mysqlQuery = query;
  }

  public on(event: 'error', callback: (err: Error) => void): this;

  public on(event: 'fields', callback: (fields: Array<IBaseField>) => void): this;

  public on(event: 'result', callback: (row: IBaseRow) => void): this;

  public on(event: 'end', callback: () => void): this;

  public on(event: string, callback: (param: any) => void): this {
    this._mysqlQuery.on(event, callback);

    return this;
  }

}

export default class MysqlConnector extends BaseConnector {

  private _mysql: mysql.Connection;

  public constructor(connectionOptions: IConnectionOptions) {
    super(connectionOptions);
    this._mysql = mysql.createConnection({
      multipleStatements: true,
      ...connectionOptions
    });
  }

  public async connect(): Promise<this> {
    return new Promise((resolve, reject) => {
      this._mysql.connect(err => {
        if (err) {
          reject(err);

          return;
        }
        resolve();
      });
    });
  }

  public query(query: string): MysqlStreamingHandler {
    return new MysqlStreamingHandler(this._mysql.query(query));
  }

  public close(): void {
    this._mysql.destroy();
  }
}
