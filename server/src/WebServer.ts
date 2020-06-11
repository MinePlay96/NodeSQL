import express from 'express';
import { loadConnectors } from './connectorLoader';
import http from 'http';
import router from './webRouter';

export default class WebServer {
  public httpServer: http.Server;

  public constructor() {
    const app = express();

    this.httpServer = http.createServer(app);
    app.use(router);
  }

  public async listen(port: number): Promise<this> {
    return new Promise(resolve => {
      this.httpServer.listen(port, () => {
        resolve(this);
      });
    });
  }
}
