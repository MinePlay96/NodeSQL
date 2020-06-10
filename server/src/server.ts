import express from 'express';
import http from 'http';
import socketIo from 'socket.io';
import requestHandler from './requestHandler';


const SERVER_PORT = 3000;

const expressApp = express();
const webServer = http.createServer(expressApp);
const socketIoServer = socketIo(webServer);

webServer.listen(SERVER_PORT, () => {
  console.log(`server startet on ${SERVER_PORT}`);
});

socketIoServer.on('connection', socket => {
  requestHandler(socket)
    .catch(error => {
      socket.emit('error', error);
    });
});
