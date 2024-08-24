// Import all dependencies ======================================================================================================================================================================================================>
import cote from 'cote';
import jwt from 'jsonwebtoken';
import db from '../../db_auth/models/index.mjs';
const Token = db.token;

// Module =======================================================================================================================================================================================================================>
const vrt = new cote.Responder({ name: 'verify-refresh-token-service', namespace: 'verify-refresh-token' });

vrt.on('verifyRefreshToken', async (req, cb) => {
  try {
    if(!req.params.cookies) throw new Error('Cookies not found');
    let token = req.params.cookies.rt; // Parse from httpOnly cookies automatically (if req withCredentials = true)
    if (!token) { throw new Error("Token not found") };

    jwt.verify(token, process.env.JWT_REFRESH_KEY, { issuer: 'Dora authorization service' }, 
    (err, decoded) => { if (err) { throw new Error("Token expired/invalid or issued by an unauthorized issuer") }; req.id = decoded.id });

    await Token.findOne({ where: { token: req.params.cookies.rt } }).then(t => { if (!t) { throw new Error("Token invalid or issued by an unauthorized issuer") } }) 
    cb('next');
  } catch (e) { cb({ error: e.message }) }
});