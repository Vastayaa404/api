// Import all dependencies ========================================================================================================>
import Fastify from 'fastify';
import cors from '@fastify/cors';
import proxy from '@fastify/http-proxy';
import { corsConfig, headersConfig } from './core.config.mjs';

// Logic ==========================================================================================================================>
const port = process.env.PORT
const fastify = Fastify({logger: true});
fastify.addHook('onRequest', headersConfig).register(cors, corsConfig)
.register(proxy, { upstream: 'http://localhost:5001', prefix: '/auth' }) // To auth gateway
.register(proxy, { upstream: 'http://localhost:5002', prefix: '/services' }) // To project gateway
.register(proxy, { upstream: 'http://localhost:5010', prefix: '/dev' }) // To dev (test) gateway

fastify.get('/', async (req, res) => { res.send('All ok, im fastify!') });
fastify.get('/status', async (req, res) => { res.send(`headers: ${req.headers}, all ok, no proxy`) });

// Activate =======================================================================================================================>
fastify.listen({ host: '127.0.0.1', port: port }, (err, address) => { if (err) throw err; console.log(`Core Started on address ${address}`) });