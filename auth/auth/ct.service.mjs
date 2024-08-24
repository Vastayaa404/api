// Import all dependencies ======================================================================================================================================================================================================>
import cote from 'cote';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

// Module =======================================================================================================================================================================================================================>
const ct = new cote.Responder({ name: 'create-token-service', namespace: 'create-token' });

ct.on('createToken', async (req, cb) => {
  try {
    const user = req.params.user;
    if (!user.id || !user.username) throw new Error('Invalid user data');

    const accessToken = jwt.sign({ id: user.id, user: user.username }, process.env.JWT_ACCESS_KEY, 
      {
        algorithm: 'HS256',
        expiresIn: 3600, // 1h valid
        issuer: 'Dora authorization service'
      });
  
    const refreshToken = jwt.sign({ id: user.id, user: user.username }, process.env.JWT_REFRESH_KEY,
      {
        algorithm: 'HS256',
        expiresIn: 86400, // 24h valid
        issuer: 'Dora authorization service'
      });
      
    cb({ accessToken, refreshToken });
  } catch (e) { cb({ error: e.message }) };
});