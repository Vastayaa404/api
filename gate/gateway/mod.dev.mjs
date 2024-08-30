// Import all dependencies ======================================================================================================================================================================================================>
import Fastify from 'fastify';
import cote from 'cote';
import { testHeadersConfig } from './conf.gateway.mjs';

// Module =======================================================================================================================================================================================================================>
const fastify = Fastify();
fastify.addHook('onRequest', testHeadersConfig);

const ss = new cote.Requester({ name: 'status-service', namespace: 'status', timeout: 10000 })

fastify.get('/status', async (req, res) => { const r = await new Promise(resolve => ss.send({ type: 'getStatus' }, resolve));
console.log(`Получил ответ от statusService: ${JSON.stringify(r)}, test completed`);
res.send(r) });

// Activate =====================================================================================================================================================================================================================>
fastify.listen({ port: 5060 }, (err, address) => { if (err) throw err; console.log('Dev Gateway Started') });