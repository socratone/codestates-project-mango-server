const Musics = require('../models').Musics;
const jwt = require('jsonwebtoken');
const ratingMusic = async (req, res) => {
  try {
    const {thumbnail, videoid, title, rating} = req.body;
    const access_token = req.headers.authorization.slice(7);
    const secretKey = process.env.TOKEN_KEY;
    const userinfo = await jwt.verify(access_token, secretKey);
    if(userinfo.id) {
      const {doc, created} = await Musics.findOrCreate({
        thumbnail,
        videoid,
        title,
        rating,
        user_id: userinfo.id
      });
      return created ? 
        res.status(201).json(doc) : 
        res.status(409).end('이미 점수를 매긴 음악입니다');
    }
    return res.status(404).end('잘못된 토큰입니다');
  }
  catch(err){
    if(err.name === 'TokenExpiredError') {
      return res.status(419).json({
        code:419,
        message:'토큰이 만료되었습니다.'
      });
    }
    return res.status(500).end('Server error');
  }
};
  
module.exports = ratingMusic;