import {
  IBaseField, IBaseRow, IConnectionOptions, ITemplateQuerys
} from './interfaces';


export abstract class BaseStreamingHandler {
  public abstract on(event: 'error', callback: (err: Error) => void): this;

  public abstract on(
    event: 'fields',
    callback: (fields: Array<IBaseField>) => void
  ): this;

  public abstract on(event: 'result', callback: (row: IBaseRow) => void): this;

  public abstract on(event: 'end', callback: () => void): this;
}

export abstract class BaseConnector {
  // eslint-disable-next-line max-len
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor, @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  public constructor(connectionOptions: IConnectionOptions) {}

  public abstract async connect(): Promise<this>;

  public abstract query(query: string): BaseStreamingHandler;

  public abstract close(): void;

  // TODO: define query response fields
  public abstract getTemplateQuerys(): ITemplateQuerys;
}
