// Import all dependencies ======================================================================================================================================================================================================>
import cote from 'cote';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

// Module =======================================================================================================================================================================================================================>
const ct = new cote.Responder({ name: 'create-token-service', namespace: 'create-token' });

ct.on('createToken', async (req, cb) => {
  try {
    const { id, username } = req.params.user;
    console.log(`id: ${id}, name: ${username}`)
    if (!id || !username || typeof id !== 'number' || typeof username !== 'string') { throw new Error('Invalid user data in CT') };

    const accessToken = jwt.sign({ id, username }, process.env.JWT_ACCESS_KEY, {
      algorithm: 'HS256',
      expiresIn: 3600,
      issuer: 'Dora authorization service'
    });

    const refreshToken = jwt.sign({ id, username }, process.env.JWT_REFRESH_KEY, {
      algorithm: 'HS256',
      expiresIn: 86400,
      issuer: 'Dora authorization service'
    });

    cb({ accessToken, refreshToken });
  } catch (e) { cb({ error: e.message }) };
});