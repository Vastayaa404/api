// Import all dependencies ========================================================================================================>
import Fastify from 'fastify';
import cors from '@fastify/cors';
import proxy from '@fastify/http-proxy';
import { v4 as uuidv4 } from 'uuid';

// Logic ==========================================================================================================================>
const fastify = Fastify();
fastify.register(cors)
.addHook('onRequest', (req, res, next) => { req.headers['X-Dora-Request-Id'] = uuidv4(); next() }) // ID Header to all requests
.register(proxy, { upstream: 'http://localhost:5001', prefix: '/auth' }) // To auth gateway
.register(proxy, { upstream: 'http://localhost:5002', prefix: '/services' }) // To project gateway
.register(proxy, { upstream: 'http://localhost:5010', prefix: '/dev' }) // To dev (test) gateway

// Activate =======================================================================================================================>
fastify.listen({ port: 5000 }, (err, address) => { if (err) throw err; console.log('Core Started') });