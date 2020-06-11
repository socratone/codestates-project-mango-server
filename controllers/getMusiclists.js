const Musiclists = require('../models').Musiclists;
const jwt = require('jsonwebtoken');
const getMusiclist = async (req, res) => {
  try{
    const access_token = req.headers.authorization.slice(7);
    const secretKey = process.env.TOKEN_KEY;
    const userinfo = await jwt.verify(access_token, secretKey);
    if(userinfo.id) {
      const musiclists = await Musiclists.find({user_id:userinfo.id});
      return res.status(200).json(musiclists);
    }
    return res.status(404).end('잘못된 토큰입니다');
  }
  catch(err) {
    if(err.name === 'TokenExpiredError') {
      return res.status(419).json({
        code:419,
        message:'토큰이 만료되었습니다.'
      });
    }
    return res.status(500).end('Server error');
  }
};

module.exports = getMusiclist;