// Import all dependencies ======================================================================================================================================================================================================>
import cote from 'cote';

// Module =======================================================================================================================================================================================================================>
const vrt = new cote.Responder({ name: 'verify-refresh-token-service', namespace: 'verify-refresh-token' });

vrt.on('verifyRefreshToken', async (req, cb) => {
  console.log('Получен хук на verify refresh')
  const headers = req.params.headers;
  console.log('Возврат значения')

  cb('ok')
  //cb({ error: 'Invalid refresh token' })
});