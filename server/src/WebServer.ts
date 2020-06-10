import express from 'express';
import http from 'http';
import path from 'path';

const CACHE_MAX_AGE = 60000;

export default class WebServer {
  public httpServer: http.Server;

  public constructor() {
    const app = express();
    const publicPath = path.join(__dirname, '../../', '/frondend/dist');

    this.httpServer = http.createServer(app);

    app.use(express.static(publicPath, {
      cacheControl: true,
      maxAge: CACHE_MAX_AGE
    }));
    app.use('/*', express.static(path.join(publicPath, 'index.html')));
  }

  public async listen(port: number): Promise<this> {
    return new Promise(resolve => {
      this.httpServer.listen(port, () => {
        resolve(this);
      });
    });
  }
}
