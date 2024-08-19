// Import all dependencies ======================================================================================================================================================================================================>
import Fastify from 'fastify';
import cote from 'cote';
import { projectHeadersConfig } from './_gateway.config.mjs';

// Module =======================================================================================================================================================================================================================>
const fastify = Fastify();
fastify.addHook('onRequest', projectHeadersConfig);

const weatherService = new cote.Requester({ name: 'weather-service', namespace: 'weather' });

fastify.post('/weather', async (req, res) => { const r = await new Promise(resolve => weatherService.send({ type: 'getWeather', params: { body: req.body.city } }, resolve)); res.send(r) });

// Activate =====================================================================================================================================================================================================================>
fastify.listen({ port: 5040 }, (err, address) => { if (err) throw err; console.log('Project Gateway Started') });