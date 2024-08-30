// Import all dependencies ======================================================================================================================================================================================================>
import Fastify from 'fastify';
import cote from 'cote';
import { projectHeadersConfig } from './conf.gateway.mjs';

// Module =======================================================================================================================================================================================================================>
const ws = new cote.Requester({ name: 'weather-service', namespace: 'weather', timeout: 10000 });

const fastify = Fastify();
fastify.addHook('onRequest', projectHeadersConfig);

fastify.register((instance, opts, next) => {
  instance.post('/weather', async (req, res) => { const r = await new Promise(resolve => ws.send({ type: 'getWeather', params: { body: req.body } }, resolve)); if (r.error) throw r; res.send(r) });
  next();
});

//fastify.post('/weather', async (req, res) => { const r = await new Promise(resolve => ws.send({ type: 'getWeather', params: { body: req.body.city } }, resolve)); res.send(r) });

// Activate =====================================================================================================================================================================================================================>
fastify.listen({ port: 5040 }, (err, address) => { if (err) throw err; console.log('Project Gateway Started') });