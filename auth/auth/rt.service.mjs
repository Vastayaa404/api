// Import all dependencies ======================================================================================================================================================================================================>
import cote from 'cote';
import db from '../../db_auth/models/index.mjs';
const Token = db.token;

// Module =======================================================================================================================================================================================================================>
const rt = new cote.Responder({ name: 'refresh-tokens-service', namespace: 'refresh-tokens' });
const ct = new cote.Requester({ name: 'create-token-service', namespace: 'create-token' }); // ct.service

rt.on('refreshTokens', async (req, cb) => {
  try {
    const token = await Token.findOne({ where: { token: req.params.cookies.rt } }); if (!token) throw new Error('Bad token');
    const { userId, username } = token;
    const user = { id: userId, username: username };

    const r = await new Promise(resolve => ct.send({ type: 'createToken', params: { user: user } }, resolve)); if (r.error) throw new Error(r.error);
    const { accessToken, refreshToken } = r;

    await Token.destroy({ where: { token: req.params.cookies.rt } });
    await Token.create({ userId: user.id, username: user.username, token: refreshToken });

    cb({ accessToken: accessToken, refreshToken: refreshToken })
  } catch (e) { cb({ error: e.message }) };
});