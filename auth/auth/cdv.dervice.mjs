// Import all dependencies ======================================================================================================================================================================================================>
  import cote from 'cote';

// Module =======================================================================================================================================================================================================================>
const checkDataIsValidService = new cote.Responder({ name: 'check-data-is-valid-service', namespace: 'check-data-is-valid' });

checkDataIsValidService.on('verifyRefreshToken', async (req, cb) => {
  console.log('Получен хук на check data is valid')
  const headers = req.params.headers;
  console.log('Возврат значения')

  cb('ok')
  //cb({ error: 'Invalid refresh token' })
});