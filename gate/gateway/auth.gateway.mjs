// Import all dependencies ======================================================================================================================================================================================================>
import Fastify from 'fastify';
import cookie from '@fastify/cookie';
import middie from '@fastify/middie';
import cote from 'cote';
import { authHeadersConfig } from './_gateway.config.mjs';

// Module =======================================================================================================================================================================================================================>
// const signinModule = new cote.Requester({ name: 'signin-module', namespace: 'signin' });
// const signupModule = new cote.Requester({ name: 'signup-module', namespace: 'signup' });
// const signupActivateModule = new cote.Requester({ name: 'signup-activate-module', namespace: 'signup-activate' });

const verifyRefreshTokenService = new cote.Requester({ name: 'verify-refresh-token-service', namespace: 'verify-refresh-token' }); // vrt.service
const refreshTokensService = new cote.Requester({ name: 'refresh-tokens-service', namespace: 'refresh-tokens' }); // rt.service

const checkDataIsValidService = new cote.Requester({ name: 'check-data-is-valid-service', namespace: 'check-data-is-valid' }); // cdv.service
const signupService = new cote.Requester({ name: 'signup-service', namespace: 'signup' }); // su.service
const signinService = new cote.Requester({ name: 'signin-service', namespace: 'signin' }); // si.service

const fastify = Fastify();
fastify.addHook('onRequest', authHeadersConfig)
.register(cookie, { secret: "my-secret", hook: 'onRequest', parseOptions: {} })
//.register(middie, { hook: 'preHandler' })

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


//fastify.addHook('preHandler', async (req, res) => { const r = await new Promise(resolve => verifyRefreshTokenService.send({ type: 'verifyRefreshToken', params: { cookies: req.cookies } }, resolve)); if (r.error) throw r });
//fastify.addHook('preHandler', async (req, res) => { const r = await new Promise(resolve => checkDataIsValidService.send({ type: 'checkDataIsValid', params: { cookies: req.cookies } }, resolve)); if (r.error) throw r });

//middie.use(['/refresh'], async (req, res) => { const r = await new Promise(resolve => verifyRefreshTokenService.send({ type: 'verifyRefreshToken', params: { cookies: req.cookies } }, resolve)); if (r.error) throw r })
middie.use('/refresh', [cors(), staticFiles('/assets')])

const verifyRefreshTokenMiddleware = async (req, res, next) => {
  const r = await new Promise(resolve => verifyRefreshTokenService.send({ type: 'verifyRefreshToken', params: { cookies: req.cookies } }, resolve));
  if (r.error) return res.code(401).send({ error: 'Invalid refresh token' })
  next();
};

const checkDataIsValidMiddleware = async (req, res, next) => {
  const r = await new Promise(resolve => checkDataIsValidService.send({ type: 'checkDataIsValid', params: { cookies: req.cookies } }, resolve));
  if (r.error) return res.code(400).send({ error: 'Invalid data' })
  next();
};

// fastify.get('/refresh', {
//   preHandler: verifyRefreshTokenMiddleware,
//   handler: async (req, res) => { const r = await new Promise(resolve => refreshTokensService.send({ type: 'refreshTokens', params: { cookies: req.cookies } }, resolve)); res.send(r) }
// });

fastify.get('/refresh', async (req, res) => { const r = await new Promise(resolve => refreshTokensService.send({ type: 'refreshTokens', params: { cookies: req.cookies } }, resolve)); res.send(r) });
fastify.post('/signup', async (req, res) => { const r = await new Promise(resolve => signupService.send({ type: 'signUp', params: { cookies: req.cookies } }, resolve)); res.send(r) });
// fastify.get('/refresh', [authJwt.verifyRefreshToken], auth_controller.refresh);
// fastify.post('/signin', auth_controller.signin);
// fastify.post('/signup', [verifySignUp.checkDataIsValid, verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.sendActivateLink], auth_controller.signup);


// Activate =====================================================================================================================================================================================================================>
fastify.listen({ port: 5020 }, (err, address) => { if (err) throw err; console.log('Auth Gateway Started') });