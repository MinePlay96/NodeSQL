import WebServer from './WebServer';
import socketIo from 'socket.io';

export default class SocketServer {

  private _socketIoServer: socketIo.Server;

  public constructor(webServer: WebServer) {
    this._socketIoServer = socketIo(webServer.httpServer);
  }
}
