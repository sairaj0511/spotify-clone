const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  artist: { type: String, required: true, trim: true },
  coverImage: { type: String, default: '' },
  coverPublicId: { type: String, default: '' },
  genre: { type: String, default: 'Unknown' },
  year: { type: Number, default: new Date().getFullYear() },
  songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
  description: { type: String, default: '' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Album', albumSchema);
