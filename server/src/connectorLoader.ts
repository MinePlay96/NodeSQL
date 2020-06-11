import { BaseConnector } from './BaseConnector';
import { promises as fs } from 'fs';
import path from 'path';
import { IConnectorData, IConnectors } from './interfaces';

const CONNECTORS_FOLDERNAME = 'connectors';
const CONNECTORS_PATH = path.join(__dirname, CONNECTORS_FOLDERNAME);

const connectors: IConnectors = {};

export async function loadConnector(name: string): Promise<IConnectorData> {
  const filePath = path.join(CONNECTORS_PATH, name);
  const importet = await import(filePath) as {default: new() => BaseConnector};

  return {
    connector: importet.default,
    name
  };
}

// REDO: make it better
export async function loadConnectors(): Promise<IConnectors> {
  if (Object.keys(connectors).length > Number(null)) {
    return connectors;
  }
  const connectorsFiles = await fs.readdir(CONNECTORS_PATH);
  const connectorsLoaderPrommises: Array<Promise<IConnectorData>> = [];

  connectorsFiles.forEach(connectorFile => {
    const matches = (/(?<fileName>.*?)\.js/u).exec(connectorFile);

    if (matches?.groups?.fileName) {
      connectorsLoaderPrommises.push(loadConnector(matches.groups.fileName));
    }

  });

  const connectorsUnformatet = await Promise.all(connectorsLoaderPrommises);

  connectorsUnformatet.forEach(connectorData => {
    connectors[connectorData.name] = connectorData.connector;
  });

  return connectors;
}
