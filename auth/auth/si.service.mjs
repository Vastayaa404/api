// Import all dependencies ======================================================================================================================================================================================================>
import cote from 'cote';
import bcrypt from 'bcryptjs';
import db from '../../db_auth/models/index.mjs';
const Token = db.token;
const User = db.user;

// Module =======================================================================================================================================================================================================================>
const si = new cote.Responder({ name: 'signin-service', namespace: 'signin' });
const ct = new cote.Requester({ name: 'create-token-service', namespace: 'create-token' }); // ct.service

si.on('signIn', async (req, cb) => {
  try {
    if (!req.params.body || !req.params.body.username || !req.params.body.password) { throw new Error("DTO not found") };

    const user = await User.findOne({ where: { username: req.params.body.username } });
    if (!user) { throw new Error("Invalid Username or Password") };

    const passwordIsValid = await bcrypt.compare(req.params.body.password, user.password);
    if (!passwordIsValid) { throw new Error("Invalid Username or Password") };

    if (user.isBanned === 'true') { throw new Error("Your account has been deactivated.") }

    const r = await new Promise(resolve => ct.send({ type: 'createToken', params: { user: user } }, resolve)); if (r.error) throw new Error(r.error);
    const { accessToken, refreshToken } = r;
    const token = await Token.findOne({ where: { username: req.params.body.username } });
    if (token) { await Token.destroy({ where: { username: req.params.body.username } }) };
    await Token.create({ userId: user.id, username: user.username, token: refreshToken });
    
    cb({ username: user.username, accessToken: accessToken, refreshToken: refreshToken });
  } catch (e) { cb({ error: e.message }) };
});