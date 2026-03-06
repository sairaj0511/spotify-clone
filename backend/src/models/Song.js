const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  artist: { type: String, required: true, trim: true },
  album: { type: mongoose.Schema.Types.ObjectId, ref: 'Album', default: null },
  albumName: { type: String, default: '' },
  genre: { type: String, default: 'Unknown' },
  duration: { type: Number, default: 0 }, // in seconds
  audioUrl: { type: String, required: true },
  audioPublicId: { type: String, default: '' },
  coverImage: { type: String, default: '' },
  coverPublicId: { type: String, default: '' },
  plays: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isDownloadable: { type: Boolean, default: true },
  tags: [String],
  year: { type: Number, default: new Date().getFullYear() },
}, { timestamps: true });

// Text search index
songSchema.index({ title: 'text', artist: 'text', genre: 'text' });

module.exports = mongoose.model('Song', songSchema);
