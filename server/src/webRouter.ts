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

router.get('/connectors', (req, res) => {
  loadConnectors().then(connectors => {
    const connectorNames = Object.keys(connectors);

    res.type('application/json');
    res.send(JSON.stringify(connectorNames));
  })
    .catch(console.error);
});

router.use('/*', express.static(path.join(PUBLIC_PATH, 'index.html')));

export default router;

