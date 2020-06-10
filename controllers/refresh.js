const asyncRedis = require("async-redis");
const redis = asyncRedis.createClient();
const jwt = require('jsonwebtoken');
require('dotenv').config();
const refresh = async (req, res) => {
  try {
    const refresh_token = req.headers.authorization.slice(7); 
    const secretKey = process.env.TOKEN_KEY;
    await jwt.verify(refresh_token, secretKey);
    let userinfo = await redis.get(refresh_token);
    const access_token = await jwt.sign({userinfo}, secretKey, {expiresIn:'30m'});
    res.status(200).json({access_token});
  }
  catch (err) {
    if(err.name === 'TokenExpiredError') {
      res.status(419).json({
        code:419,
        message:'토큰이 만료되었습니다.'
      });
    }
    console.log(err);
  }
};

module.exports = refresh;