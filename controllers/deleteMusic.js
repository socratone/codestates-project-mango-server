const Musiclists = require('../models').Musiclists;
const errorHandling = require('../errorHandling');
const deleteMusic = async (req, res) => {
  const {videoid, listname} = req.body;
  const user_id = await errorHandling(req, res);
  if(!user_id) return;
  await Musiclists.update({listname, user_id},{$pull: {musics: {videoid}}});
  res.status(200).send('ok');
};

module.exports = deleteMusic;