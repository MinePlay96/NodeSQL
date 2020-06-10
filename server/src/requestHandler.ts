import { BaseConnector } from './BaseConnector';
import { loadConnectors } from './connectorLoader';
import { IAuthData } from './interfaces';

import socketIo from 'socket.io';

export default async function requestHandler(socket: socketIo.Socket): Promise<void> {

  // TODO: add error handler so that i can just throw errors and they get send over the socket
  // TODO: move in global scope
  const connectors = await loadConnectors();

  let isAuthed = false;
  let connector: BaseConnector;

  function queryHandler(query: string): void {
    if (!isAuthed) {
      socket.emit('error', 'PLACHOLDER_ERROR_NOT_AUTHED');

      return;
    }

    connector.query(query)
      .on('fields', fields => socket.emit('fields', fields))
      .on('result', result => socket.emit('result', result))
      .on('error', error => socket.emit('error', error))
      .on('end', () => socket.emit('end'));
  }

  function authHandler(authData: IAuthData): void {
    isAuthed = true;
    // eslint-disable-next-line prefer-destructuring
    connector = new connectors[authData.connector](authData);
    connector.connect()
      .then(() => {
        socket.emit('connected', true);
      })
      .catch(err => {
        socket.emit('error', err);
      });
  }

  socket.on('auth', authHandler);
  socket.on('query', queryHandler);

}
