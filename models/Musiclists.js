const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');

const musiclistsSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  listname: { type: String },
  musics: Array,
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}
}, {
  versionKey: false
});
musiclistsSchema.plugin(findOrCreate);
module.exports = mongoose.model('Musiclist', musiclistsSchema);