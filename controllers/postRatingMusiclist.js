const Musics = require('../models').Musics;
const errorHandling = require('../errorHandling');
const postRatingMusiclist = async (req, res) => {
  const ratingMusiclist = req.body; 
  const user_id = await errorHandling(req, res);
  for(let music of ratingMusiclist) {
    music.user_id = user_id;
  }
  if(!user_id) return;
  const musiclist = await Musics.insertMany(ratingMusiclist);
  res.status(201).json(musiclist);
};

module.exports = postRatingMusiclist;