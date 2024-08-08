// Import all dependencies ========================================================================================================>
import Fastify from 'fastify';
import cote from 'cote';

// Logic ==========================================================================================================================>
const fastify = Fastify();
const statusService = new cote.Requester({ name: 'status-service', namespace: 'status' })

fastify.get('/status', async (req, res) => { const r = await new Promise(resolve => statusService.send({ type: 'getStatus' }, resolve));
console.log(`Получил ответ от statusService: ${JSON.stringify(r)}, test completed`);
res.send(r) });

// Activate =======================================================================================================================>
fastify.listen({ port: 5010 }, (err, address) => { if (err) throw err });