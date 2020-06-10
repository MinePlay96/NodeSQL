import { BaseConnector, BaseStreamingHandler } from '../BaseConnector';
import { IBaseField, IBaseRow } from '../interfaces';

class MysqlStreamingHandler extends BaseStreamingHandler {
  public on(event: 'error', callback: (err: Error) => void): this;

  public on(event: 'fields', callback: (fields: Array<IBaseField>) => void): this;

  public on(event: 'result', callback: (row: IBaseRow) => void): this;

  public on(event: 'end', callback: () => void): this;

  public on(event: string, callback: (param: any) => void): this {
    throw new Error('Method not implemented.');
  }

}

export default class MysqlConnector extends BaseConnector {
  public async connect(): Promise<this> {
    throw new Error('Method not implemented.');
  }

  public query(query: string): MysqlStreamingHandler {
    throw new Error('Method not implemented.');
  }

}
