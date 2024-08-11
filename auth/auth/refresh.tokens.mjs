// Import all dependencies ========================================================================================================>
import cote from 'cote';
// import 'dotenv/config';

// Logic ==========================================================================================================================>
const refreshTokensModule = new cote.Responder({ name: 'refresh-tokens-module', namespace: 'refresh-tokens' });

refreshTokensModule.on('refreshTokens', async (req, cb) => {
  const headers = req.params.headers;
  console.log(headers)
  cb('Hello')
});

const refresh = async (req, res, next) => {
  try {
    const token = await Token.findOne({ where: { token: req.cookies.refreshToken } });
    const { userId, username } = token;
    const user = { id: userId, user: username };
    const { accessToken, refreshToken } = authJwt.createToken(user);

    await Token.destroy({ where: { token: req.cookies.refreshToken } });
    await Token.create({ userId: user.id, username: user.user, token: refreshToken });

    res.cookie('refreshToken', refreshToken, { maxAge: 1000*60*60*24, httpOnly: true, secure: true });
    res.status(200).send({ accessToken: accessToken });
  } catch (e) { next(e) };
};