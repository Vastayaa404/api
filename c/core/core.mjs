// Import all dependencies ========================================================================================================>
import Fastify from 'fastify';
import cors from '@fastify/cors';
import proxy from '@fastify/http-proxy';

// Logic ==========================================================================================================================>
const fastify = Fastify();
fastify.register(cors)
.register(proxy, { upstream: 'http://localhost:5001', prefix: '/auth' }) // To auth gateway
.register(proxy, { upstream: 'http://localhost:5002', prefix: '/service' }) // To project gateway
.register(proxy, { upstream: 'http://localhost:5010', prefix: '/dev' }) // To dev (test) gateway

// Activate =======================================================================================================================>
fastify.listen({ port: 5000 }, (err, address) => { if (err) throw err });