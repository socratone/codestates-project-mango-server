const asyncRedis = require("async-redis");
const redis = asyncRedis.createClient();
const signout = async (req, res) => {
  const{access_token, refresh_token} = req.body;
  await redis.set(`blacklist_${access_token}`, true);
  await redis.expire(`blacklist_${access_token}`, 60*30);
  await redis.set(`blacklist_${refresh_token}`, true);
  await redis.expire(`blacklist_${refresh_token}`, 8640 * 14);
  res.status(200).send('ok');
};

module.exports = signout;