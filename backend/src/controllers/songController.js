const Song = require('../models/Song');
const Album = require('../models/Album');
const User = require('../models/User');
const { cloudinary, uploadToCloudinary } = require('../config/cloudinary');

// @desc    Get all songs
// @route   GET /api/songs
const getSongs = async (req, res) => {
  try {
    const { search, genre, limit = 20, page = 1 } = req.query;
    const query = {};
    if (search) query.$text = { $search: search };
    if (genre) query.genre = new RegExp(genre, 'i');

    const songs = await Song.find(query)
      .populate('album', 'title coverImage')
      .sort({ plays: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Song.countDocuments(query);
    res.json({ songs, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get single song
// @route   GET /api/songs/:id
const getSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id).populate('album');
    if (!song) return res.status(404).json({ message: 'Song not found' });
    // Increment plays
    song.plays += 1;
    await song.save();
    res.json(song);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Upload a new song (Admin)
// @route   POST /api/songs
const uploadSong = async (req, res) => {
  try {
    const { title, artist, genre, albumId, albumName, year, isDownloadable } = req.body;
    if (!title || !artist) return res.status(400).json({ message: 'Title and artist required' });

    let audioUrl = '', audioPublicId = '', coverImage = '', coverPublicId = '';

    if (req.files?.audio) {
      const audioResult = await uploadToCloudinary(req.files.audio[0].buffer, {
        resource_type: 'video',
        folder: 'spotify-clone/songs',
        public_id: `song_${Date.now()}`,
      });
      audioUrl = audioResult.secure_url;
      audioPublicId = audioResult.public_id;
    }

    if (req.files?.cover) {
      const imgResult = await uploadToCloudinary(req.files.cover[0].buffer, {
        resource_type: 'image',
        folder: 'spotify-clone/covers',
        transformation: [{ width: 500, height: 500, crop: 'fill' }],
      });
      coverImage = imgResult.secure_url;
      coverPublicId = imgResult.public_id;
    }

    const song = await Song.create({
      title, artist, genre, albumName,
      album: albumId || null,
      year: year || new Date().getFullYear(),
      audioUrl, audioPublicId, coverImage, coverPublicId,
      uploadedBy: req.user._id,
      isDownloadable: isDownloadable !== 'false',
    });

    // Add to album if provided
    if (albumId) {
      await Album.findByIdAndUpdate(albumId, { $push: { songs: song._id } });
    }

    res.status(201).json(song);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete song (Admin)
// @route   DELETE /api/songs/:id
const deleteSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: 'Song not found' });

    // Remove from Cloudinary
    if (song.audioPublicId) await cloudinary.uploader.destroy(song.audioPublicId, { resource_type: 'video' });
    if (song.coverPublicId) await cloudinary.uploader.destroy(song.coverPublicId);

    await song.deleteOne();
    res.json({ message: 'Song deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Like / unlike a song
// @route   POST /api/songs/:id/like
const toggleLike = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: 'Song not found' });

    const isLiked = user.likedSongs.includes(song._id);
    if (isLiked) {
      user.likedSongs.pull(song._id);
      song.likes = Math.max(0, song.likes - 1);
    } else {
      user.likedSongs.push(song._id);
      song.likes += 1;
    }
    await Promise.all([user.save(), song.save()]);
    res.json({ liked: !isLiked, likes: song.likes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Download a song
// @route   GET /api/songs/:id/download
const downloadSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: 'Song not found' });
    if (!song.isDownloadable) return res.status(403).json({ message: 'Song not available for download' });

    // Track downloaded
    const user = await User.findById(req.user._id);
    if (!user.downloadedSongs.includes(song._id)) {
      user.downloadedSongs.push(song._id);
      await user.save();
    }

    // Return download URL
    res.json({ downloadUrl: song.audioUrl, filename: `${song.title} - ${song.artist}.mp3` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get trending songs
// @route   GET /api/songs/trending
const getTrending = async (req, res) => {
  try {
    const songs = await Song.find().sort({ plays: -1 }).limit(10).populate('album');
    res.json(songs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getSongs, getSong, uploadSong, deleteSong, toggleLike, downloadSong, getTrending };
