// Import all dependencies ========================================================================================================>
import Fastify from 'fastify';
import cote from 'cote';

// Logic ==========================================================================================================================>
const fastify = Fastify();
const refreshTokensModule = new cote.Requester({ name: 'refresh-tokens-module', namespace: 'refresh-tokens' });

// import { auth_controller } from '../controllers/auth.controller.mjs';
// import authJwt from '../middleware/auth.jwt.mjs';
// import db from '../models/index.mjs';
// import verifySignUp from '../middleware/verify.signup.mjs';

// try { db.sequelize.sync() } catch (e) { console.error(`Error while sync/connect to db: ${e}`) }; // db sync

// user controller routes
// fastify.get('/upload/image', [authJwt.verifyAccessToken, authJwt.isAdmin], auth_controller.upload);
// fastify.get('/activate/:id', [authJwt.verifyMailToken, verifySignUp.isActivated]);
// fastify.get('/control/users', [authJwt.verifyAccessToken, authJwt.isAdmin, authJwt.collectAllUsers]); // Endpoint for CMS
// fastify.get('/control/tokens', [authJwt.verifyAccessToken, authJwt.isAdmin, authJwt.collectAllTokens]); // Endpoint for CMS

// // auth controller routes
fastify.get('/refresh', async (req, res) => { const r = await new Promise(resolve => refreshTokensModule.send({ type: 'refreshTokens', params: { headers: req.headers } }, resolve)); res.send(r) });
// fastify.get('/refresh', [authJwt.verifyRefreshToken], auth_controller.refresh);
// fastify.post('/signin', auth_controller.signin);
// fastify.post('/signup', [verifySignUp.checkDataIsValid, verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.sendActivateLink], auth_controller.signup);


// Activate =======================================================================================================================>
fastify.listen({ port: 5001 }, (err, address) => { if (err) throw err; console.log('Auth Gateway Started') });