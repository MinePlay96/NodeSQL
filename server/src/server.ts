import socketIo from 'socket.io';
import requestHandler from './requestHandler';
import WebServer from './WebServer';
import { loadConnectors } from './connectorLoader';

// TODO: add good loging

const SERVER_PORT = 3000;

const webServer = new WebServer();
const socketIoServer = socketIo(webServer.httpServer);

// TODO: Clean up
// load connectors on startup for performance reasons
loadConnectors()
  .then(async() => webServer.listen(SERVER_PORT))
  .then(() => {
    console.log(`server startet on ${SERVER_PORT}`);
  })
  .catch(error => {
    throw error;
  });

socketIoServer.on('connection', socket => {
  requestHandler(socket)
    .catch(error => {
      socket.emit('exeption', error);
    });
});
