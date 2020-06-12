import socketIo from 'socket.io';
import requestHandler from './requestHandler';
import WebServer from './WebServer';

// TODO: add good loging

const SERVER_PORT = 3000;

const webServer = new WebServer();
const socketIoServer = socketIo(webServer.httpServer);

webServer.listen(SERVER_PORT)
  .then(() => {
    console.log(`server startet on ${SERVER_PORT}`);
  })
  .catch(error => {
    throw error;
  });

socketIoServer.on('connection', socket => {
  requestHandler(socket)
    .catch(error => {
      socket.emit('error', error);
    });
});
