import { BaseConnector } from './BaseConnector';
import { loadConnectors } from './connectorLoader';
import { IAuthData } from './interfaces';

import socketIo from 'socket.io';

// TODO: remove functions from socpe mayby to object ?
export default async function requestHandler(socket: socketIo.Socket): Promise<void> {

  // eslint-disable-next-line max-len
  // TODO: add error handler so that i can just throw errors and they get send over the socket
  // TODO: move in global scope
  const connectors = await loadConnectors();

  let isAuthed = false;
  let connector: BaseConnector;

  socket.emit('initData', { connectors: Object.keys(connectors) });

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

  function authHandler(connectionData: IAuthData): void {
    const { connector: connectorName, ...authData } = connectionData;

    // TODO: solve this better
    isAuthed = true;
    // TODO: add Check if it is set connectors[authData.connector](authData)
    connector = new connectors[connectorName](authData);
    connector.connect()
      .then(() => {
        socket.emit('authed', { templateQuerys: connector.getTemplateQuerys() });
      })
      .catch((err: Error) => {
        socket.emit('exeption', err.stack);
      });
  }

  socket.on('auth', authHandler);
  socket.on('query', queryHandler);

  socket.on('error', (error: Error) => socket.emit('exeption', error.stack));
  socket.on('disconnect', () => {
    if (isAuthed) {
      connector.close();
    }
  });
}
