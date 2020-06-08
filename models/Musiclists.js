const mongoose = require('mongoose');

const musiclistsSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  listname: { type: String, unique:true},
  musics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Music'}],
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}
}, {
  versionKey: false
});

module.exports = mongoose.model('Musiclist', musiclistsSchema);