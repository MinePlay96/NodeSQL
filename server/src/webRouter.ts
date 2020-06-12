import express from 'express';
import path from 'path';
import { loadConnectors } from './connectorLoader';

const CACHE_MAX_AGE = 60000;
const PUBLIC_PATH = path.join(__dirname, '../../', '/frondend/dist');

const routerFunktion = express.Router;
const router = routerFunktion();

router.use(express.static(PUBLIC_PATH, {
  cacheControl: true,
  maxAge: CACHE_MAX_AGE
}));

router.use('/*', express.static(path.join(PUBLIC_PATH, 'index.html')));

export default router;

