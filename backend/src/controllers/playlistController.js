const Playlist = require('../models/Playlist');

const getMyPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({ owner: req.user._id }).populate('songs');
    res.json(playlists);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const getPublicPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({ isPublic: true })
      .populate('songs').populate('owner', 'name avatar').sort({ createdAt: -1 }).limit(20);
    res.json(playlists);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const getPlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id)
      .populate('songs').populate('owner', 'name avatar');
    if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
    res.json(playlist);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const createPlaylist = async (req, res) => {
  try {
    const { name, description, isPublic } = req.body;
    if (!name) return res.status(400).json({ message: 'Playlist name required' });
    const playlist = await Playlist.create({
      name, description, isPublic: isPublic !== false, owner: req.user._id,
    });
    res.status(201).json(playlist);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const updatePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
    if (playlist.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });
    Object.assign(playlist, req.body);
    await playlist.save();
    res.json(playlist);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const deletePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
    if (playlist.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized' });
    await Playlist.deleteOne({ _id: playlist._id });
    res.json({ message: 'Playlist deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const addSongToPlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
    if (playlist.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });
    if (playlist.songs.includes(req.body.songId))
      return res.status(400).json({ message: 'Song already in playlist' });
    playlist.songs.push(req.body.songId);
    await playlist.save();
    res.json(await playlist.populate('songs'));
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const removeSongFromPlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
    if (playlist.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });
    playlist.songs.pull(req.params.songId);
    await playlist.save();
    res.json(await playlist.populate('songs'));
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = {
  getMyPlaylists, getPublicPlaylists, getPlaylist, createPlaylist,
  updatePlaylist, deletePlaylist, addSongToPlaylist, removeSongFromPlaylist,
};
