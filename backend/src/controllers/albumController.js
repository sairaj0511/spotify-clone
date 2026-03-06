const Album = require('../models/Album');
const Song = require('../models/Song');
const { uploadToCloudinary, cloudinary } = require('../config/cloudinary');

const getAlbums = async (req, res) => {
  try {
    const albums = await Album.find().populate('songs').sort({ createdAt: -1 });
    res.json(albums);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const getAlbum = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id).populate('songs');
    if (!album) return res.status(404).json({ message: 'Album not found' });
    res.json(album);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const createAlbum = async (req, res) => {
  try {
    const { title, artist, genre, year, description } = req.body;
    if (!title || !artist) return res.status(400).json({ message: 'Title and artist required' });

    let coverImage = '', coverPublicId = '';
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, {
        resource_type: 'image',
        folder: 'spotify-clone/album-covers',
        transformation: [{ width: 500, height: 500, crop: 'fill' }],
      });
      coverImage = result.secure_url;
      coverPublicId = result.public_id;
    }

    const album = await Album.create({
      title, artist, genre, year, description,
      coverImage, coverPublicId, createdBy: req.user._id,
    });
    res.status(201).json(album);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const deleteAlbum = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    if (!album) return res.status(404).json({ message: 'Album not found' });
    if (album.coverPublicId) await cloudinary.uploader.destroy(album.coverPublicId);
    await Album.deleteOne({ _id: album._id });
    res.json({ message: 'Album deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { getAlbums, getAlbum, createAlbum, deleteAlbum };
