const Musics = require('../models').Musics;
const jwt = require('jsonwebtoken');
const scoringMusic = async (req, res) => {
  try {
    const {thumbnail, videoid, title, rating} = req.body;
    const access_token = req.headers.authorization.slice(7);
    const secretKey = process.env.TOKEN_KEY;
    const userinfo = await jwt.verify(access_token, secretKey);
    if(userinfo.id) {
      let music = await Musics.create({
        thumbnail,
        videoid,
        title,
        rating,
        user_id: userinfo.id
      });
      return res.status(201).json(music);
    }
    return res.status(404).end('잘못된 토큰입니다');
  }
  catch(err){
    if(err.name === 'TokenExpiredError') {
      res.status(419).json({
        code:419,
        message:'토큰이 만료되었습니다.'
      });
    }
    console.log(err);
  }
};
  
module.exports = scoringMusic;