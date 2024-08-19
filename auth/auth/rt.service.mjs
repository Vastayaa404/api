// Import all dependencies ======================================================================================================================================================================================================>
import cote from 'cote';
import db from '../../db_auth/models/index.mjs';
const Token = db.token;

// Module =======================================================================================================================================================================================================================>
const refreshTokensService = new cote.Responder({ name: 'refresh-tokens-service', namespace: 'refresh-tokens' });

//try { db.sequelize.sync() } catch (e) { console.error(`Error while sync/connect to db: ${e}`) };

// db.sequelize.sync({force: true}).then(() => {
//     console.log('Drop and Resync Db');
//     initial();
// });
// function initial() {
//     db.role.create({
//       id: 1,
//       name: "user"
//     });
   
//     db.role.create({
//       id: 2,
//       name: "moderator"
//     });   
//     db.role.create({
//       id: 3,
//       name: "admin"
//     });
// }

refreshTokensService.on('refreshTokens', async (req, cb) => {
  try {
    console.log(`Пришедший токен: ${req.params.cookies.refreshToken}`)
    const token = await Token.findOne({ where: { token: req.params.cookies.refreshToken } });
    //const { userId, username } = token;
    const user = { id: userId, user: username };
    console.log(`Токен в бд: ${token}`)
    //const { accessToken, refreshToken } = authJwt.createToken(user);

    //await Token.destroy({ where: { token: req.cookies.refreshToken } });
    //await Token.create({ userId: user.id, username: user.user, token: refreshToken });

    //res.cookie('refreshToken', refreshToken, { maxAge: 1000*60*60*24, httpOnly: true, secure: true });
    //res.status(200).send({ accessToken: accessToken });
  } catch (e) { cb({ error: 'Invalid token' }) };

  console.log(`Возврат значения, \n${req.params.cookies.refreshToken}`);
  cb('Hello2')
});